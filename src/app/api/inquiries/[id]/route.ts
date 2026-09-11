import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { updateInMemoryInquiry, deleteInMemoryInquiry } from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { InquiryUpdateSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'UPDATE_INQUIRY', 'INQUIRIES', 'UNAUTHORIZED', { resourceId: params.id });
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parseResult = InquiryUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
    }

    const sanitizedData = sanitizeObject(parseResult.data);

    try {
      const inquiry = await prisma.inquiry.update({
        where: { id: params.id },
        data: sanitizedData,
      });
      updateInMemoryInquiry(params.id, sanitizedData);
      logAuditEvent(request, 'UPDATE_INQUIRY', 'INQUIRIES', 'SUCCESS', { resourceId: params.id });

      revalidatePath('/admin');
      revalidateTag('inquiries');

      return NextResponse.json(inquiry);
    } catch (dbErr) {
      const updatedInMemory = updateInMemoryInquiry(params.id, sanitizedData);
      logAuditEvent(request, 'UPDATE_INQUIRY', 'INQUIRIES', 'SUCCESS', { resourceId: params.id });

      revalidatePath('/admin');
      revalidateTag('inquiries');

      return NextResponse.json(updatedInMemory || { id: params.id, ...sanitizedData });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'DELETE_INQUIRY', 'INQUIRIES', 'UNAUTHORIZED', { resourceId: params.id });
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    try {
      await prisma.inquiry.delete({
        where: { id: params.id },
      });
    } catch (dbErr) {}

    deleteInMemoryInquiry(params.id);
    logAuditEvent(request, 'DELETE_INQUIRY', 'INQUIRIES', 'SUCCESS', { resourceId: params.id });

    revalidatePath('/admin');
    revalidateTag('inquiries');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
