import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryBlogs,
  updateInMemoryBlog,
  deleteInMemoryBlog,
  BlogItem,
} from '@/lib/inMemoryStore';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const identifier = params.id;

    let blog = null;
    try {
      const dbPromise = prisma.blogPost.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
      blog = await Promise.race([dbPromise, timeoutPromise]);
    } catch (e) {
      console.warn('DB blog fetch failed:', e);
    }

    if (blog) return NextResponse.json(blog);

    const memoryItem = getInMemoryBlogs().find(
      (b) => b.id === identifier || b.slug === identifier
    );

    if (memoryItem) return NextResponse.json(memoryItem);

    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  } catch (error: any) {
    const memoryItem = getInMemoryBlogs().find(
      (b) => b.id === params.id || b.slug === params.id
    );
    if (memoryItem) return NextResponse.json(memoryItem);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      authorRole,
      category,
      readTime,
      metaTitle,
      metaDescription,
      published,
    } = body;

    let updatedBlog: BlogItem | null = null;
    try {
      const dbPromise = prisma.blogPost.update({
        where: { id: params.id },
        data: {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          author,
          authorRole,
          category,
          readTime,
          metaTitle,
          metaDescription,
          published: Boolean(published),
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        updatedBlog = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB blog update failed/timed out:', dbErr);
    }

    const memoryUpdated = updateInMemoryBlog(params.id, {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      authorRole,
      category,
      readTime,
      metaTitle,
      metaDescription,
      published: Boolean(published),
    });

    revalidatePath('/blog');
    revalidatePath('/travel-journal');
    revalidatePath('/');
    revalidateTag('blogs');

    return NextResponse.json(updatedBlog || memoryUpdated || { id: params.id, ...body });
  } catch (error: any) {
    return NextResponse.json({ id: params.id, ...await request.clone().json().catch(() => ({})) });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    try {
      const dbPromise = prisma.blogPost.delete({
        where: { id: params.id },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
      await Promise.race([dbPromise, timeoutPromise]);
    } catch (dbErr) {
      console.warn('DB blog delete failed/timed out:', dbErr);
    }

    deleteInMemoryBlog(params.id);

    revalidatePath('/blog');
    revalidatePath('/travel-journal');
    revalidatePath('/');
    revalidateTag('blogs');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true });
  }
}
