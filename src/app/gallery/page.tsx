'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { X, ZoomIn, MapPin } from 'lucide-react';
import { SEOHelper } from '@/components/SEOHelper';

function GalleryContent() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const categories = [
    'All',
    'Tamil Nadu',
    'Kerala',
    'Culture',
    'Food',
    'Temples',
    'Nature',
    'Journeys',
  ];

  const galleryImages = [
    {
      id: 1,
      title: 'Soaring Gopuram of Meenakshi Temple',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      category: 'Tamil Nadu',
      location: 'Madurai',
    },
    {
      id: 2,
      title: 'French Quarter Streets in White Town',
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
      category: 'Culture',
      location: 'Pondicherry',
    },
    {
      id: 3,
      title: 'Private Houseboat Cruise in Alleppey',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
      category: 'Kerala',
      location: 'Alleppey',
    },
    {
      id: 4,
      title: 'Authentic Chettinad Banana Leaf Feast',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
      category: 'Food',
      location: 'Chettinad',
    },
    {
      id: 5,
      title: 'Shore Temple Sunset at Ocean Edge',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
      category: 'Temples',
      location: 'Mahabalipuram',
    },
    {
      id: 6,
      title: 'Misty Green Tea Plantations',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
      category: 'Nature',
      location: 'Munnar',
    },
  ];

  const filteredImages = galleryImages.filter(
    (img) => activeCategory === 'All' || img.category === activeCategory
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SEOHelper
        title="Photo Gallery | You & Me – Independent Voyage"
        description="Explore our visual journey through Tamil Nadu and Kerala. Photos of temples, backwaters, tea gardens, French quarters, and local culture."
        canonicalUrl="https://youandmevoyage.com/gallery"
        keywords="South India photo gallery, Tamil Nadu pictures, Kerala houseboat photos, Munnar tea plantation photos, Madurai temple photos"
      />
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">Visual Moments</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            South India Photo Gallery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            A glimpse into the colors, heritage, landscapes, and culinary traditions across Tamil Nadu and Kerala.
          </p>
        </div>
      </section>

      {/* Filter Tabs & Gallery Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="relative h-72 rounded-2xl overflow-hidden bg-[#0F172A] cursor-pointer group shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block mb-0.5">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-bold text-lg leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-sans">
                    <MapPin className="w-3 h-3 text-orange-400" /> {item.location}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F172A]/80 text-white flex items-center justify-center hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-[65vh] bg-[#0F172A]">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-orange-400 tracking-widest block">
                  {selectedImage.category}
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" /> {selectedImage.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function GalleryPage() {
  return (
    <CurrencyProvider>
      <GalleryContent />
    </CurrencyProvider>
  );
}
