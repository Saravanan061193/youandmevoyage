'use client';

import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

export const UtilityBar = () => {
  const { settings } = useCurrency();
  const whatsappNum = settings?.whatsappNumber || '+91 98765 43210';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');
  const contactEmail = settings?.contactEmail || 'youandmevoyage@gmail.com';

  const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
  const tripadvisorUrl =
    'https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independant_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html';

  return (
    <div className="bg-[#0F172A] border-b border-slate-800 text-slate-300 text-[11px] uppercase tracking-wider font-sans py-2 px-4 sm:px-6 lg:px-8 select-none">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        {/* Left Side: Mail ID & WhatsApp Only */}
        <div className="flex items-center gap-4 sm:gap-6 truncate">
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-2 text-slate-300 hover:text-orange-500 font-semibold transition-colors truncate"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{contactEmail}</span>
          </a>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <a
            href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Hi You & Me! I would like to inquire about customized private journeys.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 font-bold transition-colors shrink-0"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>WhatsApp {whatsappNum}</span>
          </a>
        </div>

        {/* Right Side: Social Media Icons Only */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest hidden sm:inline">Follow Us:</span>
          
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-orange-500 hover:border-orange-500/50 flex items-center justify-center transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Facebook"
            className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-orange-500 hover:border-orange-500/50 flex items-center justify-center transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          <a
            href={tripadvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TripAdvisor"
            title="TripAdvisor Reviews"
            className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 text-[10px] font-extrabold transition-all flex items-center gap-1"
          >
            <span className="text-orange-400">★</span>
            <span>TripAdvisor</span>
          </a>
        </div>
      </div>
    </div>
  );
};
