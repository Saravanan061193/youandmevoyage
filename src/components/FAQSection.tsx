'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search, MessageSquare, ArrowRight } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

import { safeJsonParse } from '@/lib/json';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const DEFAULT_FAQS: FAQItem[] = [];

export const FAQSection: React.FC<{ onOpenQuoteModal?: () => void }> = ({ onOpenQuoteModal }) => {
  const { settings } = useCurrency();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const cleanFaqList = (list: FAQItem[]) => {
      return list.map((item) => {
        let q = item.question || '';
        let a = item.answer || '';
        let c = item.category || 'General';
        return { ...item, question: q, answer: a, category: c };
      });
    };

    const loadFaqs = () => {
      if (settings?.siteFaqs) {
        try {
          const parsed = typeof settings.siteFaqs === 'string' ? safeJsonParse(settings.siteFaqs, []) : settings.siteFaqs;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqs(cleanFaqList(parsed));
            return;
          }
        } catch (e) {}
      }

      fetch('/api/faqs', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            setFaqs(cleanFaqList(data));
          } else {
            setFaqs([]);
          }
        })
        .catch(() => {
          setFaqs([]);
        });
    };

    loadFaqs();

    window.addEventListener('faqs_updated', loadFaqs);
    return () => window.removeEventListener('faqs_updated', loadFaqs);
  }, [settings?.siteFaqs]);

  // Extract categories list
  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category || 'General')))];

  // Filter FAQs by search query and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'All' || (faq.category || 'General') === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faqs" className="py-20 px-6 bg-[#0F172A] text-slate-100 border-t border-slate-800">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-orange-400 font-bold flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-orange-400" /> Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            {settings?.faqHeadline || 'Everything You Need to Know Before Your Journey'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Answers to common questions regarding private vehicles, driver companions, safety, and custom itineraries
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-orange-500 shadow-lg font-sans"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
              <p className="text-slate-400 text-xs font-semibold">No questions matched your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-[11px] text-orange-400 hover:underline font-bold"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900 border-orange-500/60 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 outline-none"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                        isOpen ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 font-sans space-y-3">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                      {faq.category && (
                        <span className="inline-block text-[10px] text-orange-400 font-mono bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                          Category: {faq.category}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Still Have Questions About South India Private Journeys?</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Our travel specialists are available 24/7 to answer your custom itinerary questions. You can also read 180+ guest reviews on TripAdvisor!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenQuoteModal && (
              <button
                onClick={onOpenQuoteModal}
                className="gold-button text-xs px-6 py-3 shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                Ask a Travel Specialist <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={settings?.tripadvisorUrl || settings?.tripAdvisorUrl || "https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 border border-emerald-400/60 hover:bg-slate-800 text-emerald-300 font-bold text-xs rounded-full transition-all shadow-md"
            >
              <span className="text-amber-400 font-black">★</span>
              <span>Read TripAdvisor Reviews ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
