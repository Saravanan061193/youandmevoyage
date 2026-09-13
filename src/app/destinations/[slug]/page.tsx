import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma, isValidObjectId } from '@/lib/prisma';
import { DestinationClient } from './DestinationClient';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  let dest = null;
  try {
    const isObjId = isValidObjectId(slug);
    dest = await prisma.destination.findFirst({
      where: isObjId ? { OR: [{ slug: slug }, { id: slug }] } : { slug: slug },
    });
  } catch (e) {
    console.error('Failed to fetch destination metadata:', e);
  }

  if (!dest) {
    return { title: 'Destination Not Found | You & Me – Independent Voyage' };
  }

  return {
    title: `${dest.title} Travel Guide | You & Me Voyage`,
    description: dest.description || `Explore ${dest.title} - custom South India travel destination.`,
    keywords: '',
    alternates: {
      canonical: `https://youandmevoyage.com/destinations/${slug}`,
    },
    openGraph: {
      title: `${dest.title} Travel Guide | You & Me Voyage`,
      description: dest.description || `Explore ${dest.title} - custom South India travel destination.`,
      url: `https://youandmevoyage.com/destinations/${slug}`,
      images: dest.image ? [{ url: dest.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dest.title} Travel Guide | You & Me Voyage`,
      description: dest.description || `Explore ${dest.title} - custom South India travel destination.`,
      images: dest.image ? [dest.image] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let dest = null;
  try {
    const isObjId = isValidObjectId(slug);
    dest = await prisma.destination.findFirst({
      where: isObjId ? { OR: [{ slug: slug }, { id: slug }] } : { slug: slug },
    });
  } catch (e) {
    console.error('Failed to fetch destination detail:', e);
  }

  if (!dest) {
    notFound();
  }

  return <DestinationClient dest={dest} slug={slug} />;
}

