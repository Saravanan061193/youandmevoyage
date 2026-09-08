'use client';

import React, { useState } from 'react';
import { ChevronDown, Clock3, Check, Minus } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

const defaultTimelineData = [
  {
    dayNumber: '01',
    daysLabel: 'Day 01',
    title: 'Arrival in Windhoek & Sunset Game Drive',
    description: 'Welcome to Namibia. Meet your private guide, settle into your design-led lodge, then watch the city turn amber from a quiet reserve.',
    duration: '45 min · 35 km',
    mealPlan: 'Dinner',
    accommodation: 'Little Kulala',
    accommodationSub: 'Private desert villa · Sossusvlei',
    image: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=1200&q=85',
  },
  {
    dayNumber: '02',
    daysLabel: 'Days 02–03',
    title: 'Sossusvlei Dunes & Deadvlei 4x4 Excursion',
    description: 'Journey south into the ancient Namib Desert. Climb Dune 45 at sunrise, walk among the ancient camel thorn trees of Deadvlei, and explore Sesriem Canyon.',
    duration: '4.5 hrs · 350 km',
    mealPlan: 'Full Board',
    accommodation: 'Little Kulala Villa',
    accommodationSub: 'Luxury desert villa · Sossusvlei',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
  },
  {
    dayNumber: '03',
    daysLabel: 'Days 04–05',
    title: 'Coastal Swakopmund & Living Desert Tour',
    description: 'Traverse the desert to the coastal town of Swakopmund. Enjoy fresh oysters, a marine catamaran cruise in Walvis Bay, and a living desert gecko hunt.',
    duration: '4 hrs · 320 km',
    mealPlan: 'Breakfast & Lunch',
    accommodation: 'Strand Hotel Swakopmund',
    accommodationSub: 'Luxury Atlantic retreat',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
  },
  {
    dayNumber: '04',
    daysLabel: 'Days 06–08',
    title: 'Etosha National Park Big Five Safari',
    description: 'Enter Etosha National Park for three full days of premier game viewing around floodlit waterholes teeming with lions, elephants, and black rhinos.',
    duration: '5 hrs · 490 km',
    mealPlan: 'Full Board',
    accommodation: 'Ongava Lodge',
    accommodationSub: 'Private reserve villa · Etosha',
    image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=85',
  },
  {
    dayNumber: '05',
    daysLabel: 'Days 09–10',
    title: 'Damaraland Rock Art & Return',
    description: 'Discover Twyfelfontein UNESCO rock engravings and track desert-adapted elephants before returning to Windhoek for international departure.',
    duration: '4 hrs · 380 km',
    mealPlan: 'Breakfast & Farewell Dinner',
    accommodation: 'Okapuka Safari Lodge',
    accommodationSub: 'Safari lodge · Windhoek',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85',
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
  const headline = settings?.homeItineraryHeadline || '10-day classic Namibian explorer';
  const copy = settings?.homeItineraryCopy || 'One signature journey. Five distinct landscapes. An itinerary designed to leave room for the moments you cannot plan.';

  return (
    <section id="itinerary" className="itinerary-section">
      <div className="section-wrap">
        <div className="section-intro light">
          <div>
            <p className="eyebrow text-primary">A closer look</p>
            <h2 dangerouslySetInnerHTML={{ __html: headline.replace('Namibian explorer', '<em>Namibian explorer</em>') }} />
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
                e.currentTarget.src = "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=1200&q=85";
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
              <Check className="w-4 h-4" /> Private 4x4 safari vehicle & expert guide
            </p>
            <p>
              <Check className="w-4 h-4" /> Luxury accommodation with full board
            </p>
            <p>
              <Check className="w-4 h-4" /> All park fees, transfers & activities
            </p>
            <p>
              <Check className="w-4 h-4" /> Airport meet-and-greet in Windhoek
            </p>
          </div>
          <div>
            <h3>Not included</h3>
            <p>
              <Minus className="w-4 h-4" /> International flights & travel insurance
            </p>
            <p>
              <Minus className="w-4 h-4" /> Visa fees and personal purchases
            </p>
            <p>
              <Minus className="w-4 h-4" /> Optional scenic flights
            </p>
            <p>
              <Minus className="w-4 h-4" /> Guide gratuities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
