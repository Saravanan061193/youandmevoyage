'use client';

import React from 'react';
import { X, Check, Minus, Clock, MapPin, Trees, Calendar, MessageCircle } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

interface SafariModalProps {
  safari: any | null;
  onClose: () => void;
  onOpenQuoteModal: () => void;
}

export const SafariModal = ({ safari, onClose, onOpenQuoteModal }: SafariModalProps) => {
  const { formatPrice, settings } = useCurrency();
  if (!safari) return null;

  const whatsappNum = settings?.whatsappNumber || '+264 81 123 4567';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  let inclusions: string[] = [];
  let exclusions: string[] = [];
  try {
    inclusions = typeof safari.inclusions === 'string' ? JSON.parse(safari.inclusions) : safari.inclusions || [];
  } catch (e) {
    inclusions = [safari.inclusions];
  }
  try {
    exclusions = typeof safari.exclusions === 'string' ? JSON.parse(safari.exclusions) : safari.exclusions || [];
  } catch (e) {
    exclusions = [safari.exclusions];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#141210] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Header Banner */}
        <div className="relative h-64 sm:h-80 w-full shrink-0">
          <img
            src={safari.image}
            alt={safari.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-stone-200 hover:text-white hover:bg-black/90 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {safari.badge && (
                <span className="bg-primary text-black text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded mb-2 inline-block">
                  {safari.badge}
                </span>
              )}
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-100">{safari.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {safari.days} Days / {safari.nights} Nights
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {safari.region} Namibia
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-stone-950/70 backdrop-blur-md p-3 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-400 uppercase block">Total Price per Person</span>
              <strong className="text-2xl font-serif text-primary font-bold">{formatPrice(safari.priceUSD)}</strong>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Overview</h3>
            <p className="text-sm text-stone-300 font-light leading-relaxed">{safari.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-900/50 border border-stone-800 p-5 rounded-xl">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block mb-1">Route & Locations</span>
              <p className="text-sm text-stone-200 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {safari.route}
              </p>
            </div>
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block mb-1">Accommodation Tier</span>
              <p className="text-sm text-stone-200 font-medium flex items-center gap-2">
                <Trees className="w-4 h-4 text-primary shrink-0" />
                {safari.accommodation}
              </p>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-900/40 border border-stone-800 p-5 rounded-xl">
              <h4 className="font-serif text-base font-bold text-stone-200 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Included in your safari
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                {inclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-900/40 border border-stone-800 p-5 rounded-xl">
              <h4 className="font-serif text-base font-bold text-stone-200 mb-3 flex items-center gap-2">
                <Minus className="w-4 h-4 text-amber-500" />
                Not included
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                {exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Minus className="w-3.5 h-3.5 text-stone-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-[#0e0c0a] border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onOpenQuoteModal();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold text-stone-950 shadow-md hover:brightness-110 transition-all"
          >
            Request Custom Quote for this Journey
          </button>
          <a
            href={`https://wa.me/${whatsappClean}?text=Hello%20Discovery%20Safaris%20Namibia%2C%20I%20want%20to%20book%20the%20${encodeURIComponent(safari.title)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-500 hover:text-black px-5 py-3 text-sm font-semibold transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Discuss on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
