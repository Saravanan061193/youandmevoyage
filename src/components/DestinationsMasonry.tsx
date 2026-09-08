'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const DestinationsMasonry = () => {
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDestinations(data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <section id="destinations" className="section-wrap destinations-section">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Where will you wander?</p>
          <h2>
            Five faces of <em>Namibia</em>
          </h2>
        </div>
        <a href="#safaris" className="text-link flex items-center gap-1">
          View all destinations <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="destination-masonry">
        {destinations.map((dest, idx) => {
          let cardClass = 'destination-card short';
          if (dest.size === 'large' || idx === 0) cardClass = 'destination-card large';
          else if (dest.size === 'tall' || idx === 1 || idx === 4) cardClass = 'destination-card tall';

          return (
            <a key={dest.id || idx} href="#safaris" className={cardClass}>
              <img
                src={dest.image}
                alt={dest.title}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85";
                }}
              />
              <div className="destination-overlay">
                <span>Discover</span>
                <h3>{dest.title}</h3>
                <p>{dest.subtitle}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
