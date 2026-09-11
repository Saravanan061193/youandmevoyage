import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  updateInMemoryReview,
  deleteInMemoryReview,
  ReviewItem,
} from '@/lib/inMemoryStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { author, country, countryFlag, rating, text } = body;

    let updatedReview: ReviewItem | null = null;

    try {
      const dbPromise = prisma.review.update({
        where: { id: params.id },
        data: {
          author,
          country,
          countryFlag,
          rating: parseInt(rating),
          text,
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        updatedReview = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB review update timed out/failed, updating in memory', dbErr);
    }

    // Always update in memory
    const memoryUpdated = updateInMemoryReview(params.id, {
      author,
      country,
      countryFlag,
      rating: parseInt(rating) || 5,
      text,
    });

    revalidatePath('/reviews');
    revalidatePath('/');
    revalidateTag('reviews');

    return NextResponse.json(updatedReview || memoryUpdated || { id: params.id, author, country, countryFlag, rating, text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    try {
      const dbPromise = prisma.review.delete({
        where: { id: params.id },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn('DB review delete timed out/failed, deleting in memory', dbErr);
    }

    deleteInMemoryReview(params.id);

    revalidatePath('/reviews');
    revalidatePath('/');
    revalidateTag('reviews');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
