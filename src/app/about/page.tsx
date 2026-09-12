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
  Target,
  FileText,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQSection } from '@/components/FAQSection';
import { QuoteModal } from '@/components/QuoteModal';
import { useCurrency } from '@/components/CurrencyContext';
import { SEOHelper } from '@/components/SEOHelper';

export default function AboutPage() {
  const { settings } = useCurrency();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  // Synchronize document SEO metadata with CMS settings
  useEffect(() => {
    if (settings?.aboutMetaTitle) {
      document.title = settings.aboutMetaTitle;
    }
    if (settings?.aboutMetaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.aboutMetaDescription);
    }
    if (settings?.aboutKeywords) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.setAttribute('name', 'keywords');
        document.head.appendChild(metaKw);
      }
      metaKw.setAttribute('content', settings.aboutKeywords);
    }
  }, [settings?.aboutMetaTitle, settings?.aboutMetaDescription, settings?.aboutKeywords]);

  useEffect(() => {
    fetch('/api/destinations', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDestinations(data);
      })
      .catch(() => {});
  }, []);

  // Helper to parse JSON arrays safely
  const parseJsonList = (val: any, fallback: any[] = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const whyChooseUsList = parseJsonList(settings?.aboutWhyChooseUs, [
    { id: 1, title: '100% Private Journeys', desc: 'No shared tour buses. Your private AC vehicle, expert local driver companion, and flexible pace.' },
    { id: 2, title: 'Experienced Local Companions', desc: 'Drivers with deep regional route knowledge, safety training, and attentive hospitality.' },
    { id: 3, title: 'Handpicked Boutique Hotels', desc: 'Curated heritage stays, resort villas, and luxury houseboats across Tamil Nadu & Kerala.' },
    { id: 4, title: 'Uncompromising Safety', desc: '24/7 personal customer support and insured modern fleet vehicles.' },
  ]);

  const certificationsList = parseJsonList(settings?.aboutCertifications, [
    'Registered South India Private Tour Companion Operator',
    'TripAdvisor Travelers\' Choice Rated Partner',
    'Tamil Nadu & Kerala Heritage Route Specialist',
  ]);

  const awardsList = parseJsonList(settings?.aboutAwards, [
    '⭐ TripAdvisor Travelers\' Choice Award 2025',
    '🏆 South India Tourism Excellence Award 2024',
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <SEOHelper
        title={settings?.aboutMetaTitle || 'About Us | You & Me – Independent Voyage'}
        description={settings?.aboutMetaDescription || 'Learn about You & Me – Independent Voyage, our passion for South India road trip travel, private driver companions, and boutique heritage stays.'}
        keywords={settings?.aboutKeywords || 'About You & Me Independent Voyage, South India Travel Companion, Private Driver Tamil Nadu, Kerala Tour Specialist'}
        canonicalUrl="https://youandmevoyage.com/about"
      />
      <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

      {/* Hero Banner Section */}
      <section className="relative bg-[#0F172A] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.aboutHeroImage || settings?.heroImage || '/images/our_story_fleet.jpg'}
            alt={settings?.aboutHeroHeadline || 'You & Me Independent Voyage'}
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
            {settings?.aboutHeroHeadline || 'Crafting Authentic South India Journeys'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {settings?.aboutHeroSubheadline || 'Bespoke Private Escapes · Heritage Temples · Expert Local Companions'}
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
              {settings?.aboutCompanyStoryTitle || 'Our Story: Independent Travel Companions'}
            </h2>
            {settings?.aboutCompanyStorySubheadline && (
              <p className="text-sm font-semibold text-orange-600">
                {settings.aboutCompanyStorySubheadline}
              </p>
            )}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {settings?.aboutCompanyStoryContent || 'Founded in Chennai, You & Me – Independent Voyage was born out of a passion for authentic cultural journeys, pristine temple architecture, and serene backwater escapes. We provide unhurried, private, and deeply personal travel experiences with dedicated local driver companions tailored to your schedule.'}
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
                src={settings?.aboutCompanyStoryImage || '/images/our_story_fleet.jpg'}
                alt="South India Heritage Story & Luxury Fleet"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <a
              href={settings?.tripadvisorUrl || settings?.tripAdvisorUrl || "https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"}
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

      {/* 2. MISSION & VISION STATEMENTS */}
      <section className="py-12 bg-orange-50/60 border-y border-orange-100 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-orange-600 font-serif text-xl font-bold">
              <Target className="w-6 h-6" /> Our Mission
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {settings?.aboutMission || 'To offer authentic, unhurried, 100% private road travel experiences across South India with courteous local driver companions who prioritize guest safety, comfort, and deep cultural immersion.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-orange-600 font-serif text-xl font-bold">
              <Globe2 className="w-6 h-6" /> Our Vision
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {settings?.aboutVision || 'To be the premier and most revered private travel companion brand for discerning travelers exploring the architectural marvels of Tamil Nadu and the serene natural beauty of Kerala.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES & WHY CHOOSE US HIGHLIGHTS */}
      <section className="bg-[#0F172A] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">What We Stand For</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Why Choose You & Me</h2>
            <p className="text-xs text-slate-400">Our commitment to excellence across Tamil Nadu & Kerala</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUsList.map((item: any, idx: number) => (
              <div key={item.id || idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-orange-500/60 transition-all shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SUSTAINABILITY & SAFETY PROTOCOLS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-serif text-2xl font-bold">
              <Heart className="w-6 h-6" /> {settings?.aboutSustainabilityTitle || 'Eco-Conscious & Authentic Local Travel'}
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {settings?.aboutSustainabilityContent || 'We prioritize small-footprint road travel, supporting family-owned heritage homestays, local craft artisans, and authentic regional dining spots throughout Tamil Nadu and Kerala. Your journey directly supports local communities.'}
            </p>
            {settings?.aboutSustainabilityImage && (
              <img
                src={settings.aboutSustainabilityImage}
                alt="Sustainability & Local Culture"
                className="w-full h-48 object-cover rounded-2xl shadow"
              />
            )}
          </div>

          <div className="p-8 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-4">
            <div className="flex items-center gap-2 text-orange-700 font-serif text-2xl font-bold">
              <ShieldCheck className="w-6 h-6" /> {settings?.aboutSafetyTitle || 'Traveler Safety & 24/7 Local Support'}
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {settings?.aboutSafetyContent || 'Your comfort and peace of mind are non-negotiable. Every private AC vehicle undergoes rigorous safety checks, and our driver companions are trained in defensive driving, route navigation, and guest care.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. CERTIFICATIONS & AWARDS */}
      {(certificationsList.length > 0 || awardsList.length > 0) && (
        <section className="py-12 bg-slate-900 text-white px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {certificationsList.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-orange-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Accreditations & Certifications
                </h3>
                <div className="space-y-2">
                  {certificationsList.map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-200 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {awardsList.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-orange-400 flex items-center gap-2">
                  <Award className="w-5 h-5" /> Recognition & Awards
                </h3>
                <div className="space-y-2">
                  {awardsList.map((award: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-200 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. CTA BANNER SECTION */}
      <section className="bg-slate-950 text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            {settings?.aboutCtaHeadline || 'Ready to Plan Your Custom South India Journey?'}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            {settings?.aboutCtaSubheadline || 'Speak with our travel specialists to receive a custom itinerary proposal.'}
          </p>
          <div className="pt-4">
            <Link href="/build-your-trip" className="gold-button text-base px-8 py-4 shadow-2xl hover:scale-105 transition-all">
              {settings?.aboutCtaButtonText || 'Request Custom Itinerary Quote'} <ArrowRight className="w-5 h-5" />
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
