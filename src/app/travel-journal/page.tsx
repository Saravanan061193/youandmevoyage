'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';
import { SEOHelper } from '@/components/SEOHelper';

function TravelJournalContent() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SEOHelper
        title="Travel Journal & Guides | You & Me – Independent Voyage"
        description="South India travel guides, cultural advice, temple route tips, Kerala backwater itineraries, and private driver tour inspiration."
        canonicalUrl="https://youandmevoyage.com/travel-journal"
        keywords="South India travel journal, Tamil Nadu travel guide, Kerala travel advice, driver tour guide South India"
      />
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">South India Travel Journal</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Guides, Itineraries & Cultural Insights
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Curated articles on Tamil Nadu temple trails, Kerala backwaters, culinary traditions, and driver-assisted road trip advice.
          </p>
        </div>
      </section>

      {/* Journal Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-sans">Loading travel journal articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden bg-[#0F172A]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85";
                    }}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#0F172A]/80 backdrop-blur-md text-orange-400 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-orange-500/30">
                    {post.category || 'Travel Guide'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" /> {post.readTime || '5 min read'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-orange-500" /> {post.author || 'You & Me Team'}
                      </span>
                    </div>

                    <Link href={`/travel-journal/${post.slug || post.id}`}>
                      <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/travel-journal/${post.slug || post.id}`}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function TravelJournalPage() {
  return (
    <CurrencyProvider>
      <TravelJournalContent />
    </CurrencyProvider>
  );
}
