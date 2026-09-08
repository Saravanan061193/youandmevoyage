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
  const [maxBudget, setMaxBudget] = useState<number>(8000);
  const [region, setRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const whatsappNum = settings?.whatsappNumber || '+264 81 123 4567';
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
      console.error('Failed to fetch safaris', e);
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
    setMaxBudget(8000);
    setRegion('All');
    setSearchQuery('');
  };

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customRegions, setCustomRegions] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCats = localStorage.getItem('custom_safari_categories');
      if (savedCats) {
        try {
          const parsed = JSON.parse(savedCats);
          if (Array.isArray(parsed)) setCustomCategories(parsed);
        } catch (e) {}
      }
      const savedRegs = localStorage.getItem('custom_safari_regions');
      if (savedRegs) {
        try {
          const parsed = JSON.parse(savedRegs);
          if (Array.isArray(parsed)) setCustomRegions(parsed);
        } catch (e) {}
      }
    }
  }, []);

  // Dynamically compute all categories and regions
  const availableCategories = useMemo(() => {
    const set = new Set(['All', 'Private', 'Luxury Tented', 'Adventure']);
    safaris.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    customCategories.forEach((c) => set.add(c));
    return Array.from(set);
  }, [safaris, customCategories]);

  const availableRegions = useMemo(() => {
    const set = new Set(['All', 'South', 'Central', 'North']);
    safaris.forEach((s) => {
      if (s.region) set.add(s.region);
    });
    customRegions.forEach((r) => set.add(r));
    return Array.from(set);
  }, [safaris, customRegions]);

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

  const hasActiveFilters = category !== 'All' || maxBudget < 8000 || region !== 'All' || searchQuery !== '';

  return (
    <section id="safaris" className="section-wrap">
      <div className="section-intro">
        <div>
          <p className="eyebrow">The collection</p>
          <h2>
            Journeys made <em>personal</em>
          </h2>
        </div>
        <p>From the first light over the dunes to the last waterhole at dusk, every itinerary is paced around what moves you.</p>
      </div>

      <div className="tour-layout">
        <aside className="filter-panel">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#c5a059]" /> Refine your journey
            </h3>
            {hasActiveFilters && (
              <button onClick={handleReset} className="text-xs text-[#c5a059] font-bold hover:underline">
                Reset All
              </button>
            )}
          </div>

          {/* Search Box Input */}
          <div className="filter-group pt-2">
            <span className="filter-label">Search Keyword</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, park, or lodge..."
                className="w-full bg-white border border-stone-300 text-stone-900 rounded-lg pl-8 pr-7 py-2 text-xs outline-none focus:border-[#c5a059] shadow-inner font-sans"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Tour category</span>
            {availableCategories.map((cat) => (
              <label key={cat} className="check-row cursor-pointer hover:text-[#c5a059] transition-colors">
                <input
                  type="radio"
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                  className="accent-[#c5a059]"
                />
                <span className={category === cat ? 'font-bold text-[#c5a059]' : ''}>{cat}</span>
                <small>{cat === 'All' ? safaris.length : safaris.filter((s) => s.category === cat).length}</small>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <div className="flex justify-between">
              <span className="filter-label">Budget per person</span>
              <span className="text-xs text-primary font-bold">{formatPrice(maxBudget)}</span>
            </div>
            <input
              className="w-full accent-primary cursor-pointer"
              type="range"
              min="1500"
              max="8000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">Region</span>
            <div className="flex flex-wrap gap-2">
              {availableRegions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegion(reg)}
                  className={`region-chip ${region === reg ? 'active bg-[#c5a059] text-stone-950 font-bold border-[#c5a059]' : ''}`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="tour-grid">
            {loading ? (
              <div className="p-10 text-center text-stone-500">Loading journeys...</div>
            ) : filteredSafaris.length === 0 ? (
              <div className="p-10 text-center text-stone-500">No journeys match the selected criteria.</div>
            ) : (
              paginatedSafaris.map((safari) => (
                <article key={safari.id} className="tour-card">
                  <div className="tour-image-wrap">
                    <img
                      src={safari.image}
                      alt={safari.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85";
                      }}
                    />
                    {safari.badge && <span className="tour-badge">{safari.badge}</span>}
                    <button
                      onClick={() => toggleFavorite(safari.id)}
                      className="tour-fav"
                      aria-label={`Save ${safari.title}`}
                    >
                      <Star className={`w-4 h-4 ${favorites[safari.id] ? 'fill-amber-600 text-amber-600' : ''}`} />
                    </button>
                  </div>

                  <div className="tour-card-body">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <Link href={`/safari/${safari.id}`}>
                            <h3 className="hover:text-[#c5a059] transition-colors cursor-pointer min-h-[3rem] line-clamp-2">{safari.title}</h3>
                          </Link>
                          <p className="tour-meta">
                            <Clock3 className="w-3 h-3 text-stone-500" /> {safari.days} Days / {safari.nights} Nights
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="price-label">from</span>
                          <strong className="tour-price">{formatPrice(safari.priceUSD)}</strong>
                          <span className="price-label">/ person</span>
                        </div>
                      </div>

                      <p className="route-line">
                        <MapPin className="w-3 h-3 text-stone-500 shrink-0" /> {safari.route}
                      </p>

                      <p className="tier-line">
                        <Palmtree className="w-3 h-3 text-stone-500 shrink-0" /> {safari.accommodation}
                      </p>
                    </div>

                    <div className="mt-auto pt-5 flex gap-2">
                      <Link
                        href={`/safari/${safari.id}`}
                        className="gold-button flex-1 justify-center text-center"
                      >
                        View Itinerary
                      </Link>
                      <a
                        href={`https://wa.me/${whatsappClean}?text=Hello%20Discovery%20Safaris%20Namibia%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(safari.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-button"
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
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141210] border border-stone-800 p-4 rounded-xl">
              <span className="text-xs text-stone-400">
                Showing <strong className="text-stone-200">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-stone-200">{Math.min(currentPage * itemsPerPage, filteredSafaris.length)}</strong> of{' '}
                <strong className="text-stone-200">{filteredSafaris.length}</strong> safaris
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs font-bold rounded transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#c5a059] text-black shadow-md'
                        : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-[#c5a059]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
