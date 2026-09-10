'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Heart,
  Globe2,
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  Car,
  MapPin,
  Coffee,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQSection } from '@/components/FAQSection';
import { QuoteModal } from '@/components/QuoteModal';
import { useCurrency } from '@/components/CurrencyContext';

export default function AboutPage() {
  const { settings } = useCurrency();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDestinations(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

      {/* Hero Banner Section */}
      <section className="relative bg-[#0F172A] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.heroImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=85'}
            alt="You & Me Independent Voyage"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-6 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-widest">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">About Us</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Travel South India Your Way
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Private journeys, authentic local experiences, and driver-assisted road trips across Tamil Nadu, Kerala, and South India.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/build-your-trip"
              className="gold-button text-sm px-6 py-3.5 shadow-xl hover:scale-105 transition-all"
            >
              Build Your Custom Trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 1. COMPANY STORY SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-950 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Our Philosophy
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              You & Me – Independent Voyage
            </h2>
            <p className="text-sm font-semibold text-orange-600">
              Personalized private travel tailored to your speed, comfort, and curiosity
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              At <strong>You & Me – Independent Voyage</strong>, we believe travel should never feel like a factory line. Travel in South India is rich, sensory, and deeply historical—best experienced at your own pace with a courteous local companion who understands the roads, culture, and quiet hidden corners.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether exploring 1,000-year-old Chola temples in Thanjavur, tasting authentic banana leaf thalis in Chettinad, wandering French colonial lanes in Pondicherry, or cruising tranquil backwaters in Alleppey, we craft every route around your exact preferences.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <strong className="font-serif text-2xl font-bold text-orange-600 block">100% Private</strong>
                <span className="text-xs text-slate-600 font-medium">Dedicated AC Vehicles</span>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <strong className="font-serif text-2xl font-bold text-orange-600 block">Local Companion</strong>
                <span className="text-xs text-slate-600 font-medium">Experienced Driver-Guides</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85"
                alt="South India Heritage Temple"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <a
              href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-6 -left-6 bg-[#0F172A] text-white p-6 rounded-2xl shadow-xl max-w-xs space-y-1.5 hidden sm:block border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer group"
              title="Read our reviews on TripAdvisor"
            >
              <div className="flex items-center gap-1 text-orange-400">
                <Star className="w-4 h-4 fill-orange-400" />
                <Star className="w-4 h-4 fill-orange-400" />
                <Star className="w-4 h-4 fill-orange-400" />
                <Star className="w-4 h-4 fill-orange-400" />
                <Star className="w-4 h-4 fill-orange-400" />
              </div>
              <p className="text-xs font-serif italic text-slate-200">"Having a private driver made road travel effortless and comfortable."</p>
              <div className="flex items-center justify-between text-[10px] text-orange-400 font-mono">
                <span>— Guest Feedback</span>
                <span className="underline group-hover:text-orange-300">TripAdvisor ↗</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES SECTION */}
      <section className="bg-[#0F172A] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">What We Stand For</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">The You & Me Pillars</h2>
            <p className="text-xs text-slate-400">Our promise for every journey across Tamil Nadu & Kerala</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/60 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Personalized Travel</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                No fixed departures or crowded tour buses. Every schedule is designed around your timing, preferences, and pace.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/60 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Experienced Local Companions</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Courteous, route-expert driver companions who ensure safe travel, offer local recommendations, and handle logistics seamlessly.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/60 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Authentic Hospitality</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Handpicked boutique heritage stays, home-style culinary feasts, and genuine South Indian warmth throughout your voyage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="bg-slate-950 text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Ready to Plan Your South India Voyage?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Tell us how you want to travel, and our specialists will craft a customized itinerary for you.
          </p>
          <div className="pt-4">
            <Link href="/build-your-trip" className="gold-button text-base px-8 py-4 shadow-2xl hover:scale-105 transition-all">
              Build Your Custom Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <FAQSection onOpenQuoteModal={() => setIsQuoteOpen(true)} />
      <Footer />

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

