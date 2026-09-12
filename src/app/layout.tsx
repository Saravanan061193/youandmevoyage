import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GlobalLoader } from '@/components/GlobalLoader';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://youandmevoyage.com'),
  title: {
    default: 'You & Me – Independent Voyage | Custom South India Private Tours',
    template: '%s | You & Me – Independent Voyage',
  },
  description: 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.',
  keywords: [
    'You & Me Independent Voyage',
    'South India Private Tours',
    'Tamil Nadu Driver Tour',
    'Kerala Backwater Houseboat',
    'Custom South India Itinerary',
    'Private Chauffeur Tour India',
    'Munnar Tea Gardens Tour',
    'Chettinad Heritage Trip',
  ],
  authors: [{ name: 'You & Me – Independent Voyage', url: 'https://youandmevoyage.com' }],
  creator: 'You & Me – Independent Voyage',
  publisher: 'You & Me – Independent Voyage',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://youandmevoyage.com',
  },
  openGraph: {
    title: 'You & Me – Independent Voyage | Custom South India Private Tours',
    description: 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.',
    url: 'https://youandmevoyage.com',
    siteName: 'You & Me – Independent Voyage',
    images: [
      {
        url: '/images/thanjavur_periya_kovil.png',
        width: 1200,
        height: 630,
        alt: 'You & Me – Independent Voyage South India Heritage Tours',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'You & Me – Independent Voyage | Custom South India Private Tours',
    description: 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.',
    images: ['/images/thanjavur_periya_kovil.png'],
  },
};

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
