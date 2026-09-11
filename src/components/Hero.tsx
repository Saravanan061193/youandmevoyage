'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  useEffect(() => {
    fetch('/api/destinations', { cache: 'no-store' })
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

    fetch('/api/safaris', { cache: 'no-store' })
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

  // Verified 3 default hero banners with distinct high-res South India images
  const defaultBanners = useMemo(() => [
    {
      id: 1,
      image: settings?.heroImage || '/images/thanjavur_periya_kovil.png',
      headline: settings?.heroHeadline || 'Thanjavur Brihadeeswarar Temple & South India Heritage',
      subheadline: settings?.heroSubheadline || 'THANJAI PERIYA KOVIL · UNESCO WORLD HERITAGE · CHOLA ARCHITECTURE',
      copy: settings?.heroCopy || 'Explore the magnificent 1,000-year-old Thanjavur Big Temple (Thanjai Periya Kovil), iconic coastal shore temples, and authentic cultural routes across South India.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90',
      headline: 'Serene Alleppey Backwaters & Houseboat Cruises',
      subheadline: 'KERALA BACKWATERS · HOUSEBOATS · PRIVATE CRUISES',
      copy: 'Drift along palm-fringed canal waters, enjoy freshly cooked Kerala delicacies, and wake up to emerald lagoons at your own tempo.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2200&q=90',
      headline: 'Mist-Covered Hills of Munnar & Nilgiri Trails',
      subheadline: 'HILL STATIONS · TEA ESTATES · NATURE EXPEDITIONS',
      copy: 'Breathe crisp mountain air amidst sprawling tea gardens, spice plantations, and scenic Western Ghats private routes.',
    }
  ], [settings?.heroImage, settings?.heroHeadline, settings?.heroSubheadline, settings?.heroCopy]);

  // Robustly parse CMS hero banners ensuring at least 3 distinct working images
  const banners = useMemo(() => {
    let list: any[] = defaultBanners;
    try {
      if (settings?.heroBanners) {
        const parsed = typeof settings.heroBanners === 'string' ? JSON.parse(settings.heroBanners) : settings.heroBanners;
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = [...parsed];
        }
      }
    } catch (e) {
      list = defaultBanners;
    }

    // Fill missing slots so there are always at least 3 distinct slides
    while (list.length < 3) {
      list.push(defaultBanners[list.length % defaultBanners.length]);
    }

    // Ensure each slide has a valid, distinct image
    return list.map((item, idx) => {
      const fallback = defaultBanners[idx % defaultBanners.length];
      const imageVal = (item.image && typeof item.image === 'string' && item.image.trim().length > 10)
        ? item.image.trim()
        : fallback.image;
      
      // If slide 2 or 3 repeats the exact same image URL as slide 1, replace with default distinct image
      const finalImage = (idx > 0 && imageVal === list[0].image) ? fallback.image : imageVal;

      return {
        ...item,
        image: finalImage,
        headline: item.headline || fallback.headline,
        subheadline: item.subheadline || fallback.subheadline,
        copy: item.copy || fallback.copy,
      };
    });
  }, [settings?.heroBanners, defaultBanners]);

  // Auto slide timer
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentSlideIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
  };

  const scrollToSearchWidget = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const searchWidget = document.getElementById('search-widget') || document.getElementById('journeys') || document.getElementById('safaris');
    if (searchWidget) {
      const topOffset = searchWidget.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  const activeBanner = banners[currentSlideIndex] || banners[0];

  const bgImage = activeBanner.image;
  const headlineText = activeBanner.headline;
  const subheadlineText = activeBanner.subheadline;
  const copyText = activeBanner.copy;

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
      {/* Background Image with Key to force smooth fade animation on slide change */}
      <div
        key={`bg-${currentSlideIndex}`}
        className="hero-image transition-all duration-700 ease-in-out animate-fadeIn"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/40 to-transparent z-0 pointer-events-none" />

      {/* Side Arrow Buttons (Left Carousel Navigation) */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-6 top-[32%] sm:top-[36%] -translate-y-1/2 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-950/85 hover:bg-orange-500 text-white backdrop-blur-md border-2 border-orange-500/40 hover:border-orange-400 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all hover:scale-115 active:scale-90 cursor-pointer group/btn"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400 group-hover/btn:text-white transition-transform group-hover/btn:-translate-x-1" />
      </button>

      {/* Side Arrow Buttons (Right Carousel Navigation) */}
      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-6 top-[32%] sm:top-[36%] -translate-y-1/2 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-950/85 hover:bg-orange-500 text-white backdrop-blur-md border-2 border-orange-500/40 hover:border-orange-400 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all hover:scale-115 active:scale-90 cursor-pointer group/btn"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-1" />
      </button>

      <div key={`content-${currentSlideIndex}`} className="hero-content z-10 relative max-w-3xl space-y-3 animate-fadeIn">
        <a
          href={settings?.tripadvisorUrl || settings?.tripAdvisorUrl || "https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900/90 border border-emerald-400/60 rounded-full text-white text-xs font-bold shadow-lg hover:border-emerald-400 hover:bg-slate-900 transition-all mb-2 ring-1 ring-emerald-500/30"
        >
          <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[11px] shadow">★ 4.9</span>
          <span className="text-slate-100 font-bold">TripAdvisor Excellent Rating</span>
          <span className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-[11px]">View Reviews ↗</span>
        </a>
        <p className="eyebrow text-orange-400 font-semibold tracking-widest uppercase text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {subheadlineText}
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] sm:leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          <span>{headlineText}</span>
        </h1>
        <p className="hero-copy text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {copyText}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Link href="/build-your-trip" className="gold-button text-xs font-bold px-6 py-3.5 shadow-xl hover:brightness-110 hover:scale-105 transition-all">
            Plan Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
          <button type="button" onClick={onOpenQuoteModal} className="outline-gold-button">
            Custom Itinerary Quote <Compass className="w-4 h-4" />
          </button>
          <button type="button" onClick={scrollToSearchWidget} className="outline-light-button flex items-center gap-1.5 cursor-pointer">
            Explore Below <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Hero Carousel Navigation Dots */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-2xl">
        {banners.map((_: any, idx: number) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlideIndex(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 cursor-pointer" onClick={scrollToSearchWidget}>
        <button
          type="button"
          aria-label="Scroll down to search"
          className="w-11 h-11 rounded-full bg-slate-950/90 hover:bg-orange-500 text-orange-400 hover:text-white border-2 border-orange-500/50 hover:border-orange-400 flex items-center justify-center backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all hover:scale-110 active:scale-95 animate-bounce cursor-pointer"
        >
          <ChevronDown className="w-6 h-6" />
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
            className="gold-button w-full lg:w-auto flex items-center justify-center font-bold text-xs py-3.5 px-4 rounded-xl shadow-lg hover:scale-105 transition-all self-end cursor-pointer"
          >
            <Search className="w-4 h-4 inline mr-1.5" /> Search Journeys
          </button>
        </div>
      </div>
    </section>
  );
};
