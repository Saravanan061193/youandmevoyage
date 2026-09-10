import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getInMemorySafaris,
  setInMemorySafaris,
  addInMemorySafari,
  SafariItem,
} from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { SafariSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const maxBudget = searchParams.get('maxBudget');
    const region = searchParams.get('region');

    const where: any = {};

    if (category && category !== 'All') {
      where.category = category;
    }
    if (region && region !== 'All') {
      where.region = region;
    }
    if (maxBudget) {
      where.priceUSD = { lte: parseFloat(maxBudget) };
    }

    const dbPromise = prisma.safari.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
    const safaris = await Promise.race([dbPromise, timeoutPromise]);

    let memoryList = getInMemorySafaris();
    if (category && category !== 'All') {
      memoryList = memoryList.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (region && region !== 'All') {
      memoryList = memoryList.filter((s) => s.region.toLowerCase() === region.toLowerCase());
    }
    if (maxBudget) {
      memoryList = memoryList.filter((s) => s.priceUSD <= parseFloat(maxBudget));
    }

    if (safaris && Array.isArray(safaris) && safaris.length > 0) {
      const dbIds = new Set(safaris.map((s: any) => s.id));
      const memoryOnlyItems = memoryList.filter((m) => !dbIds.has(m.id));
      const merged = [...memoryOnlyItems, ...safaris];
      setInMemorySafaris(merged as any);
      return NextResponse.json(merged);
    }

    return NextResponse.json(memoryList);
  } catch (error: any) {
    return NextResponse.json(getInMemorySafaris());
  }
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'CREATE_SAFARI', 'SAFARIS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = SafariSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || 'Invalid safari package payload';
      console.error('[SAFARI_VALIDATION_ERROR]', parseResult.error.format());
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    const body = sanitizeObject(parseResult.data);
    const {
      title,
      priceUSD,
      days,
      nights,
      category,
      region,
      badge,
      image,
      route,
      accommodation,
      description,
      inclusions,
      exclusions,
      metaTitle,
      metaDescription,
      keywords,
    } = body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let createdSafari: SafariItem | null = null;

    try {
      const dbPromise = prisma.safari.create({
        data: {
          title,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          priceUSD: Number(priceUSD),
          days: Number(days),
          nights: Number(nights),
          category,
          region,
          badge: badge || undefined,
          image: image || '',
          route: route || '',
          accommodation: accommodation || '',
          description: description || '',
          inclusions: typeof inclusions === 'string' ? inclusions : JSON.stringify(inclusions || []),
          exclusions: typeof exclusions === 'string' ? exclusions : JSON.stringify(exclusions || []),
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          keywords: keywords || undefined,

        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        createdSafari = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB create safari timed out/failed, storing in memory cache', dbErr);
    }

    if (!createdSafari) {
      createdSafari = {
        id: `safari-${Date.now()}`,
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        priceUSD: Number(priceUSD) || 3000,
        days: Number(days) || 7,
        nights: Number(nights) || 6,
        category: category || 'Customized Private',
        region: region || 'Tamil Nadu',
        badge: badge || null,
        image: image || 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85',
        route: route || '',
        accommodation: accommodation || '',
        description: description || '',
        inclusions: typeof inclusions === 'string' ? inclusions : JSON.stringify(inclusions || []),
        exclusions: typeof exclusions === 'string' ? exclusions : JSON.stringify(exclusions || []),
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        keywords: keywords || null,
        createdAt: new Date().toISOString(),
      };
    }

    addInMemorySafari(createdSafari);

    return NextResponse.json(createdSafari, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

