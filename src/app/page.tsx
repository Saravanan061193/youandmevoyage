'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plane } from 'lucide-react';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { SafariGrid } from '@/components/SafariGrid';
import { SafariModal } from '@/components/SafariModal';
import { ItinerarySection } from '@/components/ItinerarySection';
import { DestinationsMasonry } from '@/components/DestinationsMasonry';
import { QuoteBanner } from '@/components/QuoteBanner';
import { ReviewsSection } from '@/components/ReviewsSection';
import { EnquirySection } from '@/components/EnquirySection';
import { SocialMediaFeed } from '@/components/SocialMediaFeed';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { QuoteModal } from '@/components/QuoteModal';
import { StickyFloatingCTA } from '@/components/StickyFloatingCTA';
import { ExitIntentModal } from '@/components/ExitIntentModal';
import { LeadMagnetModal } from '@/components/LeadMagnetModal';
import { IntentLandingModal } from '@/components/IntentLandingModal';

function HomeContent() {
  const { settings } = useCurrency();
  const [selectedSafari, setSelectedSafari] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [isIntentLandingOpen, setIsIntentLandingOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<{ category: string; destination: string; duration: string } | null>(null);

  // Automatically open enquiry form modal when website opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsQuoteModalOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Discovery Safaris Namibia',
    description: 'Private luxury safaris, tented camps, and bespoke wildlife expeditions across Namibia.',
    url: 'https://discovery-safaris-namibia.com',
    telephone: '+264 81 123 4567',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Windhoek',
      addressCountry: 'Namibia',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '187',
    },
  };

  const leadTitle = settings?.leadMagnetTitle || 'Download Free: Ultimate Namibia Safari Guide';
  const leadSubtext = settings?.leadMagnetSubtext || 'Comprehensive Wildlife Maps • Seasonal Sighting Charts • Exclusive Lodge Price Breakdown';
  const leadButtonText = settings?.leadMagnetButtonText || 'Get Free eBook PDF';

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
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

      {/* Dynamic Lead Magnet Banner Section - Luxury Gold & Glassmorphism Design */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-y border-amber-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-stone-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-amber-400/30 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-stone-950" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Complimentary Guest Resource
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 tracking-wide">
                    {leadTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-400 font-sans mt-1 max-w-2xl">
                    {leadSubtext}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsIntentLandingOpen(true)}
                  className="px-4 py-2.5 bg-stone-950/80 hover:bg-stone-800 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-amber-500/10 flex items-center gap-2"
                >
                  <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Fly-in Etosha Package</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsLeadMagnetOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-amber-500/25 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-4 h-4 text-stone-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{leadButtonText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SafariGrid
        onSelectSafari={(safari) => setSelectedSafari(safari)}
        filterParams={searchFilters}
      />
      <ItinerarySection />
      <DestinationsMasonry />
      <SocialMediaFeed />
      <QuoteBanner onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
      <ReviewsSection />
      <EnquirySection />
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

      {/* Intent-Based High-Intent SEO Fly-in Safari Modal */}
      <IntentLandingModal
        isOpen={isIntentLandingOpen}
        onClose={() => setIsIntentLandingOpen(false)}
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
