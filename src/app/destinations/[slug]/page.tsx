'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { MapPin, ArrowRight, MessageCircle, Check, Clock, Sparkles } from 'lucide-react';
import { PageSpinner } from '@/components/PageSpinner';

function DestinationDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const { settings } = useCurrency();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [dest, setDest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/destinations', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const match = data.find((d) => d.slug === slug || d.id === slug || d.title.toLowerCase().replace(/\s+/g, '-') === slug);
          setDest(match || data[0]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !dest) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
        <PageSpinner message="Loading Destination Details..." />
        <Footer />
      </main>
    );
  }

const safeParseList = (value: any, fallbackDefault: any[] = []): any[] => {
  if (!value) return fallbackDefault;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return fallbackDefault;
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
        return [parsed];
      } catch (e) {
        // Fallthrough
      }
    }
    if (trimmed.includes('\n')) {
      return trimmed.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return fallbackDefault;
};

  const highlightsList = safeParseList(dest.highlights);
  const experiencesList = safeParseList(dest.experiences);

  const whatsappText = encodeURIComponent(`Hi You & Me! I am interested in visiting ${dest.title}. Please provide details on customized itineraries.`);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Banner */}
      <section className="relative h-[60vh] bg-[#0F172A] flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-3">
          <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-md">
            {dest.region || 'South India'}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight">
            {dest.title}
          </h1>
          <p className="text-orange-400 font-serif italic text-lg sm:text-xl">
            {dest.subtitle}
          </p>
        </div>
      </section>

      {/* Destination Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">About {dest.title}</h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-sans">
              {dest.description}
            </p>
          </div>

          {highlightsList.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" /> Key Highlights & Attractions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlightsList.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                    <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {experiencesList.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-slate-900">Things to Experience in {dest.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {experiencesList.map((exp: string, idx: number) => (
                  <div key={idx} className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium">
                    ✨ {exp}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Inquiry Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-600 tracking-widest block">Suggested Stay</span>
              <h4 className="font-serif text-xl font-bold text-slate-900 mt-1">{dest.duration || '2-3 Days'}</h4>
              <p className="text-xs text-slate-500 mt-1">Recommended duration as part of a custom South India tour.</p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/build-your-trip"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                Build Trip Including {dest.title} <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-orange-500" /> Inquire via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function DestinationDetailPage() {
  return (
    <CurrencyProvider>
      <DestinationDetailContent />
    </CurrencyProvider>
  );
}
