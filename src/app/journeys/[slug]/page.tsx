import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { JourneyClient } from './JourneyClient';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const journey = await prisma.safari.findFirst({
    where: { OR: [{ slug: slug }, { id: slug }] },
  });

  if (!journey) {
    return { title: 'Journey Not Found | You & Me – Independent Voyage' };
  }

  return {
    title: journey.metaTitle || `${journey.title} | You & Me – Independent Voyage`,
    description: journey.metaDescription || journey.description || `Explore ${journey.title} - private South India tour.`,
    keywords: journey.keywords || '',
    alternates: {
      canonical: `https://youandmevoyage.com/journeys/${slug}`,
    },
    openGraph: {
      title: journey.metaTitle || `${journey.title} | You & Me – Independent Voyage`,
      description: journey.metaDescription || journey.description || `Explore ${journey.title} - private South India tour.`,
      url: `https://youandmevoyage.com/journeys/${slug}`,
      images: journey.image ? [{ url: journey.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: journey.metaTitle || `${journey.title} | You & Me – Independent Voyage`,
      description: journey.metaDescription || journey.description || `Explore ${journey.title} - private South India tour.`,
      images: journey.image ? [journey.image] : [],
    },
  };
}

export default async function JourneyDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let journey = null;
  try {
    journey = await prisma.safari.findFirst({
      where: { OR: [{ slug: slug }, { id: slug }] },
    });
  } catch (e) {
    console.error(e);
  }

  if (!journey) {
    notFound();
  }

  return <JourneyClient journey={journey} slug={slug} />;
}
