'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Compass, Search } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

interface HeroProps {
  onOpenQuoteModal: () => void;
  onFilterSearch?: (filters: { category: string; destination: string; duration: string }) => void;
}

export const Hero = ({ onOpenQuoteModal, onFilterSearch }: HeroProps) => {
  const { settings } = useCurrency();
  const [tourStyle, setTourStyle] = useState('Private');
  const [destination, setDestination] = useState('Etosha');
  const [month, setMonth] = useState('September');
  const [duration, setDuration] = useState('7–10 Days');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [dynamicDestinations, setDynamicDestinations] = useState<string[]>(['Etosha', 'Sossusvlei', 'Swakopmund', 'Damaraland']);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['Private', 'Luxury Tented', 'Adventure', 'Group']);

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

  const bgImage = activeBanner?.image || settings?.heroImage || 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=2200&q=90';
  const headlineText = activeBanner?.headline || settings?.heroHeadline || 'Experience the raw majesty of Namibia';
  const subheadlineText = activeBanner?.subheadline || settings?.heroSubheadline || 'Private journeys · Wild places · 2004—2026';
  const copyText = activeBanner?.copy || settings?.heroCopy || 'Bespoke private safaris, luxury tented camps, and wildlife expeditions engineered for international travelers.';

  const handleSearch = () => {
    const safarisSec = document.getElementById('safaris');
    if (safarisSec) {
      safarisSec.scrollIntoView({ behavior: 'smooth' });
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
        <p className="eyebrow text-primary transition-opacity duration-500">
          {subheadlineText}
        </p>
        <h1 className="transition-opacity duration-500">
          <span dangerouslySetInnerHTML={{ __html: headlineText.replace('raw majesty', '<em>raw majesty</em>') }} />
        </h1>
        <p className="hero-copy transition-opacity duration-500">
          {copyText}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="button" onClick={onOpenQuoteModal} className="gold-button text-xs font-bold px-6 py-3.5 shadow-xl hover:brightness-110 hover:scale-105 transition-all">
            Get Custom Safari Quote <ArrowRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={onOpenQuoteModal} className="outline-gold-button">
            Plan your safari <Compass className="w-4 h-4" />
          </button>
          <a href="#safaris" className="outline-light-button">
            Explore journeys <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Hero Carousel Navigation Dots (If multiple banners configured) */}
      {banners.length > 1 && (
        <div className="absolute top-8 right-8 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {banners.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlideIndex ? 'bg-[#c5a059] w-6' : 'bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <div className="hero-caption">
        Sossusvlei · Namib-Naukluft National Park <span>25° 20′ S · 15° 18′ E</span>
      </div>

      {/* Search Widget */}
      <div className="search-widget">
        <div className="search-heading">
          <div>
            <span className="eyebrow text-primary">Your journey starts here</span>
            <h2>Find your perfect safari</h2>
          </div>
          <Compass className="hidden text-primary sm:block w-7 h-7" />
        </div>
        <div className="search-fields">
          <label>
            <span>Tour style</span>
            <select value={tourStyle} onChange={(e) => setTourStyle(e.target.value)}>
              {dynamicCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Destination</span>
            <select value={destination} onChange={(e) => setDestination(e.target.value)}>
              {dynamicDestinations.map((dest) => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Travel month</span>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
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
          <label>
            <span>Duration</span>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="3–5 Days">3–5 Days</option>
              <option value="7–10 Days">7–10 Days</option>
              <option value="12+ Days">12+ Days</option>
            </select>
          </label>
          <button type="button" onClick={handleSearch} className="search-button">
            <Search className="w-4 h-4 inline mr-1" /> Search Safaris
          </button>
        </div>
      </div>
    </section>
  );
};
