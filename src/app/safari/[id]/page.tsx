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

  const whatsappNum = settings?.whatsappNumber || '+264 81 123 4567';
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
          document.title = data.metaTitle || `${data.title} | Discovery Safaris Namibia`;
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
      <div className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-400 font-mono">Loading Safari Journey details...</p>
      </div>
    );
  }

  if (!safari) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col justify-center items-center p-6 space-y-4">
        <h2 className="font-serif text-3xl font-bold">Safari Journey Not Found</h2>
        <p className="text-xs text-stone-400">The requested safari itinerary could not be located.</p>
        <Link href="/#safaris" className="gold-button">
          <ArrowLeft className="w-4 h-4" /> Return to Safaris Collection
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

  // Sample day-by-day itinerary timeline data tailored to safari days
  const dayItems = [
    {
      dayNumber: '01',
      label: 'Day 01',
      title: 'Arrival in Windhoek & Welcoming Sunset Reserve Drive',
      description: 'Touch down in Windhoek where your personal private safari guide will greet you. Settle into your boutique reserve lodge and enjoy a sunset welcome drink.',
      duration: '45 min · 35 km',
      meals: 'Dinner included',
      stay: safari.accommodation || 'Habitas Windhoek',
      image: safari.image,
    },
    {
      dayNumber: '02',
      label: `Days 02–0${Math.min(3, safari.days)}`,
      title: 'Sossusvlei Dunes & Deadvlei Ancient Clay Pan Expedition',
      description: 'Traverse the ancient Namib Desert. Climb Dune 45 at sunrise, walk among 900-year-old camel thorn trees in Deadvlei, and explore Sesriem Canyon.',
      duration: '4.5 hrs · 350 km',
      meals: 'Full Board',
      stay: 'Little Kulala Luxury Villa',
      image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '03',
      label: `Days 04–0${Math.min(5, safari.days)}`,
      title: 'Atlantic Coastal Swakopmund & Living Desert Gecko Safari',
      description: 'Drive across desert gravel plains to Swakopmund. Experience a private marine catamaran cruise with fresh oysters in Walvis Bay, and track desert-adapted wildlife.',
      duration: '4 hrs · 320 km',
      meals: 'Breakfast & Seafood Lunch',
      stay: 'Strand Hotel Swakopmund',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '04',
      label: `Days 06–0${Math.min(safari.days - 1, 8)}`,
      title: 'Etosha National Park Big Five Waterhole Game Tracking',
      description: 'Enter world-famous Etosha National Park. Spend full days tracking lions, desert elephants, cheetahs, and endangered black rhinos around floodlit waterholes.',
      duration: '5 hrs · 490 km',
      meals: 'Full Board',
      stay: 'Ongava Game Reserve Lodge',
      image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '05',
      label: `Days 0${safari.days} Departure`,
      title: 'Damaraland UNESCO Rock Art & Homeward Journey',
      description: 'Discover ancient Twyfelfontein Bushman rock engravings and track desert-adapted elephants before returning to Windhoek for international departure.',
      duration: '4 hrs · 380 km',
      meals: 'Breakfast & Farewell Dinner',
      stay: 'Okapuka Safari Lodge Windhoek',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=85',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col selection:bg-primary selection:text-black">
      <UtilityBar />
      <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

      {/* Hero Header Banner */}
      <section className="relative h-[480px] sm:h-[560px] w-full overflow-hidden flex items-end">
        <img
          src={safari.image}
          alt={safari.title}
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1920&q=85';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0c0a]/90 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Link
              href="/#safaris"
              className="inline-flex items-center gap-2 text-xs text-stone-300 bg-stone-900/80 border border-stone-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full hover:text-primary transition-all mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Journeys Collection
            </Link>

            <div className="flex items-center gap-3">
              {safari.badge && (
                <span className="bg-primary text-black text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
                  {safari.badge}
                </span>
              )}
              <span className="text-xs text-primary font-semibold tracking-wider uppercase">
                {safari.category} Safari
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-100 leading-tight">
              {safari.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-stone-300 pt-2 font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {safari.days} Days / {safari.nights} Nights
              </span>
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                {safari.region} Namibia
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#181614]/90 border border-stone-800 backdrop-blur-md p-5 rounded-2xl shrink-0 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">Total Price per Person</span>
            <strong className="text-3xl font-serif text-primary font-bold block">{formatPrice(safari.priceUSD)}</strong>
            <span className="text-[11px] text-stone-400 block">All-Inclusive Luxury Journey</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16">
        {/* Quick Spec Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#161412] border border-stone-800 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-primary shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block mb-1">Route & Key Locations</span>
              <p className="text-sm text-stone-200 font-medium">{safari.route}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-primary shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block mb-1">Accommodation Tier</span>
              <p className="text-sm text-stone-200 font-medium">{safari.accommodation}</p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Journey Overview</span>
          <h2 className="font-serif text-3xl font-bold text-stone-100">About this safari</h2>
          <p className="text-base text-stone-300 font-light leading-relaxed max-w-4xl">
            {safari.description}
          </p>
        </section>

        {/* Day-by-Day Itinerary Section */}
        <section className="space-y-8 border-t border-stone-800 pt-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Day-by-Day Experience</span>
            <h2 className="font-serif text-3xl font-bold text-stone-100">Curated Itinerary Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              {dayItems.map((item, idx) => {
                const isActive = activeDayIndex === idx;
                return (
                  <div key={idx} className={`border border-stone-800 rounded-xl overflow-hidden transition-all ${isActive ? 'bg-[#181614] border-primary/50' : 'bg-[#141210]'}`}>
                    <button
                      onClick={() => setActiveDayIndex(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-serif text-primary font-bold">{item.dayNumber}</span>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block">{item.label}</span>
                          <strong className="text-base font-serif font-semibold text-stone-100">{item.title}</strong>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isActive ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    {isActive && (
                      <div className="px-5 pb-5 pt-1 space-y-4 text-xs text-stone-300 border-t border-stone-800/60">
                        <p className="leading-relaxed text-stone-300">{item.description}</p>
                        <div className="flex flex-wrap gap-4 text-primary font-medium pt-1">
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
            <div className="lg:col-span-5 relative h-96 lg:h-[480px] rounded-2xl overflow-hidden border border-stone-800 sticky top-24">
              <img
                src={dayItems[activeDayIndex]?.image || safari.image}
                alt="Day Preview"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#141210]/90 backdrop-blur-md border border-stone-800 rounded-xl space-y-1">
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Featured Stay</span>
                <strong className="font-serif text-lg font-bold text-stone-100 block">{dayItems[activeDayIndex]?.stay}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Inclusions & Exclusions */}
        <section className="space-y-8 border-t border-stone-800 pt-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Transparent Pricing</span>
            <h2 className="font-serif text-3xl font-bold text-stone-100">What's included in your safari</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#141210] border border-stone-800 p-6 sm:p-8 rounded-2xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" /> Included Services
              </h3>
              <ul className="space-y-3 text-xs text-stone-300">
                {inclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#141210] border border-stone-800 p-6 sm:p-8 rounded-2xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
                <Minus className="w-5 h-5 text-amber-500" /> Exclusions
              </h3>
              <ul className="space-y-3 text-xs text-stone-400">
                {exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Minus className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-[#1c1916] to-[#25201a] border border-[#3d3326] p-8 sm:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Ready to experience {safari.title}?
            </span>
            <h3 className="font-serif text-3xl font-bold text-stone-100">Tailor this journey around your dates</h3>
            <p className="text-xs text-stone-400 max-w-xl">
              Our safari designers will fine-tune accommodations, add private fly-in transfers, or customize every day around your pace.
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
              href={`https://wa.me/${whatsappClean}?text=Hello%20Discovery%20Safaris%20Namibia%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(safari.title)}.`}
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
