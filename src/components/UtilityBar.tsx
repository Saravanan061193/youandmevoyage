'use client';

import React from 'react';
import { MessageCircle, CloudSun, Compass } from 'lucide-react';
import { useCurrency, Currency } from './CurrencyContext';

export const UtilityBar = () => {
  const { currency, setCurrency, settings } = useCurrency();
  const whatsappNum = settings?.whatsappNumber || '+264 81 123 4567';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#1c1917] border-b border-stone-800 text-[#d8d0c4] text-[10px] uppercase tracking-widest font-sans py-1.5 px-5 lg:px-8 select-none">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        {/* Left Side: Tagline */}
        <div className="flex items-center gap-4 truncate">
          <span className="flex items-center gap-1.5 font-bold text-[#e7e1d8]">
            <Compass className="w-3 h-3 text-[#c5a059] shrink-0" />
            NAMIBIA, BEAUTIFULLY UNHURRIED.
          </span>
        </div>

        {/* Right Side: Weather, WhatsApp & Currency */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-stone-300 font-bold">
            <CloudSun className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <span>ETOSHA NATIONAL PARK:</span>
            <strong className="text-white font-bold font-mono text-[11px]">
              {settings?.weatherText ? settings.weatherText.split(': ')[1] || '28°C SUNNY' : '28°C SUNNY'}
            </strong>
          </span>

          <a
            href={`https://wa.me/${whatsappClean}?text=Hello%20Discovery%20Safaris%20Namibia%2C%20I%20would%20love%20to%20plan%20a%20private%20safari.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-stone-200 hover:text-[#c5a059] font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>WHATSAPP {whatsappNum}</span>
          </a>

          <div className="border-l border-stone-800 pl-4 flex items-center gap-2">
            <span className="text-stone-400 font-bold hidden sm:inline">CURRENCY</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-stone-900 border border-stone-700/80 text-[#c5a059] font-extrabold rounded px-2 py-0.5 outline-none cursor-pointer text-[10px]"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="NAD">NAD N$</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

