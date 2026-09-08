'use client';

import React from 'react';
import {
  Compass,
  Shield,
  Award,
  Sparkles,
  Star,
  Plane,
  Clock,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface WhyDiscoverySafarisProps {
  onOpenQuoteModal?: () => void;
}

export const WhyDiscoverySafaris: React.FC<WhyDiscoverySafarisProps> = ({ onOpenQuoteModal }) => {
  const features = [
    {
      icon: Compass,
      title: 'Local Safari Expertise',
      description: 'Native Namibian safari specialists with deep knowledge of wildlife corridors, secret waterholes, and seasonal weather patterns.',
    },
    {
      icon: Shield,
      title: 'Private 4x4 Vehicles',
      description: 'Custom-built pop-top safari cruisers equipped with fridge units, camera mounts, charging ports, and high-clearance suspension.',
    },
    {
      icon: Award,
      title: 'Experienced Guides',
      description: 'Licensed master trackers and certified wildlife conservationists with over 15+ years of bush experience and wilderness first aid.',
    },
    {
      icon: Sparkles,
      title: 'Tailor-Made Itineraries',
      description: 'Bespoke travel routes engineered around your exact preferences, desired pace, photography goals, and luxury tier.',
    },
    {
      icon: Star,
      title: 'Luxury Accommodation',
      description: 'Handpicked boutique desert retreats, exclusive eco-villas, and high-end tented camps nestled in private game reserves.',
    },
    {
      icon: Plane,
      title: 'Airport Transfers',
      description: 'Seamless VIP airport meet & assist at Hosea Kutako International Airport (WDH) with private air-conditioned transfers.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Around-the-clock dedicated dispatch team, real-time satellite communication in remote bush camps, and instant assistance.',
    },
    {
      icon: Globe,
      title: 'International Traveller Assistance',
      description: 'Full support for international guests including visa guidance, multi-currency pricing, health protocols, and travel insurance.',
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 overflow-hidden border-t border-stone-800/80">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            The Discovery Difference
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight leading-tight">
            Why Choose <em>Discovery Safaris</em>
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-sans leading-relaxed max-w-2xl mx-auto">
            Engineered for discerning international travellers seeking unhurried, private, and deeply authentic Namibian wildlife expeditions.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-stone-900/60 backdrop-blur-md border border-stone-800/80 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden"
              >
                {/* Accent Corner Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-900/30 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300 shadow-md">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-sans leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-amber-400/80 group-hover:text-amber-400 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guaranteed Quality</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer Banner inside Section */}
        {onOpenQuoteModal && (
          <div className="bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                Ready to Experience Namibia’s Wild Beauty?
              </h4>
              <p className="text-xs sm:text-sm text-stone-400">
                Speak directly with our senior safari designers to tailor your custom itinerary.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-amber-500/20 shrink-0 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Plan Your Private Safari</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
