'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import {
  Clock3,
  MapPin,
  Palmtree,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Calendar,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function JourneyDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const { formatPrice, settings } = useCurrency();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [journey, setJourney] = useState<any | null>(null);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const whatsappNum = (settings?.whatsappNumber || '+91 63814 20556').replace(/[^0-9+]/g, '');

  useEffect(() => {
    fetch('/api/safaris')
      .then((res) => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const match = data.find(
            (s) => s.slug === slug || s.id === slug || s.title.toLowerCase().replace(/\s+/g, '-') === slug
          );
          if (match) {
            setJourney(match);
          } else if (data.length > 0) {
            setJourney(data[0]);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !journey) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
        <div className="py-20 text-center text-slate-500 font-sans">Loading journey details...</div>
        <Footer />
      </main>
    );
  }

  const inclusionsList = typeof journey.inclusions === 'string' ? JSON.parse(journey.inclusions || '[]') : (journey.inclusions || []);
  const exclusionsList = typeof journey.exclusions === 'string' ? JSON.parse(journey.exclusions || '[]') : (journey.exclusions || []);
  const galleryList = typeof journey.gallery === 'string' ? JSON.parse(journey.gallery || '[]') : (journey.gallery || [journey.image]);

  const whatsappText = encodeURIComponent(
    `Hi, I am interested in the ${journey.title}. I would like to know more about availability and customization.`
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Banner */}
      <section className="relative h-[65vh] bg-[#0F172A] flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={journey.image}
          alt={journey.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-3">
          {journey.badge && (
            <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-md">
              {journey.badge}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {journey.title}
          </h1>
          <p className="text-orange-400 font-serif italic text-base sm:text-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" /> {journey.route}
          </p>
        </div>
      </section>

      {/* Key Quick Stats Bar */}
      <section className="bg-[#0F172A] border-b border-slate-800 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
              <strong className="text-white">{journey.days} Days / {journey.nights} Nights</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Start / End</span>
              <strong className="text-white">{journey.startingLocation || 'Chennai'} → {journey.endingLocation || 'Kochi'}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Best Season</span>
              <strong className="text-white">{journey.bestTimeToTravel || 'October to April'}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Stays</span>
              <strong className="text-white truncate block">{journey.accommodation}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Journey Overview</h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-sans">
              {journey.description}
            </p>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" /> What’s Included
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-sans">
                {inclusionsList.map((inc: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-4 md:pt-0 md:border-l md:border-slate-100 md:pl-6">
              <h4 className="font-serif font-bold text-lg text-slate-700 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-slate-400" /> What’s Excluded
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans">
                {exclusionsList.map((exc: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Inquiry Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Estimated Starting From</span>
              <div className="flex items-baseline gap-1 mt-1">
                <strong className="font-serif text-3xl font-bold text-slate-900">{formatPrice(journey.priceUSD)}</strong>
                <span className="text-xs text-slate-500 font-sans">/ person</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Customizable based on group size, vehicle choice & hotel tier.</p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNum}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Ask About This Journey
              </a>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="gold-button w-full py-3.5 rounded-xl font-bold text-xs"
              >
                Request Custom Quote <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function JourneyDetailPage() {
  return (
    <CurrencyProvider>
      <JourneyDetailContent />
    </CurrencyProvider>
  );
}
