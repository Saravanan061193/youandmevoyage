'use client';

import React from 'react';
import { Compass, UserCheck, Shield, Car, RefreshCw, HeartHandshake } from 'lucide-react';

export const TrustStrip = () => {
  const trustPoints = [
    { title: 'Personalized Itineraries', desc: 'Crafted around your pace & style', icon: Compass },
    { title: 'Local Expertise', desc: 'Deep Tamil Nadu & Kerala knowledge', icon: UserCheck },
    { title: 'Private Travel', desc: '100% dedicated AC vehicle & space', icon: Shield },
    { title: 'Experienced Drivers', desc: 'Courteous, safe & route expert companions', icon: Car },
    { title: 'Flexible Journeys', desc: 'Adapt stops & schedule on the go', icon: RefreshCw },
    { title: 'Authentic Experiences', desc: 'Real local encounters & cuisine', icon: HeartHandshake },
  ];

  return (
    <section className="bg-[#0F172A] border-y border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">Why Travel With Us</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">Travel With Confidence</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustPoints.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/40 transition-all">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-200">{pt.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{pt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

