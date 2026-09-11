import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GlobalLoader } from '@/components/GlobalLoader';
import './globals.css';

export const metadata: Metadata = {
  title: 'You & Me – Independent Voyage | Custom South India Private Tours',
  description: 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.',
  keywords: ['You & Me Independent Voyage', 'South India Private Tours', 'Tamil Nadu Driver Tour', 'Kerala Backwater Houseboat', 'Custom South India Itinerary'],
  openGraph: {
    title: 'You & Me – Independent Voyage | Custom South India Private Tours',
    description: 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.',
    type: 'website',
    locale: 'en_US',
    siteName: 'You & Me – Independent Voyage',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-orange-500 selection:text-white bg-white text-slate-900">
        <Suspense fallback={null}>
          <GlobalLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
