import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Discovery Safaris Namibia | Private Luxury Safari Journeys',
  description: 'Bespoke private safaris, luxury tented camps, and wildlife expeditions across Namibia, designed around you.',
  keywords: ['Namibia Safari', 'Luxury Safari', 'Etosha', 'Sossusvlei', 'Private Safari', 'African Wildlife Tours'],
  openGraph: {
    title: 'Discovery Safaris Namibia | Private Luxury Safaris',
    description: 'Bespoke private safaris, luxury tented camps, and wildlife expeditions across Namibia.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Discovery Safaris Namibia',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
