'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Compass, Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from './CurrencyContext';

interface HeroProps {
  onOpenQuoteModal: () => void;
  onFilterSearch?: (filters: { category: string; destination: string; duration: string }) => void;
}

export const Hero = ({ onOpenQuoteModal, onFilterSearch }: HeroProps) => {
  const { settings } = useCurrency();
  const [tourStyle, setTourStyle] = useState('Tamil Nadu Journeys');
  const [destination, setDestination] = useState('Chennai');
  const [month, setMonth] = useState('October');
  const [duration, setDuration] = useState('7–10 Days');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [dynamicDestinations, setDynamicDestinations] = useState<string[]>([
    'Chennai', 'Mahabalipuram', 'Pondicherry', 'Thanjavur', 'Madurai', 'Chettinad', 'Kanyakumari', 'Munnar', 'Kerala', 'Alleppey'
  ]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([
    'Tamil Nadu Journeys', 'Kerala Journeys', 'South India Journeys', 'Cultural Journeys', 'Temple Journeys', 'Food & Culinary Journeys', 'Private Custom Journeys'
  ]);

  // Fetch dynamic destinations & tour categories from CMS APIs
  React.useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const titles = data.map((d: any) => d.title).filter(Boolean);
          if (titles.length > 0) {
            setDynamicDestinations(titles);
            setDestination(titles[0]);
          }
        }
      })
      .catch(() => {});

    fetch('/api/safaris')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const cats = Array.from(new Set(data.map((s: any) => s.category).filter(Boolean))) as string[];
          if (cats.length > 0) {
            setDynamicCategories(cats);
            setTourStyle(cats[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Parse hero banners list from CMS settings
  const banners = React.useMemo(() => {
    try {
      if (!settings?.heroBanners) return [];
      const parsed = typeof settings.heroBanners === 'string' ? JSON.parse(settings.heroBanners) : settings.heroBanners;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [settings?.heroBanners]);

  // Auto slide effect
  React.useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners.length > 0 && banners[currentSlideIndex] ? banners[currentSlideIndex] : null;

  const bgImage = activeBanner?.image || settings?.heroImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2200&q=90';
  const headlineText = activeBanner?.headline || settings?.heroHeadline || 'Discover Authentic South India Travel';
  const subheadlineText = activeBanner?.subheadline || settings?.heroSubheadline || 'Private journeys · Authentic experiences · Local travel specialists';
  const copyText = activeBanner?.copy || settings?.heroCopy || 'Handcrafted private journeys across iconic temples, tranquil backwaters, hill stations, and heritage sites of Tamil Nadu and Kerala.';

  const handleSearch = () => {
    const journeysSec = document.getElementById('journeys') || document.getElementById('safaris');
    if (journeysSec) {
      journeysSec.scrollIntoView({ behavior: 'smooth' });
    }
    if (onFilterSearch) {
      onFilterSearch({ category: tourStyle, destination, duration });
    }
  };

  return (
    <section id="top" className="hero-section relative">
      <div
        className="hero-image transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="hero-overlay" />

      <div className="hero-content z-10">
        <a
          href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independant_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-all mb-2"
        >
          <span className="text-orange-400 font-bold">★ 4.9</span>
          <span>TripAdvisor Excellent Rating</span>
          <span className="text-[10px] text-emerald-400 underline font-mono">View Reviews ↗</span>
        </a>
        <p className="eyebrow text-orange-400 transition-opacity duration-500 font-semibold tracking-widest uppercase">
          {subheadlineText}
        </p>
        <h1 className="transition-opacity duration-500 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          <span>{headlineText}</span>
        </h1>
        <p className="hero-copy transition-opacity duration-500 text-slate-200 text-sm sm:text-base max-w-2xl mt-3">
          {copyText}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Link href="/build-your-trip" className="gold-button text-xs font-bold px-6 py-3.5 shadow-xl hover:brightness-110 hover:scale-105 transition-all">
            Plan Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
          <button type="button" onClick={onOpenQuoteModal} className="outline-gold-button">
            Custom Itinerary Quote <Compass className="w-4 h-4" />
          </button>
          <a href="#journeys" className="outline-light-button">
            Explore Journeys <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Hero Carousel Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute top-8 right-8 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {banners.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlideIndex ? 'bg-orange-500 w-6' : 'bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <div className="hero-caption hidden md:flex items-center gap-1.5 text-xs text-slate-300">
        <MapPin className="w-3.5 h-3.5 text-orange-400" /> Tamil Nadu & Kerala <span>South India</span>
      </div>

      {/* Search Widget */}
      <div className="search-widget bg-[#0F172A]/95 backdrop-blur-2xl border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-slate-100 ring-1 ring-orange-500/20">
        <div className="search-heading flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <span className="eyebrow text-orange-400 font-bold uppercase tracking-widest text-[11px]">Your Journey Starts Here</span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-white">Find your perfect South India journey</h2>
          </div>
          <Compass className="hidden text-orange-400 sm:block w-8 h-8" />
        </div>
        <div className="search-fields grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Journey category</span>
            <select
              value={tourStyle}
              onChange={(e) => setTourStyle(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 cursor-pointer"
            >
              {dynamicCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 cursor-pointer"
            >
              {dynamicDestinations.map((dest) => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Travel month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="3–5 Days">3–5 Days</option>
              <option value="7–10 Days">7–10 Days</option>
              <option value="12+ Days">12+ Days</option>
            </select>
          </label>
          <button
            type="button"
            onClick={handleSearch}
            className="gold-button w-full lg:w-auto flex items-center justify-center font-bold text-xs py-3.5 px-4 rounded-xl shadow-lg hover:scale-105 transition-all self-end"
          >
            <Search className="w-4 h-4 inline mr-1.5" /> Search Journeys
          </button>
        </div>
      </div>
    </section>
  );
};

