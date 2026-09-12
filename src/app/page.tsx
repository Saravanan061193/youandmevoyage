'use client';

import React, { useState } from 'react';
import { BookOpen, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { DriverSection } from '@/components/DriverSection';
import { SafariGrid } from '@/components/SafariGrid';
import { SafariModal } from '@/components/SafariModal';
import { ItinerarySection } from '@/components/ItinerarySection';
import { DestinationsMasonry } from '@/components/DestinationsMasonry';
import { QuoteBanner } from '@/components/QuoteBanner';
import { ReviewsSection } from '@/components/ReviewsSection';
import { EnquirySection } from '@/components/EnquirySection';
import { BlogSection } from '@/components/BlogSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { QuoteModal } from '@/components/QuoteModal';
import { StickyFloatingCTA } from '@/components/StickyFloatingCTA';
import { ExitIntentModal } from '@/components/ExitIntentModal';
import { LeadMagnetModal } from '@/components/LeadMagnetModal';

function HomeContent() {
  const { settings } = useCurrency();
  const [selectedSafari, setSelectedSafari] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<{ category: string; destination: string; duration: string } | null>(null);

  // JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'You & Me – Independent Voyage',
    description: 'Bespoke private journeys, authentic experiences and driver-assisted road trips across Tamil Nadu and Kerala.',
    url: 'https://youandmevoyage.com',
    telephone: settings?.whatsappNumber || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Indira Nagar, Adyar',
      addressLocality: 'Chennai',
      postalCode: '600020',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'India',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '215',
    },
  };

  const leadTitle = settings?.leadMagnetTitle || 'Download Free: South India Custom Travel Guide 2026';
  const leadSubtext = settings?.leadMagnetSubtext || 'Detailed Route Maps • Best Temple Timings • Chettinad & Kerala Food Recommendations';
  const leadButtonText = settings?.leadMagnetButtonText || 'Get Free Guide PDF';

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-orange-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <UtilityBar />
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
      <Hero
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onFilterSearch={(filters) => setSearchFilters(filters)}
      />
      <TrustStrip />
      <DriverSection />

      {/* Dynamic Lead Magnet Banner Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-y border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-slate-900 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-orange-400/30 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                    Complimentary Guest Travel Guide
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {leadTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
                    {leadSubtext}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
                <Link
                  href="/build-your-trip"
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Compass className="w-4 h-4 text-white shrink-0" />
                  <span>Build Your Trip Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SafariGrid
        onSelectSafari={(safari) => setSelectedSafari(safari)}
        filterParams={searchFilters}
      />
      <DestinationsMasonry />
      <QuoteBanner onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
      <ReviewsSection />
      <EnquirySection />
      <BlogSection />
      <FAQSection onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
      <Footer />

      {/* Floating CTAs */}
      <StickyFloatingCTA
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onOpenLeadMagnetModal={() => setIsLeadMagnetOpen(true)}
      />

      {/* Exit Intent Popup */}
      <ExitIntentModal onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Lead Magnet eBook Download Modal */}
      <LeadMagnetModal
        isOpen={isLeadMagnetOpen}
        onClose={() => setIsLeadMagnetOpen(false)}
      />

      {/* Modals */}
      <SafariModal
        safari={selectedSafari}
        onClose={() => setSelectedSafari(null)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </main>
  );
}

export default function Home() {
  return (
    <CurrencyProvider>
      <HomeContent />
    </CurrencyProvider>
  );
}

