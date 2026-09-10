import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getInMemoryInquiries, addInMemoryInquiry } from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';
import { InquirySchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';
import { sendInquiryNotificationEmail } from '@/lib/email';

export async function GET(request: Request) {
  // Guard: Protect customer inquiries PII against unauthorized access
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'READ_INQUIRIES', 'INQUIRIES', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbPromise = prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const inquiries = await Promise.race([dbPromise, timeoutPromise]);

    if (!inquiries || !Array.isArray(inquiries) || inquiries.length === 0) {
      return NextResponse.json(getInMemoryInquiries());
    }
    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json(getInMemoryInquiries());
  }
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // Rate Limit: max 5 guest inquiry submissions per 10 minutes per IP
  const rl = checkRateLimit(`inquiry:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: `Too many inquiry requests. Please wait ${rl.resetInSeconds} seconds before submitting again.` },
      { status: 429 }
    );
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Validate request schema with Zod
    const parseResult = InquirySchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || 'Invalid input data';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const validatedData = parseResult.data;
    const sanitizedData = sanitizeObject(validatedData);

    const newInquiryObj = {
      id: `inq-${Date.now()}`,
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone || '',
      category: sanitizedData.category || 'General Safari Inquiry',
      destination: sanitizedData.destination || null,
      month: sanitizedData.month || null,
      duration: sanitizedData.duration || null,
      travelers: sanitizedData.travelers,
      message: sanitizedData.message || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const dbInquiry = await prisma.inquiry.create({
        data: {
          name: newInquiryObj.name,
          email: newInquiryObj.email,
          phone: newInquiryObj.phone,
          category: newInquiryObj.category,
          destination: newInquiryObj.destination,
          month: newInquiryObj.month,
          duration: newInquiryObj.duration,
          travelers: newInquiryObj.travelers,
          message: newInquiryObj.message,
          status: 'Pending',
        },
      });
      addInMemoryInquiry(dbInquiry as any);
      logAuditEvent(request, 'SUBMIT_INQUIRY', 'INQUIRIES', 'SUCCESS', { resourceId: dbInquiry.id });
      
      // Send email notification in background
      sendInquiryNotificationEmail({
        name: dbInquiry.name,
        email: dbInquiry.email,
        phone: dbInquiry.phone || '',
        category: dbInquiry.category || 'General Safari Inquiry',
        destination: dbInquiry.destination || '',
        travelers: dbInquiry.travelers,
        duration: dbInquiry.duration || '',
        message: dbInquiry.message || '',
      }).catch((err) => console.error('[INQUIRY_EMAIL_TRIGGER_ERROR]', err));

      return NextResponse.json(dbInquiry, { status: 201 });
    } catch (dbErr) {
      const savedInMemory = addInMemoryInquiry(newInquiryObj);
      logAuditEvent(request, 'SUBMIT_INQUIRY', 'INQUIRIES', 'SUCCESS', { resourceId: newInquiryObj.id });
      
      sendInquiryNotificationEmail({
        name: newInquiryObj.name,
        email: newInquiryObj.email,
        phone: newInquiryObj.phone || '',
        category: newInquiryObj.category || 'General Safari Inquiry',
        destination: newInquiryObj.destination || '',
        travelers: newInquiryObj.travelers,
        duration: newInquiryObj.duration || '',
        message: newInquiryObj.message || '',
      }).catch((err) => console.error('[INQUIRY_EMAIL_TRIGGER_ERROR]', err));

      return NextResponse.json(savedInMemory, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process inquiry request' }, { status: 400 });
  }
}
