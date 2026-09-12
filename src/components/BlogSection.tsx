'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { BlogItem } from '@/lib/inMemoryStore';

const FALLBACK_BLOGS: BlogItem[] = [];

export const BlogSection = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setBlogs(data.slice(0, 3));
          } else {
            setBlogs([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch blogs for homepage section:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-slate-100 border-t border-slate-800 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Travel Journal & Guides</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Insights & Stories from <span className="text-orange-400">South India</span>
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Insider advice, route highlights, temple etiquette, and culinary secrets curated by our local travel companions.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800/80 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 hover:border-orange-500 transition-all duration-300 group shadow-lg"
            >
              <span>Explore All Travel Stories</span>
              <ArrowRight className="w-4 h-4 text-orange-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col group"
            >
              {/* Image Header */}
              <Link href={`/blog/${blog.slug}`} className="relative h-56 overflow-hidden block">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-md">
                    {blog.category}
                  </span>
                </div>

                {/* Read time badge */}
                <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{blog.readTime || '5 min read'}</span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 line-clamp-2 leading-snug">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-400 mt-3 font-sans line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-1">{blog.author || 'You & Me Team'}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{blog.authorRole || 'Local Guide'}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 group/btn"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
