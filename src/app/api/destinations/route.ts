import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryDestinations,
  setInMemoryDestinations,
  addInMemoryDestination,
  DestinationItem,
} from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { DestinationSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function GET() {
  try {
    const dbPromise = prisma.destination.findMany({
      orderBy: { order: 'asc' },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
    const destinations = await Promise.race([dbPromise, timeoutPromise]);

    if (destinations !== null && Array.isArray(destinations)) {
      setInMemoryDestinations(destinations as any);
      return NextResponse.json(destinations);
    }
    return NextResponse.json(getInMemoryDestinations());
  } catch (error: any) {
    return NextResponse.json(getInMemoryDestinations());
  }
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'CREATE_DESTINATION', 'DESTINATIONS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  let body: any = {};
  try {
    const rawBody = await request.json();
    const parseResult = DestinationSchema.safeParse(rawBody);
    if (!parseResult.success) {
      console.warn('Destination validation error:', parseResult.error.format());
      return NextResponse.json({ error: 'Invalid destination payload. Check inputs.' }, { status: 400 });
    }
    body = sanitizeObject(parseResult.data);
    const { title, subtitle, image, region, size, description } = body;
    const generatedSlug = body.slug || (title || 'destination').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);

    let createdDest: DestinationItem | null = null;

    try {
      const dbPromise = prisma.destination.create({
        data: {
          title,
          slug: generatedSlug,
          subtitle: subtitle || '',
          image: image || 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
          region: region || 'Tamil Nadu',
          size: size || 'short',
          description: description || '',
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        createdDest = dbRes;
      }
    } catch (dbErr) {
      console.warn('Prisma destination create failed:', dbErr);
    }

    if (!createdDest) {
      createdDest = {
        id: `dest-${Date.now()}`,
        title,
        slug: generatedSlug,
        subtitle,
        image: image || 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
        region: region || 'Tamil Nadu',
        size: size || 'short',
        description: description || '',
        createdAt: new Date().toISOString(),
      };
    }

    addInMemoryDestination(createdDest);

    revalidatePath('/destinations');
    revalidatePath('/about');
    revalidatePath('/');
    revalidateTag('destinations');

    return NextResponse.json(createdDest, { status: 201 });
  } catch (error: any) {
    const fallbackItem = {
      id: `dest-${Date.now()}`,
      title: body.title || 'New Destination',
      subtitle: body.subtitle || '',
      image: body.image || 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
      region: body.region || 'Central',
      size: body.size || 'short',
      description: body.description || '',
      createdAt: new Date().toISOString(),
    };
    addInMemoryDestination(fallbackItem);

    revalidatePath('/destinations');
    revalidatePath('/about');
    revalidatePath('/');
    revalidateTag('destinations');

    return NextResponse.json(fallbackItem, { status: 201 });
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
