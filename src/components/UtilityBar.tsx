'use client';

import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

export const UtilityBar = () => {
  const { settings } = useCurrency();
  const whatsappNum = settings?.whatsappNumber || '+91 9994315778';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');
  const contactEmail = settings?.contactEmail || 'youandmevoyage@gmail.com';

  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/youandmevoyage/';
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/p/Youme-independent-voyage-100064363920653/';
  const tripadvisorUrl =
    settings?.tripadvisorUrl || settings?.tripAdvisorUrl ||
    'https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html';

  return (
    <div className="bg-[#0F172A] border-b border-slate-800 text-slate-300 text-[11px] uppercase tracking-wider font-sans py-2.5 px-4 sm:px-6 lg:px-8 select-none">
      <div className="mx-auto max-w-[1600px] flex items-center justify-between gap-4">
        {/* Left Side: Mail ID & WhatsApp Only */}
        <div className="flex items-center gap-4 sm:gap-6 truncate">
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-2 text-slate-300 hover:text-orange-400 font-semibold transition-colors truncate"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate lowercase text-[11.5px] tracking-normal font-sans">{contactEmail}</span>
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

        {/* Right Side: Official Brand Social Media Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest hidden sm:inline mr-1">Follow Us:</span>
          
          {/* Instagram Official Logo */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Follow Us on Instagram"
            className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center transition-all shadow-md hover:scale-110 active:scale-95 group"
          >
            <svg className="w-4 h-4 fill-none stroke-current group-hover:rotate-6 transition-transform" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* Facebook Official Logo */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Follow Us on Facebook"
            className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-md hover:scale-110 active:scale-95 group"
          >
            <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* TripAdvisor Official Owl Logo */}
          <a
            href={tripadvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TripAdvisor"
            title="Read TripAdvisor Reviews"
            className="w-7 h-7 rounded-lg bg-[#00AA6C] hover:bg-[#008f5a] text-white flex items-center justify-center transition-all shadow-md hover:scale-110 active:scale-95 group"
          >
            <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M19.324 7.648a4.965 4.965 0 0 0-4.307-2.474c-.958 0-1.849.278-2.61.761a4.978 4.978 0 0 0-2.612-.761 4.966 4.966 0 0 0-4.307 2.474C2.511 8.878 2 10.384 2 12c0 3.033 1.95 5.617 4.717 6.554L4 21.333h3.5l1.833-2.133c.833.3 1.733.467 2.667.467s1.833-.167 2.667-.467L16.5 21.333H20l-2.717-2.779C20.05 17.617 22 15.033 22 12c0-1.616-.511-3.122-3.476-4.352zm-12.824 7.352a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm11 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM6.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
