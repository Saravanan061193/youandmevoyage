'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, BookOpen, Star, X } from 'lucide-react';

interface StickyFloatingCTAProps {
  onOpenQuoteModal: () => void;
  onOpenLeadMagnetModal: () => void;
}

export const StickyFloatingCTA = ({ onOpenQuoteModal, onOpenLeadMagnetModal }: StickyFloatingCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="bg-[#12100e]/90 backdrop-blur-2xl border border-[#c5a059]/40 rounded-full p-2 pl-4 sm:pl-6 pr-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3 text-stone-100 ring-1 ring-[#c5a059]/20 transition-all hover:border-[#c5a059]/70">
        
        {/* Rating & Social Proof badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center text-amber-400 gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-serif text-sm font-bold text-stone-100 ml-1">4.9</span>
          </div>
          <span className="text-[11px] text-stone-400 hidden sm:inline font-medium">TripAdvisor (187+ Reviews)</span>
          <span className="h-4 w-px bg-stone-800 hidden sm:block" />
        </div>

        {/* Middle: Guide magnet teaser */}
        <button
          type="button"
          onClick={onOpenLeadMagnetModal}
          className="hidden md:flex items-center gap-2 text-xs text-amber-200/90 hover:text-amber-300 font-medium transition-colors group px-2 py-1 rounded-full hover:bg-stone-900/60"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#c5a059] group-hover:scale-110 transition-transform" />
          <span>2026 Free eBook Guide</span>
        </button>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* WhatsApp Direct Chat */}
          <a
            href="https://wa.me/264811234567?text=Hi%20Discovery%20Safaris%2C%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20private%20safari."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold transition-all shadow-sm group"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          {/* Primary Custom Quote CTA */}
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="gold-button inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-stone-950 uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Custom Quote</span>
          </button>

          {/* Close Dismiss Button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-stone-400 hover:text-stone-100 p-1.5 rounded-full hover:bg-stone-800/80 transition-colors ml-0.5"
            aria-label="Close floating bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
