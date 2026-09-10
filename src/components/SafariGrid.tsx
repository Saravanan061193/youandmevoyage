'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Clock3, MapPin, Star, Filter, MessageCircle, Palmtree, Search, X } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

interface SafariGridProps {
  onSelectSafari?: (safari: any) => void;
  filterParams?: { category: string; destination: string; duration: string } | null;
}

export const SafariGrid = ({ onSelectSafari, filterParams }: SafariGridProps) => {
  const { formatPrice, settings } = useCurrency();
  const [safaris, setSafaris] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(5000);
  const [region, setRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const whatsappNum = settings?.whatsappNumber || '+91 9994315778';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  const fetchSafaris = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/safaris');
      if (res.ok) {
        const data = await res.json();
        setSafaris(data);
      }
    } catch (e) {
      console.error('Failed to fetch journeys', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafaris();
  }, []);

  useEffect(() => {
    if (filterParams?.category) {
      setCategory(filterParams.category);
    }
    if (filterParams?.destination) {
      setSearchQuery(filterParams.destination);
    }
  }, [filterParams]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReset = () => {
    setCategory('All');
    setMaxBudget(5000);
    setRegion('All');
    setSearchQuery('');
  };

  // Dynamically compute all categories and regions
  const availableCategories = useMemo(() => {
    const set = new Set([
      'All',
      'Tamil Nadu Journeys',
      'Kerala Journeys',
      'Goa Journeys',
      'Karnataka Journeys',
      'South India Journeys',
      'Cultural Journeys',
      'Temple Journeys',
      'Food & Culinary Journeys',
      'Nature & Wellness',
      'Private Custom Journeys'
    ]);
    safaris.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [safaris]);

  const availableRegions = useMemo(() => {
    const set = new Set(['All', 'Tamil Nadu', 'Kerala', 'Goa', 'Karnataka', 'South India']);
    safaris.forEach((s) => {
      if (s.region) set.add(s.region);
    });
    return Array.from(set);
  }, [safaris]);

  // Filter logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, maxBudget, region, searchQuery]);

  const filteredSafaris = safaris.filter((safari) => {
    if (category !== 'All' && safari.category !== category) return false;
    if (safari.priceUSD > maxBudget) return false;
    if (region !== 'All' && safari.region !== region) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchesText =
        safari.title?.toLowerCase().includes(q) ||
        safari.route?.toLowerCase().includes(q) ||
        safari.description?.toLowerCase().includes(q) ||
        safari.accommodation?.toLowerCase().includes(q) ||
        safari.region?.toLowerCase().includes(q) ||
        safari.category?.toLowerCase().includes(q);
      if (!matchesText) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredSafaris.length / itemsPerPage);
  const paginatedSafaris = filteredSafaris.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = category !== 'All' || maxBudget < 5000 || region !== 'All' || searchQuery !== '';

  return (
    <section id="journeys" className="section-wrap py-16">
      <div className="section-intro mb-10">
        <div>
          <p className="eyebrow text-orange-500 uppercase tracking-widest font-bold text-xs">Curated Routes</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1 leading-snug">
            South India <em className="text-orange-500 italic">Journeys & Expeditions</em>
          </h2>

        </div>
        <p className="text-slate-600 text-sm max-w-xl">
          Private, flexible, driver-assisted road trips through Tamil Nadu temple heritage, Kerala backwaters, and pristine hills.
        </p>
      </div>

      {/* Sleek Horizontal Filter Bar */}
      <div className="bg-[#0F172A] text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-xl mb-10 space-y-5">
        {/* Top Controls Row: Search Input + Region + Price Slider + Reset */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, temple, or region (e.g. Madurai, Kerala)..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl pl-10 pr-9 py-2.5 text-xs outline-none focus:border-orange-500 transition-colors shadow-inner placeholder-slate-500 font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Region:</span>
            <div className="flex items-center gap-1.5">
              {availableRegions.map((reg) => {
                const isSelected = region === reg;
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setRegion(reg)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-orange-500 text-white font-bold border-orange-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-orange-500/50 hover:text-white'
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Budget Slider & Reset Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Max Budget:</span>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-24 accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <span className="text-xs font-serif text-orange-400 font-bold ml-1 min-w-[50px]">
                {formatPrice(maxBudget)}
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 bg-orange-500/10 px-3 py-2 rounded-xl border border-orange-500/30 transition-colors shrink-0"
              >
                Reset All ↺
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-2">Categories:</span>
          <div className="flex items-center gap-2">
            {availableCategories.map((cat) => {
              const count = cat === 'All' ? safaris.length : safaris.filter((s) => s.category === cat).length;
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-orange-500 text-white font-bold border-orange-400 shadow-md scale-[1.02]'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-orange-500/50 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected ? 'bg-slate-950/25 text-white font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full p-10 text-center text-slate-500">Loading journeys...</div>
            ) : filteredSafaris.length === 0 ? (
              <div className="col-span-full p-10 text-center text-slate-500">No journeys match the selected criteria.</div>
            ) : (
              paginatedSafaris.map((safari) => (
                <article key={safari.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={safari.image}
                      alt={safari.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85";
                      }}
                    />
                    {safari.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-md backdrop-blur-md shadow-md">
                        {safari.badge}
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite(safari.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-orange-400 transition-colors"
                      aria-label={`Save ${safari.title}`}
                    >
                      <Star className={`w-3.5 h-3.5 ${favorites[safari.id] ? 'fill-orange-400 text-orange-400' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/journeys/${safari.slug || safari.id}`} className="flex-1">
                          <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                            {safari.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock3 className="w-3.5 h-3.5 text-orange-500" /> {safari.days} Days / {safari.nights} Nights
                        </span>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 block text-right">Estimate</span>
                          <strong className="text-sm font-bold text-slate-900">{formatPrice(safari.priceUSD)}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 flex items-start gap-1.5 pt-1 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{safari.route}</span>
                      </p>

                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Palmtree className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{safari.accommodation}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/journeys/${safari.slug || safari.id}`}
                        className="flex-1 text-center py-2 px-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        View Itinerary
                      </Link>
                      <a
                        href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Hi, I am interested in the ${safari.title}. I would like to know more about availability and customization.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors shrink-0"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredSafaris.length)}</strong> of{' '}
                <strong className="text-slate-900">{filteredSafaris.length}</strong> journeys
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500 hover:text-orange-500 transition-all"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs font-bold rounded transition-all ${
                      currentPage === pageNum
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-orange-500'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500 hover:text-orange-500 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
    </section>
  );
};


