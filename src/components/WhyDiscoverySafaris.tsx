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
      title: 'South India Expertise',
      description: 'Native Tamil Nadu & Kerala companions with deep cultural knowledge, temple history, and local food secrets.',
    },
    {
      icon: Shield,
      title: 'Private AC Vehicles',
      description: 'Clean, spacious, high-comfort sedans and SUVs with dedicated private chauffeur companion for your group only.',
    },
    {
      icon: Award,
      title: 'Experienced Drivers',
      description: 'Professional, courteous local companions with 10+ years of highway and Western Ghats mountain driving experience.',
    },
    {
      icon: Sparkles,
      title: 'Tailor-Made Routes',
      description: 'Custom itineraries crafted around your pace, preferences, temple timing, and luxury tier across South India.',
    },
    {
      icon: Star,
      title: 'Heritage Stays',
      description: 'Handpicked boutique heritage hotels, restored Chettinad palatial mansions, tea bungalows, and luxury houseboats.',
    },
    {
      icon: Plane,
      title: 'Airport Meet & Assist',
      description: 'Seamless arrival and departure transfers at Chennai (MAA), Kochi (COK), Trichy (TRZ), and Trivandrum (TRV).',
    },
    {
      icon: Clock,
      title: '24/7 Personal Support',
      description: 'Around-the-clock dedicated assistance throughout your road trip for total peace of mind.',
    },
    {
      icon: Globe,
      title: 'International Guest Care',
      description: 'Full support for travelers including English assistance, transparent Indian Rupee pricing, and custom pace.',

    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-slate-100 overflow-hidden border-t border-slate-800">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            The You & Me Advantage
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Why Choose <em>You & Me Voyage</em>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed max-w-2xl mx-auto">
            Engineered for discerning international and luxury travelers seeking unhurried, private, and deeply authentic South India private journeys.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-orange-500/10 flex flex-col justify-between overflow-hidden"
              >
                {/* Accent Corner Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-md">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-orange-400/80 group-hover:text-orange-400 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Guaranteed Excellence</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer Banner inside Section */}
        {onOpenQuoteModal && (
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Ready to Experience South India Your Way?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Speak directly with our travel specialists to tailor your custom private itinerary.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shrink-0 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Plan Your Private Journey</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
