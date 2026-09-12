'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, User, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { SEOHelper } from '@/components/SEOHelper';

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadBlogs = () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_blogs_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBlogs(parsed);
            setLoading(false);
          }
        } catch (e) {}
      }
    }

    fetch('/api/blogs', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_blogs_cache', JSON.stringify(data));
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();

    const handleUpdate = () => {
      loadBlogs();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('blogs_updated', handleUpdate);
      return () => {
        window.removeEventListener('blogs_updated', handleUpdate);
      };
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const categories = ['All', 'Travel Guide', 'Itinerary', 'Food & Culture'];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    return true;
  });

  const featuredPost = blogs[0];
  const gridPosts = selectedCategory === 'All' ? filteredBlogs.slice(1) : filteredBlogs;

  const totalPages = Math.ceil(gridPosts.length / itemsPerPage);
  const paginatedGridPosts = gridPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <CurrencyProvider>
      <main className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white font-sans">
        <SEOHelper
          title="South India Travel Journal & Guides | You & Me – Independent Voyage"
          description="Read travel guides, itinerary tips, temple etiquette, and culinary secrets curated by local companions at You & Me Independent Voyage."
          keywords="South India Travel Blog, Tamil Nadu Travel Guide, Kerala Itinerary Tips, Chettinad Food Guide, Temple Etiquette India"
          canonicalUrl="https://youandmevoyage.com/blog"
        />
        <UtilityBar />
        <Navbar onOpenQuoteModal={() => {}} />

        {/* Blog Header Hero */}
        <section className="relative bg-[#0F172A] border-b border-slate-800 py-16 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-orange-400 font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="max-w-3xl space-y-3">
              <span className="text-[11px] uppercase tracking-widest text-orange-400 font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> South India Journal & Travel Guides
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-tight">
                Tales, Guides & Stories from <span className="text-orange-400">South India</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Insider advice on Tamil Nadu temple trails, Kerala backwaters, culinary journeys, and private driver planning written by local travel companions.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-400/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-orange-500/50 hover:text-orange-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Content Container */}
        <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16 flex-1">
          {loading ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading blog articles...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm font-sans">
              No blog posts found in this category.
            </div>
          ) : (
            <>
              {/* Featured Post Card (Only shown on 'All' category) */}
              {selectedCategory === 'All' && featuredPost && (
                <article className="group bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 transition-all hover:border-orange-500/50">
                  <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[340px] overflow-hidden">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                      Featured Guide
                    </span>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="text-orange-400 font-bold uppercase tracking-wider">{featuredPost.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-400" /> {featuredPost.readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                          {featuredPost.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-bold">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-xs text-white font-bold block">{featuredPost.author}</strong>
                          <span className="text-[10px] text-slate-400 block">{featuredPost.authorRole}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-bold hover:text-orange-300 hover:translate-x-1 transition-all"
                      >
                        Read Article <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* Grid of Articles */}
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedGridPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-orange-500/50 transition-all hover:-translate-y-1 shadow-xl"
                    >
                      <div>
                        <div className="relative h-52 w-full overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <span className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-md border border-slate-700 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-orange-400" /> {post.readTime}
                            </span>
                            <span>·</span>
                            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently Published'}</span>
                          </div>

                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="font-serif text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800 mt-4 pt-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs text-slate-300 font-medium">{post.author}</span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 hover:translate-x-1 transition-all"
                        >
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
                    <span className="text-xs text-slate-400">
                      Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                      <strong className="text-white">{Math.min(currentPage * itemsPerPage, gridPosts.length)}</strong> of{' '}
                      <strong className="text-white">{gridPosts.length}</strong> articles
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500 hover:text-orange-400 transition-all"
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 text-xs font-bold rounded transition-all ${
                            currentPage === pageNum
                              ? 'bg-orange-500 text-white shadow-md'
                              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-orange-500 hover:text-orange-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500 hover:text-orange-400 transition-all"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <Footer />
      </main>
    </CurrencyProvider>
  );
}
