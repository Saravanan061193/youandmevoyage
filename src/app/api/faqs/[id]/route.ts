export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { updateInMemoryFaq, deleteInMemoryFaq, getInMemoryFaqs } from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { FaqSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const dbPromise = prisma.faq.findUnique({ where: { id: params.id } });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const faq = await Promise.race([dbPromise, timeoutPromise]);

    if (faq) return NextResponse.json(faq);

    const memoryItem = getInMemoryFaqs().find((f) => f.id === params.id);
    if (memoryItem) return NextResponse.json(memoryItem);

    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  } catch (e) {
    const memoryItem = getInMemoryFaqs().find((f) => f.id === params.id);
    if (memoryItem) return NextResponse.json(memoryItem);
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'UPDATE_FAQ', 'FAQS', 'UNAUTHORIZED', { resourceId: params.id });
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

    let updatedFaq: any = null;

    try {
      const dbPromise = prisma.faq.update({
        where: { id: params.id },
        data: { question, answer, category },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      updatedFaq = await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn('DB update FAQ failed/timed out, updating memory fallback', dbErr);
    }

    const memoryUpdated = updateInMemoryFaq(params.id, { question, answer, category });

    logAuditEvent(request, 'UPDATE_FAQ', 'FAQS', 'SUCCESS', { resourceId: params.id });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidateTag('faqs');

    return NextResponse.json(updatedFaq || memoryUpdated || { id: params.id, ...body });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'DELETE_FAQ', 'FAQS', 'UNAUTHORIZED', { resourceId: params.id });
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    try {
      const dbPromise = prisma.faq.delete({ where: { id: params.id } });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn('DB delete FAQ failed/timed out', dbErr);
    }

    deleteInMemoryFaq(params.id);

    logAuditEvent(request, 'DELETE_FAQ', 'FAQS', 'SUCCESS', { resourceId: params.id });

    revalidatePath('/');
    revalidatePath('/contact');
    revalidateTag('faqs');

    return NextResponse.json({ success: true, id: params.id });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 400 });
  }
}

export async function POST(request: Request, context: { params: { id: string } }) {
  return PUT(request, context);
}

export async function PATCH(request: Request, context: { params: { id: string } }) {
  return PUT(request, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-auth',
    },
  });
}
