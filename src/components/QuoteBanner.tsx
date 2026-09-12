'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Users } from 'lucide-react';

interface QuoteBannerProps {
  onOpenQuoteModal: () => void;
}

export const QuoteBanner = ({ onOpenQuoteModal }: QuoteBannerProps) => {
  return (
    <section id="about" className="quote-section">
      <div className="quote-copy">
        <p className="eyebrow text-orange-400 font-semibold tracking-widest uppercase">Your South India, your way</p>
        <h2 className="text-white font-serif font-bold tracking-tight">
          Tell us what<br />
          <em className="text-orange-400 not-italic">you imagine.</em>
        </h2>
        <p className="text-slate-300">Share a few details and our travel specialists will shape a private custom journey around your pace, your group, and the places that call to you.</p>

        <button type="button" onClick={onOpenQuoteModal} className="gold-button">
          Request a custom quote <ArrowRight className="w-4 h-4" />
        </button>

        <div className="quote-details">
          <span className="text-slate-300">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> No obligation
          </span>
          <span className="text-slate-300">
            <Users className="w-4 h-4 text-orange-400" /> Personalised in 24h
          </span>
        </div>
      </div>

      <div className="quote-visual">
        <img
          src="/images/private_driver_voyage_temple.jpg"
          alt="Private South India Driver Journey & Cultural Heritage"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>

  );
};
