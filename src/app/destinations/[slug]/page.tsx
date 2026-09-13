import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DestinationClient } from './DestinationClient';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const dest = await prisma.destination.findFirst({
    where: { OR: [{ slug: slug }, { id: slug }] },
  });

  if (!dest) {
    return { title: 'Destination Not Found | You & Me – Independent Voyage' };
  }

  return {
    title: dest.metaTitle || `${dest.title} Travel Guide | You & Me Voyage`,
    description: dest.metaDescription || dest.description || `Explore ${dest.title} - custom South India travel destination.`,
    keywords: dest.keywords || '',
    alternates: {
      canonical: `https://youandmevoyage.com/destinations/${slug}`,
    },
    openGraph: {
      title: dest.metaTitle || `${dest.title} Travel Guide | You & Me Voyage`,
      description: dest.metaDescription || dest.description || `Explore ${dest.title} - custom South India travel destination.`,
      url: `https://youandmevoyage.com/destinations/${slug}`,
      images: dest.image ? [{ url: dest.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: dest.metaTitle || `${dest.title} Travel Guide | You & Me Voyage`,
      description: dest.metaDescription || dest.description || `Explore ${dest.title} - custom South India travel destination.`,
      images: dest.image ? [dest.image] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let dest = null;
  try {
    dest = await prisma.destination.findFirst({
      where: { OR: [{ slug: slug }, { id: slug }] },
    });
  } catch (e) {
    console.error(e);
  }

  if (!dest) {
    notFound();
  }

  return <DestinationClient dest={dest} slug={slug} />;
}
