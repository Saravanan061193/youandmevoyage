export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  updateInMemoryDestination,
  deleteInMemoryDestination,
} from '@/lib/inMemoryStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  let body: any = {};
  try {
    body = await request.json();
    const { title, subtitle, image, region, size, description } = body;
    const generatedSlug = body.slug || (title || 'destination').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    let result = null;

    try {
      const dbPromise = prisma.destination.update({
        where: { id: params.id },
        data: {
          title,
          slug: generatedSlug,
          subtitle,
          image,
          region,
          size,
          description,
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        updateInMemoryDestination(params.id, dbRes);
        result = dbRes;
      }
    } catch (dbErr) {}

    if (!result) {
      result = updateInMemoryDestination(params.id, body) || { id: params.id, ...body };
    }

    revalidatePath('/destinations');
    revalidatePath('/about');
    revalidatePath('/');
    revalidateTag('destinations');

    return NextResponse.json(result);
  } catch (error: any) {
    const updated = updateInMemoryDestination(params.id, body) || { id: params.id, ...body };
    revalidatePath('/destinations');
    revalidatePath('/about');
    revalidatePath('/');
    revalidateTag('destinations');
    return NextResponse.json(updated);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    deleteInMemoryDestination(params.id);
    await prisma.destination.delete({
      where: { id: params.id },
    }).catch(() => {});

    revalidatePath('/destinations');
    revalidatePath('/about');
    revalidatePath('/');
    revalidateTag('destinations');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    deleteInMemoryDestination(params.id);
    revalidatePath('/destinations');
    revalidatePath('/about');
    revalidatePath('/');
    revalidateTag('destinations');
    return NextResponse.json({ success: true });
  }
}

export async function GET(request: Request, context: { params: { id: string } }) {
  return PUT(request, context);
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
