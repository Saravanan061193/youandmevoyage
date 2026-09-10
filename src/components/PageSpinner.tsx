'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface PageSpinnerProps {
  message?: string;
}

export const PageSpinner = ({ message = 'Loading You & Me Journeys...' }: PageSpinnerProps) => {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping border border-orange-500/40" />
        {/* Middle rotating spinner border */}
        <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        {/* Center compass icon */}
        <Compass className="w-7 h-7 text-orange-500 animate-pulse" />
      </div>

      <div className="text-center space-y-1">
        <p className="font-serif text-base font-bold text-slate-800 flex items-center justify-center gap-1.5">
          {message} <Sparkles className="w-3.5 h-3.5 text-orange-500" />
        </p>
        <p className="text-xs text-slate-400 font-sans uppercase tracking-widest text-[10px]">
          Travel South India Your Way
        </p>
      </div>
    </div>
  );
};
