'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Compass, Search, MapPin } from 'lucide-react';
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
    'Chennai', 'Mahabalipuram', 'Pondicherry', 'Thanjavur', 'Madurai', 'Chettinad', 'Kanyakumari', 'Munnar', 'Kerala', 'Alleppey', 'Bangalore', 'Goa'
  ]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([
    'Tamil Nadu Journeys', 'Kerala Journeys', 'Goa Journeys', 'Karnataka Journeys', 'South India Journeys', 'Cultural Journeys', 'Temple Journeys', 'Food & Culinary Journeys', 'Private Custom Journeys'
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
  const cmsBanners = React.useMemo(() => {
    try {
      if (!settings?.heroBanners) return [];
      const parsed = typeof settings.heroBanners === 'string' ? JSON.parse(settings.heroBanners) : settings.heroBanners;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [settings?.heroBanners]);

  // Fallback default banners if CMS list has 0 or 1 item so slide controls are rich and interactive
  const defaultBanners = [
    {
      image: settings?.heroImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2200&q=90',
      headline: settings?.heroHeadline || 'Discover Authentic South India Travel',
      subheadline: settings?.heroSubheadline || 'Private journeys · Authentic experiences · Local travel specialists',
      copy: settings?.heroCopy || 'Handcrafted private journeys across iconic temples, tranquil backwaters, hill stations, and heritage sites of Tamil Nadu and Kerala.',
    },
    {
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90',
      headline: 'Serene Alleppey Backwaters & Houseboat Cruises',
      subheadline: 'KERALA BACKWATERS · HOUSEBOATS · PRIVATE CRUISES',
      copy: 'Drift along palm-fringed canal waters, enjoy freshly cooked Kerala delicacies, and wake up to emerald lagoons at your own tempo.',
    },
    {
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2200&q=90',
      headline: 'Mist-Covered Hills of Munnar & Nilgiri Trails',
      subheadline: 'HILL STATIONS · TEA ESTATES · NATURE EXPEDITIONS',
      copy: 'Breathe crisp mountain air amidst sprawling tea gardens, spice plantations, and scenic Western Ghats private routes.',
    }
  ];

  const banners = cmsBanners.length > 0 ? cmsBanners : defaultBanners;

  // Auto slide effect
  React.useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
  };

  const scrollToSearchWidget = () => {
    const searchWidget = document.getElementById('search-widget') || document.getElementById('journeys');
    if (searchWidget) {
      searchWidget.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 500, behavior: 'smooth' });
    }
  };

  const activeBanner = banners[currentSlideIndex] || banners[0];

  const bgImage = activeBanner?.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2200&q=90';
  const headlineText = activeBanner?.headline || 'Discover Authentic South India Travel';
  const subheadlineText = activeBanner?.subheadline || 'Private journeys · Authentic experiences · Local travel specialists';
  const copyText = activeBanner?.copy || 'Handcrafted private journeys across iconic temples, tranquil backwaters, hill stations, and heritage sites of Tamil Nadu and Kerala.';

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
    <section id="top" className="hero-section relative overflow-hidden group">
      <div
        className="hero-image transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      {/* Dark gradient overlay for high contrast text on left while keeping right side bright */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/40 to-transparent z-0 pointer-events-none" />

      {/* Side Arrow Buttons (Left & Right Carousel Navigation) */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 hover:border-orange-400 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ring-2 ring-black/40 group/btn"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-100 group-hover/btn:text-white transition-transform group-hover/btn:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 hover:border-orange-400 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ring-2 ring-black/40 group/btn"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-100 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5" />
      </button>

      <div className="hero-content z-10 relative max-w-3xl space-y-3">
        <a
          href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900/90 border border-emerald-400/60 rounded-full text-white text-xs font-bold shadow-lg hover:border-emerald-400 hover:bg-slate-900 transition-all mb-2 ring-1 ring-emerald-500/30"
        >
          <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[11px] shadow">★ 4.9</span>
          <span className="text-slate-100 font-bold">TripAdvisor Excellent Rating</span>
          <span className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-[11px]">View Reviews ↗</span>
        </a>
        <p className="eyebrow text-orange-400 transition-opacity duration-500 font-semibold tracking-widest uppercase text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {subheadlineText}
        </p>
        <h1 className="transition-opacity duration-500 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] sm:leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          <span>{headlineText}</span>
        </h1>
        <p className="hero-copy transition-opacity duration-500 text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {copyText}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Link href="/build-your-trip" className="gold-button text-xs font-bold px-6 py-3.5 shadow-xl hover:brightness-110 hover:scale-105 transition-all">
            Plan Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
          <button type="button" onClick={onOpenQuoteModal} className="outline-gold-button">
            Custom Itinerary Quote <Compass className="w-4 h-4" />
          </button>
          <button type="button" onClick={scrollToSearchWidget} className="outline-light-button flex items-center gap-1.5">
            Explore Below <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Hero Carousel Navigation Dots */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-xl">
        {banners.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === currentSlideIndex ? 'bg-orange-500 w-7' : 'bg-white/40 hover:bg-white/80 w-2.5'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="hero-caption hidden md:flex items-center gap-1.5 text-xs text-slate-300">
        <MapPin className="w-3.5 h-3.5 text-orange-400" /> Tamil Nadu & Kerala <span>South India</span>
      </div>

      {/* Below Arrow Button (Floating Scroll Indicator) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-1 group cursor-pointer" onClick={scrollToSearchWidget}>
        <button
          type="button"
          aria-label="Scroll down"
          className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/50 hover:border-orange-400 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all animate-bounce"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Search Widget */}
      <div id="search-widget" className="search-widget bg-[#0F172A]/95 backdrop-blur-2xl border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-slate-100 ring-1 ring-orange-500/20">
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
