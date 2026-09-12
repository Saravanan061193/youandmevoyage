'use client';

import React, { useState } from 'react';
import { ChevronDown, Clock3, Check, Minus } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

const defaultTimelineData: any[] = [];

export const ItinerarySection = () => {
  const { settings } = useCurrency();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const timelineData = (() => {
    try {
      if (settings?.homeItineraries) {
        const parsed = typeof settings.homeItineraries === 'string' ? JSON.parse(settings.homeItineraries) : settings.homeItineraries;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultTimelineData;
  })();

  if (timelineData.length === 0) {
    return null;
  }

  const activeItem = timelineData[activeIndex] || timelineData[0];
  const headline = settings?.homeItineraryHeadline || '';
  const copy = settings?.homeItineraryCopy || '';

  return (
    <section id="itinerary" className="itinerary-section">
      <div className="section-wrap">
        <div className="section-intro light">
          <div>
            <p className="eyebrow text-primary">A closer look</p>
            <h2 dangerouslySetInnerHTML={{ __html: headline.includes('explorer') ? headline.replace('explorer', '<em>explorer</em>') : `<em>${headline}</em>` }} />
          </div>
          <p>{copy}</p>
        </div>

        <div className="itinerary-grid">
          <div className="timeline">
            {timelineData.map((item: any, idx: number) => {
              const isActive = activeIndex === idx;
              return (
                <div key={idx} className={`timeline-item ${isActive ? 'active' : ''}`}>
                  <button onClick={() => setActiveIndex(idx)} className="timeline-trigger">
                    <span className="day-number">{item.dayNumber || `0${idx + 1}`}</span>
                    <span className="timeline-copy">
                      <small>{item.daysLabel}</small>
                      <strong>{item.title}</strong>
                    </span>
                    <ChevronDown className="timeline-chevron w-5 h-5" />
                  </button>

                  {isActive && (
                    <div className="timeline-detail">
                      <p>{item.description}</p>
                      <div className="timeline-stats">
                        <span>
                          <Clock3 className="w-3.5 h-3.5" /> {item.duration}
                        </span>
                        <span>
                          <Check className="w-3.5 h-3.5" /> {item.mealPlan}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="itinerary-image">
            <img
              src={activeItem.image}
              alt={activeItem.title}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85";
              }}
            />
            <div className="image-note">
              <span>Stay</span>
              <strong>{activeItem.accommodation}</strong>
              <small>{activeItem.accommodationSub}</small>
            </div>
          </div>
        </div>

        <div className="inclusions">
          <div>
            <h3>Included in your journey</h3>
            <p>
              <Check className="w-4 h-4" /> Dedicated AC vehicle & driver companion
            </p>
            <p>
              <Check className="w-4 h-4" /> Luxury heritage stays & tea estate bungalows
            </p>
            <p>
              <Check className="w-4 h-4" /> Private Alleppey houseboat cruise with chef
            </p>
            <p>
              <Check className="w-4 h-4" /> Tolls, parking, fuel & 24/7 personal support
            </p>
          </div>
          <div>
            <h3>Not included</h3>
            <p>
              <Minus className="w-4 h-4" /> Flight tickets & travel insurance
            </p>
            <p>
              <Minus className="w-4 h-4" /> Personal shopping & camera fees
            </p>
            <p>
              <Minus className="w-4 h-4" /> Ayurvedic spa treatment packages
            </p>
            <p>
              <Minus className="w-4 h-4" /> Driver & local guide gratuities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
