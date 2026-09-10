'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Trees,
  Check,
  Minus,
  MessageCircle,
  Sparkles,
  Calendar,
  Compass,
  ChevronDown,
  Clock3,
} from 'lucide-react';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';

function SafariDetailContent() {
  const params = useParams();
  const router = useRouter();
  const safariId = params?.id as string;

  const { formatPrice, settings } = useCurrency();
  const [safari, setSafari] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const whatsappNum = settings?.whatsappNumber || '+91 9994315778';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  useEffect(() => {
    if (!safariId) return;

    fetch(`/api/safaris/${safariId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Safari not found');
        return res.json();
      })
      .then((data) => {
        setSafari(data);
        if (typeof document !== 'undefined') {
          document.title = data.metaTitle || `${data.title} | You & Me – Independent Voyage`;
          if (data.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.setAttribute('name', 'description');
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', data.metaDescription);
          }
          if (data.keywords) {
            let metaKw = document.querySelector('meta[name="keywords"]');
            if (!metaKw) {
              metaKw = document.createElement('meta');
              metaKw.setAttribute('name', 'keywords');
              document.head.appendChild(metaKw);
            }
            metaKw.setAttribute('content', data.keywords);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [safariId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-sans">Loading Journey details...</p>
      </div>
    );
  }

  if (!safari) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center p-6 space-y-4">
        <h2 className="font-serif text-3xl font-bold">Journey Not Found</h2>
        <p className="text-xs text-slate-500">The requested itinerary could not be located.</p>
        <Link href="/journeys" className="gold-button">
          <ArrowLeft className="w-4 h-4" /> Return to Journeys Collection
        </Link>
      </div>
    );
  }

  let inclusions: string[] = [];
  let exclusions: string[] = [];
  try {
    inclusions = typeof safari.inclusions === 'string' ? JSON.parse(safari.inclusions) : safari.inclusions || [];
  } catch (e) {
    inclusions = safari.inclusions ? [safari.inclusions] : [];
  }
  try {
    exclusions = typeof safari.exclusions === 'string' ? JSON.parse(safari.exclusions) : safari.exclusions || [];
  } catch (e) {
    exclusions = safari.exclusions ? [safari.exclusions] : [];
  }

  // Sample day-by-day itinerary timeline data
  const dayItems = [
    {
      dayNumber: '01',
      label: 'Day 01',
      title: 'Arrival in Chennai & Coastal Heritage Welcome',
      description: 'Touch down in Chennai where your personal private driver companion will greet you. Travel to Mahabalipuram to explore UNESCO sea shore temples.',
      duration: '1.5 hrs · 55 km',
      meals: 'Dinner included',
      stay: safari.accommodation || 'Heritage Beach Resort',
      image: safari.image,
    },
    {
      dayNumber: '02',
      label: `Days 02–0${Math.min(3, safari.days)}`,
      title: 'Pondicherry French Quarter & Temple Trails of Thanjavur',
      description: 'Wander French colonial bougainvillea streets in Pondicherry and explore the 1,000-year-old Chola Brihadeeswarar Temple.',
      duration: '4 hrs · 180 km',
      meals: 'Full Board',
      stay: 'Palais de Mahe / Heritage Mansion',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '03',
      label: `Days 04–0${Math.min(5, safari.days)}`,
      title: 'Chettinad Heritage Palaces & Authentic Banana Leaf Feasts',
      description: 'Explore grand merchant mansions, Athangudi handmade tiles, and private culinary spice demonstrations in Chettinad.',
      duration: '2.5 hrs · 90 km',
      meals: 'Breakfast & Traditional Thali Lunch',
      stay: 'Visalam Chettinad Palace',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '04',
      label: `Days 06–0${Math.min(safari.days - 1, 8)}`,
      title: 'Munnar Tea Plantations & Misty Mountain Retreat',
      description: 'Ascend into the Western Ghats to stroll through tea gardens, visit processing factories, and enjoy crisp mountain air.',
      duration: '4.5 hrs · 160 km',
      meals: 'Full Board',
      stay: 'Tea Estate Bungalow Munnar',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '05',
      label: `Days 0${safari.days} Departure`,
      title: 'Kerala Backwater Houseboat & Fort Kochi Departure',
      description: 'Cruise tranquil village lagoons on an AC houseboat in Alleppey before transferring to Kochi airport.',
      duration: '2 hrs · 65 km',
      meals: 'Breakfast & Houseboat Lunch',
      stay: 'Private Houseboat / Fort Kochi Heritage',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      <UtilityBar />
      <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

      {/* Hero Header Banner */}
      <section className="relative h-[480px] sm:h-[560px] w-full overflow-hidden flex items-end bg-[#0F172A]">
        <img
          src={safari.image}
          alt={safari.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Link
              href="/journeys"
              className="inline-flex items-center gap-2 text-xs text-white bg-slate-800/80 border border-slate-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full hover:text-orange-400 transition-all mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Journeys Collection
            </Link>

            <div className="flex items-center gap-3">
              {safari.badge && (
                <span className="bg-orange-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
                  {safari.badge}
                </span>
              )}
              <span className="text-xs text-orange-400 font-semibold tracking-wider uppercase">
                {safari.category} Private Journey
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {safari.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2 font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                {safari.days} Days / {safari.nights} Nights
              </span>
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-400" />
                {safari.region} South India
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#0F172A]/90 border border-slate-800 backdrop-blur-md p-5 rounded-2xl shrink-0 space-y-1 text-white">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Total Price per Person</span>
            <strong className="text-3xl font-serif text-orange-400 font-bold block">{formatPrice(safari.priceUSD)}</strong>
            <span className="text-[11px] text-slate-400 block">Private Driver & Heritage Stay</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16">
        {/* Quick Spec Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Route & Key Locations</span>
              <p className="text-sm text-slate-900 font-medium">{safari.route}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-500 shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Accommodation Tier</span>
              <p className="text-sm text-slate-900 font-medium">{safari.accommodation}</p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Journey Overview</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">About this journey</h2>
          <p className="text-base text-slate-600 font-light leading-relaxed max-w-4xl">
            {safari.description}
          </p>
        </section>

        {/* Day-by-Day Itinerary Section */}
        <section className="space-y-8 border-t border-slate-200 pt-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Day-by-Day Experience</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">Curated Itinerary Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              {dayItems.map((item, idx) => {
                const isActive = activeDayIndex === idx;
                return (
                  <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${isActive ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200'}`}>
                    <button
                      onClick={() => setActiveDayIndex(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-serif text-orange-500 font-bold">{item.dayNumber}</span>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">{item.label}</span>
                          <strong className="text-base font-serif font-semibold text-slate-900">{item.title}</strong>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isActive ? 'rotate-180 text-orange-500' : ''}`} />
                    </button>

                    {isActive && (
                      <div className="px-5 pb-5 pt-1 space-y-4 text-xs text-slate-600 border-t border-slate-200">
                        <p className="leading-relaxed text-slate-700">{item.description}</p>
                        <div className="flex flex-wrap gap-4 text-orange-600 font-medium pt-1">
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="w-3.5 h-3.5" /> {item.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> {item.meals}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Dynamic Day Preview Image Box */}
            <div className="lg:col-span-5 relative h-96 lg:h-[480px] rounded-2xl overflow-hidden border border-slate-200 sticky top-24">
              <img
                src={dayItems[activeDayIndex]?.image || safari.image}
                alt="Day Preview"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-orange-600 uppercase tracking-widest font-bold">Featured Stay</span>
                <strong className="font-serif text-lg font-bold text-slate-900 block">{dayItems[activeDayIndex]?.stay}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Inclusions & Exclusions */}
        <section className="space-y-8 border-t border-slate-200 pt-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Transparent Pricing</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">What's included in your journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-5 h-5 text-orange-500" /> Included Services
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                {inclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Minus className="w-5 h-5 text-slate-400" /> Exclusions
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                {exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Minus className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#0F172A] border border-slate-800 p-8 sm:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="space-y-2">
            <span className="text-xs text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Ready to experience {safari.title}?
            </span>
            <h3 className="font-serif text-3xl font-bold text-white">Tailor this journey around your dates</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Our travel specialists will fine-tune accommodations, vehicle preference, or customize every day around your pace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="gold-button w-full sm:w-auto justify-center text-sm py-3.5 px-6"
            >
              Request Custom Quote
            </button>
            <a
              href={`https://wa.me/${whatsappClean}?text=Hello%20You%20%26%20Me%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(safari.title)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button w-full sm:w-auto justify-center text-sm py-3.5 px-6"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </section>
      </div>

      <Footer />

      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}

export default function SafariDetailPage() {
  return (
    <CurrencyProvider>
      <SafariDetailContent />
    </CurrencyProvider>
  );
}
