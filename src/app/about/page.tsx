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
  PhoneCall,
  ArrowRight,
  Star,
  MapPin,
  Sparkles,
  Calendar,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQSection } from '@/components/FAQSection';
import { QuoteModal } from '@/components/QuoteModal';
import { useCurrency } from '@/components/CurrencyContext';
import { WhyDiscoverySafaris } from '@/components/WhyDiscoverySafaris';

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

  // Parse JSON settings or fallbacks
  const whyChooseUsList = (() => {
    try {
      if (settings?.aboutWhyChooseUs) {
        return typeof settings.aboutWhyChooseUs === 'string'
          ? JSON.parse(settings.aboutWhyChooseUs)
          : settings.aboutWhyChooseUs;
      }
    } catch (e) {}
    return [
      { id: 1, title: '100% Private Expeditions', desc: 'No shared tour buses. Your private 4x4 vehicle, expert guide, and customized daily itinerary.' },
      { id: 2, title: 'Master Wildlife Trackers', desc: 'Guides with 10+ years field experience, FGASA & NTB certified, trained in wildlife ecology.' },
      { id: 3, title: 'Handpicked Luxury Lodges', desc: 'Curated eco-luxury tented camps, desert villas, and boutique lodges with prime wildlife views.' },
      { id: 4, title: 'Uncompromising Safety', desc: 'Flying doctor medical evacuation insurance included with 24/7 satellite vehicle tracking.' },
    ];
  })();

  const teamList = (() => {
    try {
      if (settings?.aboutTeamMembers) {
        return typeof settings.aboutTeamMembers === 'string'
          ? JSON.parse(settings.aboutTeamMembers)
          : settings.aboutTeamMembers;
      }
    } catch (e) {}
    return [
      { id: 1, name: 'Dr. Johan van Zyl', role: 'Head Wildlife Ecologist & Senior Guide', bio: 'With over 18 years in Etosha and Damaraland, Johan specializes in desert elephant and lion tracking.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85' },
      { id: 2, name: 'Sarah Alweendo', role: 'Lead Safari Designer & Concierge', bio: 'Sarah crafts bespoke fly-in and luxury overland itineraries tailored to international guests.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85' },
      { id: 3, name: 'Markus Becker', role: 'Expedition Operations Manager', bio: 'Former wilderness ranger with deep expertise in 4x4 desert logistics and remote safety.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85' },
    ];
  })();

  const certsList = (() => {
    try {
      if (settings?.aboutCertifications) {
        return typeof settings.aboutCertifications === 'string'
          ? JSON.parse(settings.aboutCertifications)
          : settings.aboutCertifications;
      }
    } catch (e) {}
    return [
      'Namibia Tourism Board (NTB) Registered Operator #T0089',
      'Tour and Safari Association of Namibia (TASA) Accredited Member',
      'Eco-Awards Namibia 5-Flower Sustainability Seal',
      'FGASA Certified Level 3 Field Guides & Trackers',
    ];
  })();

  const awardsList = (() => {
    try {
      if (settings?.aboutAwards) {
        return typeof settings.aboutAwards === 'string'
          ? JSON.parse(settings.aboutAwards)
          : settings.aboutAwards;
      }
    } catch (e) {}
    return [
      '🏆 World Travel Awards 2024 - Leading Namibia Safari Operator',
      '⭐ TripAdvisor Travelers Choice Award 2025 - Top 1% Worldwide',
      '🌿 African Eco Excellence Award 2023 - Conservation Partner',
    ];
  })();

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 flex flex-col font-sans">
      <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

      {/* Hero Banner Section */}
      <section className="relative bg-stone-950 text-stone-100 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.aboutHeroImage || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=85'}
            alt="Discovery Safaris Namibia"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-6 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#c5a059] uppercase tracking-widest">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-300">About Us</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-stone-100 max-w-4xl mx-auto leading-tight">
            {settings?.aboutHeroHeadline || 'Crafting Extraordinary Namibian Journeys'}
          </h1>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            {settings?.aboutHeroSubheadline || 'Bespoke Private Expeditions · Wildlife Conservation · Expert Guides Since 2004'}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="gold-button text-sm px-6 py-3.5 shadow-xl hover:scale-105 transition-all"
            >
              Request Custom Quote <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-stone-900/80 border border-stone-700 text-xs font-semibold text-amber-400 hover:bg-stone-800 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Edit About Page in Admin
            </Link>
          </div>
        </div>
      </section>

      {/* 1. COMPANY STORY SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Our Heritage
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {settings?.aboutCompanyStoryTitle || 'Our Story: Two Decades of Safari Heritage'}
            </h2>
            <p className="text-sm font-semibold text-[#8a6d3b]">
              {settings?.aboutCompanyStorySubheadline || 'Engineered for international travelers seeking authentic African wilderness'}
            </p>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {settings?.aboutCompanyStoryContent ||
                'Founded in Windhoek in 2004, Discovery Safaris Namibia was born out of a passion for pristine wildlife sanctuaries and remote desert landscapes. Over the past 22 years, we have grown from a small family outfit into one of Namibia’s premier private safari operators.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-900/5 border border-amber-900/10">
                <strong className="font-serif text-3xl font-bold text-[#8a6d3b] block">2004</strong>
                <span className="text-xs text-stone-600 font-medium">Established in Windhoek</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-900/5 border border-amber-900/10">
                <strong className="font-serif text-3xl font-bold text-[#8a6d3b] block">100%</strong>
                <span className="text-xs text-stone-600 font-medium">Private 4x4 Expeditions</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={settings?.aboutCompanyStoryImage || 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85'}
                alt="Discovery Safaris Expedition Vehicle"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-stone-900 text-stone-100 p-6 rounded-2xl shadow-xl max-w-xs space-y-1 hidden sm:block">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs font-serif italic text-stone-200">"The finest private safari team in Southern Africa."</p>
              <span className="text-[10px] text-stone-400 block font-mono">— National Geographic Traveler Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION SECTION */}
      <section className="bg-stone-900 text-stone-100 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">Guiding Principles</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Mission & Vision</h2>
            <p className="text-xs text-stone-400">What drives our daily operations across Namibia's wild places</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 space-y-4 hover:border-[#c5a059]/60 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">Our Mission</h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                {settings?.aboutMission ||
                  "To protect and celebrate Namibia's wild places through sustainable, low-impact private tourism while delivering unforgettable luxury journeys to every guest."}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 space-y-4 hover:border-emerald-500/60 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">Our Vision</h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                {settings?.aboutVision ||
                  'To set the gold standard for wildlife conservation safaris in Southern Africa, empowering local communities and preserving desert-adapted wildlife for generations to come.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <WhyDiscoverySafaris onOpenQuoteModal={() => setIsQuoteOpen(true)} />

      {/* 4. EXPERT TEAM & GUIDES */}
      <section className="bg-stone-100 py-20 px-6 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8a6d3b] font-bold">Meet The Experts</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Our Team & Safari Guides</h2>
            <p className="text-xs text-stone-600">Certified wildlife ecologists, trackers, and private concierge specialists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamList.map((member: any, idx: number) => (
              <div key={member.id || idx} className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xl space-y-4 group">
                <div className="h-64 w-full overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-stone-700">
                    FGASA Certified
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900">{member.name}</h3>
                  <span className="text-xs font-semibold text-[#8a6d3b] block">{member.role}</span>
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DESTINATIONS SUMMARY */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8a6d3b] font-bold">Explore Our Territories</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Featured Travel Regions</h2>
            <p className="text-xs text-stone-600 mt-1">From the salt pans of Etosha to the red dunes of Sossusvlei</p>
          </div>
          <Link href="/#destinations" className="text-xs font-bold text-[#8a6d3b] hover:underline flex items-center gap-1">
            View All Destinations →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 3).map((dest: any) => (
            <div key={dest.id} className="relative rounded-2xl overflow-hidden shadow-lg group h-72">
              <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{dest.region} Region</span>
                <h3 className="font-serif text-2xl font-bold text-stone-100">{dest.title}</h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">{dest.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SUSTAINABILITY & CONSERVATION */}
      <section className="bg-[#141210] text-stone-100 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <img
              src={settings?.aboutSustainabilityImage || 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85'}
              alt="Sustainability & Wildlife Conservation"
              className="w-full h-[400px] object-cover rounded-3xl border-2 border-stone-800 shadow-2xl"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-emerald-400/20" /> Conservation Pledge
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              {settings?.aboutSustainabilityTitle || 'Eco-Conscious Travel & Wildlife Conservation'}
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              {settings?.aboutSustainabilityContent ||
                'We believe true luxury honors the land. Discovery Safaris proudly contributes a portion of every booking directly to Save the Rhino Trust and local communal conservancies across Damaraland and the Skeleton Coast.'}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Funding for Save the Rhino Trust Trackers</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Solar Powered Safari Camps & Lodges</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Single-Use Plastic Policy Across All Expeditions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SAFETY INFORMATION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-amber-950/10 border border-amber-900/30 rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">Wilderness Protocols</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {settings?.aboutSafetyTitle || 'Wilderness Safety & 24/7 Medical Coverage'}
              </h2>
            </div>
          </div>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            {settings?.aboutSafetyContent ||
              'Your safety is paramount. All our custom 4x4 vehicles are equipped with dual satellite phones, GPS tracking, comprehensive medical first-aid kits, and onboard oxygen.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
              <strong className="text-xs font-bold text-stone-900 block">Westair Flying Doctors</strong>
              <p className="text-[11px] text-stone-600">Complimentary emergency air evacuation insurance for every guest</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
              <strong className="text-xs font-bold text-stone-900 block">Satellite 4x4 Tracking</strong>
              <p className="text-[11px] text-stone-600">24/7 real-time vehicle location monitoring at Windhoek HQ</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1">
              <strong className="text-xs font-bold text-stone-900 block">Wilderness First Aid</strong>
              <p className="text-[11px] text-stone-600">Guides fully certified in emergency trauma response & CPR</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CERTIFICATIONS & AWARDS */}
      <section className="bg-stone-100 py-16 px-6 border-t border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8a6d3b]" /> Official Certifications
            </h3>
            <ul className="space-y-3">
              {certsList.map((cert: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-800 font-semibold shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Awards */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#8a6d3b]" /> Industry Awards & Accolades
            </h3>
            <ul className="space-y-3">
              {awardsList.map((award: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-800 font-semibold shadow-sm">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{award}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className="bg-stone-950 text-stone-100 py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100">
            {settings?.aboutCtaHeadline || 'Ready to Plan Your Custom Namibia Safari?'}
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto">
            {settings?.aboutCtaSubheadline || 'Speak with our senior safari designers to receive a complimentary 24-hour itinerary proposal.'}
          </p>
          <div className="pt-4">
            <button onClick={() => setIsQuoteOpen(true)} className="gold-button text-base px-8 py-4 shadow-2xl hover:scale-105 transition-all">
              {settings?.aboutCtaButtonText || 'Request Custom Safari Quote'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <FAQSection onOpenQuoteModal={() => setIsQuoteOpen(true)} />
      <Footer />

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
