import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GlobalLoader } from '@/components/GlobalLoader';
import './globals.css';

import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: 'desc' } });
  } catch (e) {
    console.error('Failed to fetch SEO metadata:', e);
  }

  const title = settings?.siteMetaTitle || 'You & Me – Independent Voyage | Custom South India Private Tours';
  const desc = settings?.siteMetaDescription || 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.';
  
  let keywords = [
    'You & Me Independent Voyage',
    'South India Private Tours',
    'Tamil Nadu Driver Tour',
    'Kerala Backwater Houseboat',
    'Custom South India Itinerary',
    'Private Chauffeur Tour India',
    'Munnar Tea Gardens Tour',
    'Chettinad Heritage Trip',
  ];
  if (settings?.siteKeywords) {
    keywords = settings.siteKeywords.split(',').map((k: string) => k.trim());
  }

  const logo = settings?.siteLogo || '/images/thanjavur_periya_kovil.png';
  const index = settings?.enableRobotsIndex !== false;

  return {
    metadataBase: new URL('https://youandmevoyage.com'),
    title: {
      default: title,
      template: '%s | You & Me – Independent Voyage',
    },
    description: desc,
    keywords: keywords,
    authors: [{ name: 'You & Me – Independent Voyage', url: 'https://youandmevoyage.com' }],
    creator: 'You & Me – Independent Voyage',
    publisher: 'You & Me – Independent Voyage',
    robots: {
      index: index,
      follow: index,
      googleBot: {
        index: index,
        follow: index,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://youandmevoyage.com',
    },
    openGraph: {
      title: title,
      description: desc,
      url: 'https://youandmevoyage.com',
      siteName: 'You & Me – Independent Voyage',
      images: [
        {
          url: logo,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: desc,
      images: [logo],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-orange-500 selection:text-white bg-white text-slate-900" suppressHydrationWarning>
        <Suspense fallback={null}>
          <GlobalLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
