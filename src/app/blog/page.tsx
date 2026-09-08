'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, User, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';

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

    fetch('/api/blogs')
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

  const categories = ['All', 'Travel Guide', 'Wildlife', 'Photography'];

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
      <main className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col selection:bg-[#c5a059] selection:text-black">
        <UtilityBar />
        <Navbar onOpenQuoteModal={() => {}} />

        {/* Blog Header Hero */}
        <section className="relative bg-gradient-to-b from-[#141210] to-[#0e0c0a] border-b border-stone-800/80 py-16 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-[#c5a059] font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="max-w-3xl space-y-3">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Namibia Journal & Travel Guides
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-100 leading-tight">
                Tales, Guides & Wildlife Stories from <em>Namibia</em>
              </h1>
              <p className="text-sm text-stone-400 font-light leading-relaxed">
                Insider advice on Etosha waterholes, Sossusvlei dune photography, weather windows, and luxury safari planning written by resident ecologists and expedition guides.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'bg-[#181614] border border-stone-800 text-stone-300 hover:border-[#c5a059] hover:text-[#c5a059]'
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
              <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-400">Loading blog articles...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm">
              No blog posts found in this category.
            </div>
          ) : (
            <>
              {/* Featured Post Card (Only shown on 'All' category) */}
              {selectedCategory === 'All' && featuredPost && (
                <article className="group bg-[#161412] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 transition-all hover:border-[#c5a059]/60">
                  <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[340px] overflow-hidden">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-[#c5a059] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                      Featured Guide
                    </span>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs text-stone-400">
                        <span className="text-[#c5a059] font-bold uppercase tracking-wider">{featuredPost.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 group-hover:text-[#c5a059] transition-colors leading-snug">
                          {featuredPost.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-stone-300 font-light leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs text-[#c5a059] font-bold">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-xs text-stone-200 block">{featuredPost.author}</strong>
                          <span className="text-[10px] text-stone-500 block">{featuredPost.authorRole}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#c5a059] font-bold hover:translate-x-1 transition-transform"
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
                      className="group bg-[#161412] border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#c5a059]/60 transition-all hover:-translate-y-1 shadow-lg"
                    >
                      <div>
                        <div className="relative h-52 w-full overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <span className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md border border-stone-700 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                            {post.category}
                          </span>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-3 text-[11px] text-stone-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-500" /> {post.readTime}
                            </span>
                            <span>·</span>
                            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently Published'}</span>
                          </div>

                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="font-serif text-xl font-bold text-stone-100 group-hover:text-[#c5a059] transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-800/60 mt-4 pt-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span className="text-xs text-stone-300 font-medium">{post.author}</span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs text-[#c5a059] font-bold flex items-center gap-1 hover:translate-x-1 transition-transform"
                        >
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141210] border border-stone-800 p-4 rounded-xl">
                    <span className="text-xs text-stone-400">
                      Showing <strong className="text-stone-200">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                      <strong className="text-stone-200">{Math.min(currentPage * itemsPerPage, gridPosts.length)}</strong> of{' '}
                      <strong className="text-stone-200">{gridPosts.length}</strong> articles
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 text-xs font-bold rounded transition-all ${
                            currentPage === pageNum
                              ? 'bg-[#c5a059] text-black shadow-md'
                              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-[#c5a059]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
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
