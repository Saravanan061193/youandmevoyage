'use client';

import React from 'react';
import { ShieldCheck, MapPin, Compass, Navigation, HeartHandshake, Coffee, ThumbsUp } from 'lucide-react';

export const DriverSection = () => {
  const features = [
    {
      title: 'Deep Local Knowledge',
      desc: 'Unmatched understanding of South Indian culture, temple customs, hidden scenic stops, and local dialect.',
      icon: MapPin,
    },
    {
      title: 'Safe & Punctual Travel',
      desc: 'Highly experienced highway and mountain pass drivers dedicated to your safety, comfort, and peace of mind.',
      icon: ShieldCheck,
    },
    {
      title: 'Route Expertise',
      desc: 'Smooth navigation across scenic state highways, coastal roads, and Western Ghats mountain curves.',
      icon: Navigation,
    },
    {
      title: 'Flexible Itinerary Support',
      desc: 'Want to stop for fresh tender coconut or photos at a tea plantation? Your companion adjusts on your timing.',
      icon: Compass,
    },
    {
      title: 'Curated Local Recommendations',
      desc: 'Insider suggestions for clean family restaurants, authentic banana leaf feasts, and local artisan markets.',
      icon: Coffee,
    },
    {
      title: '24/7 Dedicated Assistance',
      desc: 'From hotel luggage handling to assisting with temple entry guidelines and local shopping guidance.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-slate-100 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-widest">
              The You & Me Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              More Than a Driver.<br />
              <span className="text-orange-400">Your Local Companion.</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              At You & Me – Independent Voyage, we believe the key to an unforgettable South India journey is having a courteous, knowledgeable, and reliable companion by your side.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Our private chauffeurs are not just drivers—they are local experts who ensure your journey across Tamil Nadu and Kerala is smooth, flexible, and enriched with authentic local hospitality.
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">100% Private Dedicated Vehicles</h5>
                  <p className="text-[11px] text-slate-400">Clean, air-conditioned sedans & SUVs exclusively for you & your companions.</p>
                </div>
              </div>
              <a
                href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independant_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/60 border border-emerald-500/50 hover:bg-emerald-800 text-emerald-300 text-xs font-bold rounded-xl transition-all shrink-0"
              >
                <span>Read TripAdvisor Reviews ↗</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 transition-all duration-300 group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-100 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
