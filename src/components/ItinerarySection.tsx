'use client';

import React, { useState } from 'react';
import { ChevronDown, Clock3, Check, Minus } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

const defaultTimelineData = [
  {
    dayNumber: '01',
    daysLabel: 'Day 01',
    title: 'Arrival in Chennai & Coastal Promenade Walk',
    description: 'Welcome to South India! Meet your private driver companion at Chennai airport. Check into your heritage hotel and take a sunset walk along Marina Beach.',
    duration: '3 hrs · 25 km',
    mealPlan: 'Welcome Dinner',
    accommodation: 'Taj Connemara',
    accommodationSub: 'Heritage Hotel · Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
  },
  {
    dayNumber: '02',
    daysLabel: 'Days 02–03',
    title: 'Mahabalipuram Shore Temples & French Pondicherry',
    description: 'Drive along the East Coast Road to Mahabalipuram UNESCO Shore Temples. Continue south to Pondicherry French Quarter to wander yellow colonial streets.',
    duration: '2.5 hrs · 100 km',
    mealPlan: 'Breakfast & Seafood Lunch',
    accommodation: 'Palais de Mahe',
    accommodationSub: 'French Villa · Pondicherry',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
  },
  {
    dayNumber: '03',
    daysLabel: 'Days 04–05',
    title: 'Thanjavur Chola Living Temples & Chettinad Mansions',
    description: 'Explore 1,000-year-old Brihadeeswarar Temple in Thanjavur. Savor authentic Chettinad banana leaf feasts and stay at restored ancestral mansions.',
    duration: '4 hrs · 170 km',
    mealPlan: 'Full Board & Banana Leaf Feast',
    accommodation: 'Visalam Chettinad Mansion',
    accommodationSub: '19th-Century Heritage Mansion · Karaikudi',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=85',
  },
  {
    dayNumber: '04',
    daysLabel: 'Days 06–08',
    title: 'Madurai Meenakshi Temple & Munnar Tea Gardens',
    description: 'Witness the night ceremony at Madurai Meenakshi Temple. Climb into Western Ghats tea hills in Munnar for fresh mountain air and tea estate walks.',
    duration: '4.5 hrs · 220 km',
    mealPlan: 'Full Board',
    accommodation: 'Windermere Estate Bungalow',
    accommodationSub: 'Luxury Tea Resort · Munnar',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85',
  },
  {
    dayNumber: '05',
    daysLabel: 'Days 09–10',
    title: 'Alleppey Private Houseboat Cruise & Fort Kochi',
    description: 'Unwind on your private luxury houseboat gliding through quiet backwater canals. Conclude your journey exploring colonial Fort Kochi.',
    duration: '4 hrs · 160 km',
    mealPlan: 'Breakfast & Houseboat Meals',
    accommodation: 'Private Luxury Kettuvallam',
    accommodationSub: 'Air-Conditioned Houseboat · Alleppey',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
  },
];

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

  const activeItem = timelineData[activeIndex] || timelineData[0] || defaultTimelineData[0];
  const headline = settings?.homeItineraryHeadline || '10-day classic South India explorer';
  const copy = settings?.homeItineraryCopy || 'One signature journey. Tamil Nadu temples, Chettinad heritage, Munnar tea hills, and Kerala backwaters in seamless sequence.';

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
