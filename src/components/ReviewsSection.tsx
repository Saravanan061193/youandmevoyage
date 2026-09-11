'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';

export const ReviewsSection = () => {
  const { settings } = useCurrency();
  const tripadvisorUrl = settings?.tripadvisorUrl || settings?.tripAdvisorUrl || "https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html";
  const [reviews, setReviews] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
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

  // Determine grid layout based on review count
  const getGridClass = () => {
    if (reviews.length === 1) return 'grid grid-cols-1 max-w-3xl mx-auto gap-6';
    if (reviews.length === 2) return 'grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6';
    if (reviews.length === 3) return 'grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-6';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
  };

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#141210] text-slate-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Intro Row */}
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

        {/* Reviews Container */}
        <div className={getGridClass()}>
          {reviews.map((rev, idx) => {
            const isExpanded = expandedIndex === idx;
            const text = rev.text || '';
            const isLong = text.length > 220;

            return (
              <article
                key={rev.id || idx}
                className="bg-[#1C1916] border border-stone-800/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition-all shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-xs font-bold text-stone-200">
                        {rev.countryFlag || '🌍'}
                      </span>
                      <span className="font-semibold text-stone-300">{rev.country || 'International'}</span>
                    </div>
                    <div className="text-amber-400 text-xs tracking-widest font-mono">
                      {'★'.repeat(Math.min(5, Math.max(1, Number(rev.rating) || 5)))}
                    </div>
                  </div>

                  <div className="relative">
                    <p className={`font-serif italic text-stone-200 text-sm sm:text-base leading-relaxed ${
                      !isExpanded && isLong ? 'line-clamp-5' : ''
                    }`}>
                      “{text}”
                    </p>

                    {isLong && (
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="text-xs text-orange-400 hover:text-orange-300 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? 'Show Less ↑' : 'Read Full Review ↓'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800/80 space-y-0.5">
                  <strong className="block text-xs font-bold text-orange-400 tracking-wide font-sans">{rev.author}</strong>
                  <span className="block text-[10px] text-stone-500 uppercase tracking-wider font-mono">Verified traveller</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
