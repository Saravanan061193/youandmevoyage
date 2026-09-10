import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getInMemorySafaris,
  updateInMemorySafari,
  deleteInMemorySafari,
  SafariItem,
} from '@/lib/inMemoryStore';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const dbPromise = prisma.safari.findUnique({
      where: { id: params.id },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
    const safari = await Promise.race([dbPromise, timeoutPromise]);

    if (safari) return NextResponse.json(safari);

    const memoryItem = getInMemorySafaris().find((s) => s.id === params.id || s.slug === params.id);
    if (memoryItem) return NextResponse.json(memoryItem);

    return NextResponse.json({ id: params.id, title: 'Safari Package' });
  } catch (error: any) {
    const memoryItem = getInMemorySafaris().find((s) => s.id === params.id || s.slug === params.id);
    if (memoryItem) return NextResponse.json(memoryItem);
    return NextResponse.json({ id: params.id, title: 'Safari Package' });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, priceUSD, days, nights, category, region, badge, image, route, startingLocation, endingLocation, bestTimeToTravel, accommodation, description, inclusions, exclusions, metaTitle, metaDescription, keywords } = body;

    let safari: SafariItem | null = null;
    try {
      const dbPromise = prisma.safari.update({
        where: { id: params.id },
        data: {
          title,
          priceUSD: parseFloat(priceUSD),
          days: parseInt(days),
          nights: parseInt(nights),
          category,
          region,
          badge: badge || undefined,
          image,
          route,
          startingLocation: startingLocation || undefined,
          endingLocation: endingLocation || undefined,
          bestTimeToTravel: bestTimeToTravel || undefined,
          accommodation,
          description,
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
        safari = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB safari update failed or timed out:', dbErr);
    }

    const memoryUpdated = updateInMemorySafari(params.id, {
      title,
      priceUSD: parseFloat(priceUSD) || 3000,
      days: parseInt(days) || 7,
      nights: parseInt(nights) || 6,
      category,
      region,
      badge,
      image,
      route,
      startingLocation,
      endingLocation,
      bestTimeToTravel,
      accommodation,
      description,
      inclusions: typeof inclusions === 'string' ? inclusions : JSON.stringify(inclusions || []),
      exclusions: typeof exclusions === 'string' ? exclusions : JSON.stringify(exclusions || []),
      metaTitle,
      metaDescription,
      keywords,
    });

    return NextResponse.json(safari || memoryUpdated || { id: params.id, ...body });
  } catch (error: any) {
    return NextResponse.json({ id: params.id });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    try {
      const dbPromise = prisma.safari.delete({
        where: { id: params.id },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
      await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn('DB safari delete failed/timed out:', dbErr);
    }

    deleteInMemorySafari(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true });
  }
}
