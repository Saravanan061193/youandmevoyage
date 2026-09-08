import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { FaqSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

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
    logAuditEvent(request, 'UPDATE_FAQ', 'FAQS', 'SUCCESS', { resourceId: params.id });
    return NextResponse.json({ id: params.id, ...body });
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
    logAuditEvent(request, 'DELETE_FAQ', 'FAQS', 'SUCCESS', { resourceId: params.id });
    return NextResponse.json({ success: true, id: params.id });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 400 });
  }
}
