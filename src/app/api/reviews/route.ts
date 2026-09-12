export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryReviews,
  setInMemoryReviews,
  addInMemoryReview,
  ReviewItem,
} from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { ReviewSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function GET() {
  try {
    const dbPromise = prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const reviews = await Promise.race([dbPromise, timeoutPromise]);

    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      setInMemoryReviews(reviews as any);
      return NextResponse.json(reviews);
    }
    return NextResponse.json(getInMemoryReviews());
  } catch (error: any) {
    return NextResponse.json(getInMemoryReviews());
  }
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'CREATE_REVIEW', 'REVIEWS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = ReviewSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 });
    }
    const body = sanitizeObject(parseResult.data);
    const { author, country, countryFlag, rating, text } = body;

    let createdReview: ReviewItem | null = null;

    try {
      const dbPromise = prisma.review.create({
        data: {
          author,
          country,
          countryFlag: countryFlag || 'US',
          rating: Number(rating) || 5,
          text,
          verified: true,
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);

      if (dbRes && dbRes.id) {
        createdReview = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB create review timed out/failed, storing in memory cache', dbErr);
    }

    if (!createdReview) {
      createdReview = {
        id: `rev-${Date.now()}`,
        author,
        country: country || 'United States',
        countryFlag: countryFlag || 'US',
        rating: Number(rating) || 5,
        text,
        verified: true,
        createdAt: new Date().toISOString(),
      };
    }

    // Always record in in-memory store
    addInMemoryReview(createdReview);

    revalidatePath('/reviews');
    revalidatePath('/');
    revalidateTag('reviews');

    return NextResponse.json(createdReview, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function PATCH(request: Request) {
  return POST(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-auth',
    },
  });
}
