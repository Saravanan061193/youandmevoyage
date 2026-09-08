'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Users } from 'lucide-react';

interface QuoteBannerProps {
  onOpenQuoteModal: () => void;
}

export const QuoteBanner = ({ onOpenQuoteModal }: QuoteBannerProps) => {
  return (
    <section id="about" className="quote-section">
      <div className="quote-visual">
        <img
          src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=85"
          alt="Elephant walking through Namibian landscape"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85";
          }}
        />
      </div>

      <div className="quote-copy">
        <p className="eyebrow text-primary">Your Namibia, your way</p>
        <h2>
          Tell us what<br />
          <em>you imagine.</em>
        </h2>
        <p>Share a few details and our safari designers will shape a private journey around your pace, your people, and the places that call to you.</p>

        <button type="button" onClick={onOpenQuoteModal} className="gold-button">
          Request a custom quote <ArrowRight className="w-4 h-4" />
        </button>

        <div className="quote-details">
          <span>
            <ShieldCheck className="w-4 h-4 text-primary" /> No obligation
          </span>
          <span>
            <Users className="w-4 h-4 text-primary" /> Personalised in 24h
          </span>
        </div>
      </div>
    </section>
  );
};
