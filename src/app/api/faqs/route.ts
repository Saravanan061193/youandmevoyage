export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { FaqSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

const DEFAULT_FAQS: any[] = [];

let memoryFaqs = [...DEFAULT_FAQS];

export async function GET() {
  return NextResponse.json(memoryFaqs);
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
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: body.question,
      answer: body.answer,
      category: body.category,
    };
    memoryFaqs.unshift(newFaq);
    logAuditEvent(request, 'CREATE_FAQ', 'FAQS', 'SUCCESS', { resourceId: newFaq.id });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidateTag('faqs');

    return NextResponse.json(newFaq, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'UPDATE_FAQS', 'FAQS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      memoryFaqs = sanitizeObject(body);
      logAuditEvent(request, 'UPDATE_FAQS', 'FAQS', 'SUCCESS');

      revalidatePath('/');
      revalidatePath('/contact');
      revalidateTag('faqs');

      return NextResponse.json(memoryFaqs);
    }

    revalidatePath('/');
    revalidatePath('/contact');
    revalidateTag('faqs');

    return NextResponse.json(memoryFaqs);
  } catch (e) {
    return NextResponse.json(memoryFaqs);
  }
}

export async function PATCH(request: Request) {
  return PUT(request);
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
