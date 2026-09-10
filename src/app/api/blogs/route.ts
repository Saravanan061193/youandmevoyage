import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryBlogs,
  setInMemoryBlogs,
  addInMemoryBlog,
  BlogItem,
} from '@/lib/inMemoryStore';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { BlogSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/auditLogger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const dbPromise = prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const blogs = await Promise.race([dbPromise, timeoutPromise]);

    if (blogs && Array.isArray(blogs) && blogs.length > 0) {
      setInMemoryBlogs(blogs as any);
      return NextResponse.json(blogs);
    }

    let memoryList = getInMemoryBlogs();
    if (category && category !== 'All') {
      memoryList = memoryList.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json(memoryList);
  } catch (error: any) {
    return NextResponse.json(getInMemoryBlogs());
  }
}

export async function POST(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'CREATE_BLOG', 'BLOGS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = BlogSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid blog payload' }, { status: 400 });
    }
    const body = sanitizeObject(parseResult.data);
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

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    let createdBlog: BlogItem | null = null;

    try {
      const dbPromise = prisma.blogPost.create({
        data: {
          title,
          slug: generatedSlug,
          excerpt,
          content,
          coverImage,
          author: author || 'You & Me Voyage Team',
          authorRole: authorRole || 'South India Travel Specialist',
          category: category || 'Travel Guide',
          readTime: readTime || '5 min read',
          metaTitle: metaTitle || `${title} | You & Me Voyage`,
          metaDescription: metaDescription || excerpt,
          published: published !== undefined ? Boolean(published) : true,
        },
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const dbRes: any = await Promise.race([dbPromise, timeoutPromise]);
      if (dbRes && dbRes.id) {
        createdBlog = dbRes;
      }
    } catch (dbErr) {
      console.warn('DB blog create failed/timed out, storing in memory store:', dbErr);
    }

    if (!createdBlog) {
      createdBlog = {
        id: `blog-${Date.now()}`,
        title,
        slug: generatedSlug,
        excerpt: excerpt || '',
        content: content || '',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        author: author || 'You & Me Voyage Team',
        authorRole: authorRole || 'South India Travel Specialist',
        category: category || 'Travel Guide',
        readTime: readTime || '5 min read',
        metaTitle: metaTitle || `${title} | You & Me Voyage`,
        metaDescription: metaDescription || excerpt,
        published: published !== undefined ? Boolean(published) : true,
        createdAt: new Date().toISOString(),
      };
    }

    addInMemoryBlog(createdBlog);

    return NextResponse.json(createdBlog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
