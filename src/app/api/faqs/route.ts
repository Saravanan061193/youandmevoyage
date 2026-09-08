import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { FaqSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'What is included in a Discovery Safaris private expedition?',
    answer: 'All our private safaris include a dedicated 4x4 land cruiser vehicle with pop-up roof, an expert FGASA certified guide, luxury lodge or tented camp accommodations, all park entrance fees, 3 meals daily, bottled mineral water, and complimentary Flying Doctors medical evacuation insurance.',
    category: 'Booking & Inclusions',
  },
  {
    id: 'faq-2',
    question: 'When is the best time of year to visit Namibia for wildlife?',
    answer: 'The dry winter season (May to October) is ideal for game viewing in Etosha, as animals congregate around waterholes. However, November to April offers lush green desert landscapes, migratory birding, and newborn wildlife.',
    category: 'Safari Planning',
  },
  {
    id: 'faq-3',
    question: 'Are private safaris suitable for families with children or seniors?',
    answer: 'Yes! Because our safaris are 100% private, the pace, driving hours, meal stops, and daily activities are completely customized to your group’s comfort, preferences, and age range.',
    category: 'Safari Planning',
  },
  {
    id: 'faq-4',
    question: 'What medical safety and vehicle protocols do you have in place?',
    answer: 'Every 4x4 expedition vehicle is equipped with dual satellite communication phones, real-time GPS tracking linked to our Windhoek HQ, first-aid medical trauma kits, onboard oxygen, and emergency Westair Flying Doctor air evacuation coverage for all guests.',
    category: 'Safety & Health',
  },
  {
    id: 'faq-5',
    question: 'How far in advance should we book a private Namibia safari?',
    answer: 'We recommend booking 6 to 12 months in advance, especially for high-season travel (July to October), as boutique luxury lodges in Sossusvlei, Etosha, and Damaraland have limited room capacity.',
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
      return NextResponse.json(memoryFaqs);
    }
    return NextResponse.json(memoryFaqs);
  } catch (e) {
    return NextResponse.json(memoryFaqs);
  }
}
