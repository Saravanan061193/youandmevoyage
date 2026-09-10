'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { Star, Quote, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

function ReviewsContent() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">Verified Guest Feedback</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Stories From Our Travellers
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Read honest impressions from international guests who explored South India with our private driver companions.
          </p>

          <div className="pt-4">
            <a
              href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
            >
              Read More Reviews on TripAdvisor <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5 relative flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <Quote className="w-10 h-10 text-orange-500/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-orange-500">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>

                <p className="text-slate-800 text-sm sm:text-base font-serif italic leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">{rev.author}</h4>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {rev.country} {rev.travelType ? `• ${rev.travelType}` : ''}
                  </p>
                </div>
                {rev.verified !== false && (
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 border border-orange-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function ReviewsPage() {
  return (
    <CurrencyProvider>
      <ReviewsContent />
    </CurrencyProvider>
  );
}
