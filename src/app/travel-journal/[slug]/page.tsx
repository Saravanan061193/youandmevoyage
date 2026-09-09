'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { Clock, User, ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';

function ArticleDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const match = data.find(
            (b) => b.slug === slug || b.id === slug || b.title.toLowerCase().replace(/\s+/g, '-') === slug
          );
          setPost(match || data[0]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !post) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
        <div className="py-20 text-center text-slate-500 font-sans">Loading article...</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Cover */}
      <section className="relative h-[55vh] bg-[#0F172A] flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-3">
          <Link
            href="/travel-journal"
            className="inline-flex items-center gap-1 text-xs text-orange-400 font-bold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Travel Journal
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-300 font-sans pt-2">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-orange-400" /> {post.author} ({post.authorRole || 'Travel Specialist'})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> {post.readTime || '5 min read'}
            </span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <article className="prose prose-slate max-w-none font-sans text-slate-800 leading-relaxed space-y-6">
          <p className="text-lg font-serif italic text-orange-950 border-l-4 border-orange-500 pl-4 py-1">
            {post.excerpt}
          </p>

          <div
            className="space-y-4 text-sm sm:text-base whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA Box */}
        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-3xl p-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-slate-900">
            Inspired to Plan Your Own South India Journey?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-sans">
            Our travel specialists craft customized itineraries with private driver companions tailored to your dates and preferences.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/build-your-trip"
              className="gold-button text-xs font-bold px-6 py-3 rounded-xl"
            >
              Plan Your Journey <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}

export default function ArticleDetailPage() {
  return (
    <CurrencyProvider>
      <ArticleDetailContent />
    </CurrencyProvider>
  );
}
