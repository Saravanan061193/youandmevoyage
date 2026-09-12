export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryFaqs,
  setInMemoryFaqs,
  addInMemoryFaq,
  FaqItem,
} from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { FaqSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function GET() {
  try {
    const dbPromise = prisma.faq.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const faqs = await Promise.race([dbPromise, timeoutPromise]);

    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      setInMemoryFaqs(faqs as any);
      return NextResponse.json(faqs);
    }
    return NextResponse.json(getInMemoryFaqs());
  } catch (error: any) {
    return NextResponse.json(getInMemoryFaqs());
  }
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'CREATE_FAQ', 'FAQS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = FaqSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid FAQ payload' }, { status: 400 });
    }
    const body = sanitizeObject(parseResult.data);
    const { question, answer, category } = body;

    let createdFaq: FaqItem | null = null;

    try {
      const dbPromise = prisma.faq.create({
        data: {
          question,
          answer,
          category: category || 'Booking & Inclusions',
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);

      if (dbRes && dbRes.id) {
        createdFaq = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB create FAQ failed/timed out, saving to memory fallback', dbErr);
    }

    if (!createdFaq) {
      createdFaq = {
        id: `faq-${Date.now()}`,
        question,
        answer,
        category: category || 'Booking & Inclusions',
        createdAt: new Date().toISOString(),
      };
    }

    addInMemoryFaq(createdFaq);

    revalidatePath('/');
    revalidatePath('/contact');
    revalidateTag('faqs');

    return NextResponse.json(createdFaq, { status: 201 });
  } catch (e) {
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
