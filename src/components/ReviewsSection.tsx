'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';
import { X, Star } from 'lucide-react';

export const ReviewsSection = () => {
  const { settings } = useCurrency();
  const tripadvisorUrl = settings?.tripadvisorUrl || settings?.tripAdvisorUrl || "https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html";
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  const loadReviews = () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_reviews_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviews(parsed);
          }
        } catch (e) {}
      }
    }

    fetch('/api/reviews', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_reviews_cache', JSON.stringify(data));
          }
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    loadReviews();

    const handleUpdate = () => {
      loadReviews();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('reviews_updated', handleUpdate);
      return () => {
        window.removeEventListener('reviews_updated', handleUpdate);
      };
    }
  }, []);

  const getGridClass = () => {
    if (reviews.length === 1) return 'grid grid-cols-1 max-w-2xl mx-auto gap-6';
    if (reviews.length === 2) return 'grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6';
    if (reviews.length === 3) return 'grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-6';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
  };

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#141210] text-slate-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Intro Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-stone-800/80">
          <div>
            <span className="eyebrow text-orange-400 uppercase tracking-widest font-bold text-xs block mb-1">Words from the wild</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              Guests who <em className="text-orange-400 italic font-serif">wandered</em> with us
            </h2>
          </div>

          <a
            href={tripadvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 bg-stone-900 border border-stone-800 p-3.5 rounded-2xl hover:border-orange-500/50 transition-all shrink-0 group"
          >
            <strong className="font-serif text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">4.9</strong>
            <div>
              <div className="flex items-center text-amber-400 text-sm tracking-wider">
                ★★★★★
              </div>
              <span className="text-xs text-stone-400 block mt-0.5">Tripadvisor · {180 + reviews.length} reviews</span>
            </div>
          </a>
        </div>

        {/* Reviews Cards Grid */}
        <div className={getGridClass()}>
          {reviews.map((rev, idx) => {
            const text = rev.text || '';
            const ratingNum = Math.min(5, Math.max(1, Number(rev.rating) || 5));

            return (
              <article
                key={rev.id || idx}
                onClick={() => setSelectedReview(rev)}
                className="bg-[#1C1916] border border-stone-800/90 hover:border-orange-500/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-64 sm:h-72 shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-xs font-bold text-stone-200">
                        {rev.countryFlag || '🌍'}
                      </span>
                      <span className="font-semibold text-stone-300 text-xs">{rev.country || 'International'}</span>
                    </div>
                    <div className="text-amber-400 text-xs tracking-wider font-mono">
                      {'★'.repeat(ratingNum)}
                    </div>
                  </div>

                  <p className="font-serif italic text-stone-200 text-xs sm:text-sm leading-relaxed line-clamp-4">
                    “{text}”
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-orange-400 tracking-wide font-sans">{rev.author}</strong>
                    <span className="block text-[9px] text-stone-500 uppercase tracking-wider font-mono">Verified traveller</span>
                  </div>
                  <span className="text-[10px] text-orange-400/90 font-bold group-hover:underline flex items-center gap-0.5">
                    Read Details ↗
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* FULL REVIEW DETAIL MODAL POPUP */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#1C1916] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
              title="Close Review"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 pr-8">
              <span className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-base shadow">
                {selectedReview.countryFlag || '🌍'}
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">{selectedReview.author}</h3>
                <div className="flex items-center gap-3 text-xs text-stone-400 mt-0.5">
                  <span>{selectedReview.country || 'International Traveller'}</span>
                  <span>•</span>
                  <span className="text-amber-400 tracking-wider">
                    {'★'.repeat(Math.min(5, Math.max(1, Number(selectedReview.rating) || 5)))}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Verified Guest</span>
                </div>
              </div>
            </div>

            {/* Detailed Body */}
            <div className="p-4 bg-stone-950/60 border border-stone-800/80 rounded-2xl max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p className="font-serif italic text-stone-100 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                “{selectedReview.text}”
              </p>
            </div>

            {/* Modal Footer CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
              <span className="text-stone-500 font-mono text-[11px]">Published Guest Review</span>
              <a
                href={tripadvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-bold underline flex items-center gap-1"
              >
                View TripAdvisor Page ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
