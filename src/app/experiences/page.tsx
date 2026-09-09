'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { ArrowRight, Sparkles, Compass, Heart, Camera, Coffee } from 'lucide-react';

function ExperiencesContent() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const experiencesList = [
    {
      title: 'Temple & Heritage Architecture',
      subtitle: 'Soaring Dravidian Gopurams & 1000-Year UNESCO Temples',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      desc: 'Marvel at living temple rituals, granite stone carving traditions, and active Chola & Pallava architecture with expert local historians.',
    },
    {
      title: 'South Indian Food & Culinary Trails',
      subtitle: 'Banana Leaf Feasts, Chettinad Spices & Brass Filter Coffee',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
      desc: 'Embark on private food walks, home-style cooking classes with local hosts, and authentic regional thali discoveries.',
    },
    {
      title: 'Kerala Backwater Houseboat Cruises',
      subtitle: 'Tranquil Lagoons & Private Houseboat Cooking',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
      desc: 'Unwind on traditional air-conditioned kettuvallam houseboats gliding gently past palm-shaded village canals.',
    },
    {
      title: 'Local Village & Artisan Encounters',
      subtitle: 'Silk Weavers, Athangudi Tile Studios & Potters',
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
      desc: 'Engage directly with Kanchipuram silk weavers, antique dealers, and traditional Kathakali performing artists.',
    },
    {
      title: 'Hill Stations & Tea Plantation Walks',
      subtitle: 'Misty Valleys & Bungalow Stays in Munnar',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
      desc: 'Stroll through endless green tea estates in the Western Ghats, visit tea processing factories, and breathe cool mountain air.',
    },
    {
      title: 'Ayurveda & Holistic Wellness',
      subtitle: 'Authentic Herbal Treatments & Quiet Retreats',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      desc: 'Rejuvenate with traditional Ayurvedic oil therapies, yoga sessions, and quiet sanctuary resorts across Kerala.',
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">Immersive Travel</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Authentic South Indian Experiences
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Every journey with You & Me is enriched with handpicked local encounters tailored to your personal interests.
          </p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiencesList.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden bg-[#0F172A]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85";
                  }}
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs font-semibold text-orange-600 italic">
                    {exp.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href="/build-your-trip"
                    className="gold-button text-xs font-bold w-full justify-center text-center py-2.5 rounded-xl"
                  >
                    Include in My Trip <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function ExperiencesPage() {
  return (
    <CurrencyProvider>
      <ExperiencesContent />
    </CurrencyProvider>
  );
}
