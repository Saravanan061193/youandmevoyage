'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react';

function DestinationsListingContent() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDestinations(data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">South India Explorer</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Destinations Across Tamil Nadu & Kerala
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            From ancient Chola temples and coastal French enclaves to emerald tea gardens and tranquil backwaters.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-sans">Loading destinations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => {
              const highlightsList = typeof dest.highlights === 'string' ? JSON.parse(dest.highlights || '[]') : (dest.highlights || []);
              return (
                <div
                  key={dest.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-60 overflow-hidden bg-[#0F172A]">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85";
                      }}
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#0F172A]/80 backdrop-blur-md text-orange-400 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-orange-500/30">
                      {dest.region || 'South India'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {dest.title}
                      </h3>
                      <p className="text-xs text-orange-600 font-medium italic">
                        {dest.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                        {dest.description}
                      </p>

                      {highlightsList.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Highlights:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {highlightsList.slice(0, 3).map((h: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                                • {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-orange-500" /> {dest.duration || '2-3 Days'}
                      </span>
                      <Link
                        href={`/destinations/${dest.slug || dest.id}`}
                        className="gold-button text-xs font-bold px-4 py-2 rounded-lg"
                      >
                        Explore Destination <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function DestinationsPage() {
  return (
    <CurrencyProvider>
      <DestinationsListingContent />
    </CurrencyProvider>
  );
}
