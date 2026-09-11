import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { FaqSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'What is included in a You & Me – Independent Voyage private tour package?',
    answer: 'All our private South India tour packages include a dedicated AC vehicle (Sedan/SUV/Tempo Traveller) with an experienced professional driver companion, handpicked boutique or heritage hotel stays with daily breakfast, temple entrance assistance, spice plantation guided walks, and 24/7 personal trip support.',
    category: 'Booking & Inclusions',
  },
  {
    id: 'faq-2',
    question: 'When is the best time of year to visit South India (Tamil Nadu & Kerala)?',
    answer: 'The winter season (October to March) is ideal for exploring South India’s temple heritage, cool hill stations like Munnar & Coorg, and serene Kerala backwater houseboats with pleasant weather.',
    category: 'Tour Planning',
  },
  {
    id: 'faq-3',
    question: 'Are private tour packages suitable for families with children or seniors?',
    answer: 'Yes! Because our tour packages are 100% private, the pace, driving hours, rest stops, meal choices, and daily activities are completely customized to your group’s comfort, age range, and preferences.',
    category: 'Tour Planning',
  },
  {
    id: 'faq-4',
    question: 'What safety and vehicle protocols do you have in place?',
    answer: 'Every private tour vehicle is fully air-conditioned, regularly serviced, comprehensively insured, and driven by a verified, experienced local companion backed by 24/7 dispatch support.',
    category: 'Safety & Health',
  },
  {
    id: 'faq-5',
    question: 'How far in advance should we book a custom private South India journey?',
    answer: 'We recommend booking 2 to 6 months in advance, especially for high-season travel (October to March), as boutique heritage hotels in Chettinad, Pondicherry, and luxury Alleppey houseboats fill up quickly.',
    category: 'Booking & Inclusions',
  },
];

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
