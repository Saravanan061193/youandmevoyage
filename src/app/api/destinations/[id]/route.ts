import { NextResponse } from 'next/server';
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

    try {
      const dbPromise = prisma.destination.update({
        where: { id: params.id },
        data: {
          title,
          subtitle,
          image,
          region,
          size,
          description,
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        updateInMemoryDestination(params.id, dbRes);
        return NextResponse.json(dbRes);
      }
    } catch (dbErr) {}

    const updated = updateInMemoryDestination(params.id, body) || { id: params.id, ...body };
    return NextResponse.json(updated);
  } catch (error: any) {
    const updated = updateInMemoryDestination(params.id, body) || { id: params.id, ...body };
    return NextResponse.json(updated);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    deleteInMemoryDestination(params.id);
    await prisma.destination.delete({
      where: { id: params.id },
    }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    deleteInMemoryDestination(params.id);
    return NextResponse.json({ success: true });
  }
}
