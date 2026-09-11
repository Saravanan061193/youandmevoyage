'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const DestinationsMasonry = () => {
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_destinations_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDestinations(parsed);
          }
        } catch (e) {}
      }
    }

    fetch('/api/destinations', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_destinations_cache', JSON.stringify(data));
          }
        }
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <section id="destinations" className="section-wrap destinations-section py-16">
      <div className="section-intro mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-orange-500 uppercase tracking-widest font-bold text-xs">Explore Regions</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Destinations Across <em>South India</em>
          </h2>
        </div>
        <Link href="/destinations" className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-1">
          View all destinations <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="destination-masonry">
        {destinations.map((dest, idx) => {
          let cardClass = 'destination-card short';
          if (dest.size === 'large' || idx === 0) cardClass = 'destination-card large';
          else if (dest.size === 'tall' || idx === 1 || idx === 4) cardClass = 'destination-card tall';

          return (
            <Link key={dest.id || idx} href={`/destinations/${dest.slug || dest.id}`} className={cardClass}>
              <img
                src={dest.image}
                alt={dest.title}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85";
                }}
              />
              <div className="destination-overlay">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Discover</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white drop-shadow-md">{dest.title}</h3>
                <p className="text-xs text-slate-200 mt-1 drop-shadow-sm">{dest.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

