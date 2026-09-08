'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search, MessageSquare, ArrowRight } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is included in a Discovery Safaris private expedition?',
    answer: 'All our private safaris include a dedicated 4x4 land cruiser vehicle with pop-up roof, an expert FGASA certified guide, luxury lodge or tented camp accommodations, all park entrance fees, 3 meals daily, bottled mineral water, and complimentary Flying Doctors medical evacuation insurance.',
    category: 'Booking & Inclusions',
  },
  {
    id: 'faq-2',
    question: 'When is the best time of year to visit Namibia for wildlife?',
    answer: 'The dry winter season (May to October) is ideal for game viewing in Etosha, as animals congregate around waterholes. However, November to April offers lush green desert landscapes, migratory birding, and newborn wildlife.',
    category: 'Safari Planning',
  },
  {
    id: 'faq-3',
    question: 'Are private safaris suitable for families with children or seniors?',
    answer: 'Yes! Because our safaris are 100% private, the pace, driving hours, meal stops, and daily activities are completely customized to your group’s comfort, preferences, and age range.',
    category: 'Safari Planning',
  },
  {
    id: 'faq-4',
    question: 'What medical safety and vehicle protocols do you have in place?',
    answer: 'Every 4x4 expedition vehicle is equipped with dual satellite communication phones, real-time GPS tracking linked to our Windhoek HQ, first-aid medical trauma kits, onboard oxygen, and emergency Westair Flying Doctor air evacuation coverage for all guests.',
    category: 'Safety & Health',
  },
  {
    id: 'faq-5',
    question: 'How far in advance should we book a private Namibia safari?',
    answer: 'We recommend booking 6 to 12 months in advance, especially for high-season travel (July to October), as boutique luxury lodges in Sossusvlei, Etosha, and Damaraland have limited room capacity.',
    category: 'Booking & Inclusions',
  },
];

export const FAQSection: React.FC<{ onOpenQuoteModal?: () => void }> = ({ onOpenQuoteModal }) => {
  const { settings } = useCurrency();
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    // Load dynamic FAQs from settings or localStorage or API
    const loadFaqs = () => {
      if (settings?.siteFaqs) {
        try {
          const parsed = typeof settings.siteFaqs === 'string' ? JSON.parse(settings.siteFaqs) : settings.siteFaqs;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqs(parsed);
            return;
          }
        } catch (e) {}
      }

      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_faqs_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFaqs(parsed);
              return;
            }
          } catch (e) {}
        }
      }

      fetch('/api/faqs')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setFaqs(data);
        })
        .catch(() => {});
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
    <section id="faqs" className="py-20 px-6 bg-[#0e0c0a] text-stone-100 border-t border-stone-800/80">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#c5a059]" /> Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 leading-tight">
            {settings?.faqHeadline || 'Everything You Need to Know Before Your Safari'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-light">
            Answers to common questions regarding private vehicles, lodges, safety, and custom itineraries
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
              className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-[#c5a059] shadow-lg font-sans"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
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
                    ? 'bg-[#c5a059] text-stone-950 font-bold shadow-md'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
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
            <div className="p-8 text-center bg-stone-900/40 border border-stone-800 rounded-2xl space-y-2">
              <p className="text-stone-400 text-xs font-semibold">No questions matched your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-[11px] text-[#c5a059] hover:underline font-bold"
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
                      ? 'bg-[#181614] border-[#c5a059]/60 shadow-xl'
                      : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 outline-none"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-stone-100 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#c5a059] shrink-0" />
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                        isOpen ? 'bg-[#c5a059] text-stone-950 border-[#c5a059]' : 'border-stone-700 text-stone-400'
                      }`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-stone-800/60 font-sans space-y-3">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                      {faq.category && (
                        <span className="inline-block text-[10px] text-[#c5a059] font-mono bg-[#c5a059]/10 border border-[#c5a059]/30 px-2.5 py-0.5 rounded-md font-semibold">
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
        <div className="p-8 bg-[#141210] border border-stone-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-100">Still Have Questions About Namibia Safaris?</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
              Our safari designers are available 24/7 to answer your custom itinerary questions.
            </p>
          </div>
          {onOpenQuoteModal && (
            <button
              onClick={onOpenQuoteModal}
              className="gold-button text-xs px-6 py-3 shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Ask a Safari Specialist <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
