'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SafariGrid } from '@/components/SafariGrid';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';

function JourneysListingContent() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Banner */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">Bespoke Journeys</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Custom South India Private Journeys
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Thoughtfully crafted itineraries with dedicated AC vehicles, expert local driver companions, and handpicked heritage stays.
          </p>
        </div>
      </section>

      {/* Main Journeys Grid */}
      <SafariGrid />

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function JourneysPage() {
  return (
    <CurrencyProvider>
      <JourneysListingContent />
    </CurrencyProvider>
  );
}
