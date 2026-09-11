'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  Bookmark,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';

export default function SingleBlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let foundInCache = false;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_blogs_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            const match = parsed.find((b) => b.slug === slug || b.id === slug);
            if (match) {
              setPost(match);
              setRelatedPosts(parsed.filter((b) => b.slug !== slug && b.id !== slug).slice(0, 3));
              setLoading(false);
              foundInCache = true;
            }
          }
        } catch (e) {}
      }
    }

    fetch(`/api/blogs/${slug}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.title) {
          setPost(data);
        }
        fetch('/api/blogs', { cache: 'no-store' })
          .then((r) => r.json())
          .then((all) => {
            if (Array.isArray(all)) {
              setRelatedPosts(all.filter((b) => b.slug !== slug && b.id !== slug).slice(0, 3));
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => {
        if (!foundInCache) console.error(e);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-sans">Loading blog article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-center items-center p-6 space-y-4">
        <h2 className="font-serif text-3xl font-bold text-white">Article Not Found</h2>
        <p className="text-xs text-slate-400">The blog post you requested could not be located.</p>
        <Link
          href="/blog"
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Blog
        </Link>
      </div>
    );
  }

  // SEO JSON-LD Structured Data
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'You & Me – Independent Voyage',
      url: 'https://youandmevoyage.com',
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
  };

  const parseBoldItalics = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-orange-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseBoldItalics(text.substring(lastIndex, match.index)));
      }
      const label = match[1];
      const url = match[2];

      parts.push(
        <Link
          key={match.index}
          href={url}
          className="text-orange-400 font-bold underline underline-offset-4 hover:text-orange-300 transition-colors"
        >
          {label}
        </Link>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(parseBoldItalics(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : parseBoldItalics(text);
  };

  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const blocks = content.split(/\n\n+/);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="font-serif text-3xl sm:text-4xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-3">
            {renderInlineMarkdown(trimmed.replace(/^#\s+/, ''))}
          </h1>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-orange-400 mt-8 mb-3">
            {renderInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-white mt-6 mb-2">
            {renderInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
          </h3>
        );
      }

      if (trimmed === '---') {
        return <hr key={idx} className="border-slate-800 my-8" />;
      }

      if (trimmed.startsWith('|') && trimmed.includes('|')) {
        const lines = trimmed.split('\n').filter((l) => l.trim() && !l.includes('---'));
        if (lines.length > 0) {
          const headers = lines[0].split('|').map((c) => c.trim()).filter(Boolean);
          const rows = lines.slice(1).map((l) => l.split('|').map((c) => c.trim()).filter(Boolean));

          return (
            <div key={idx} className="overflow-x-auto my-6 border border-slate-800 rounded-xl bg-slate-900/60 p-2 shadow-inner">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-orange-400 font-bold">
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="p-3">{renderInlineMarkdown(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3">{renderInlineMarkdown(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item) => item.replace(/^[*|-]\s+/, '').trim());
        return (
          <ul key={idx} className="list-disc list-inside space-y-2.5 my-4 pl-2 text-slate-300">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed font-sans">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map((item) => item.replace(/^\d+\.\s+/, '').trim());
        return (
          <ol key={idx} className="list-decimal list-inside space-y-2.5 my-4 pl-2 text-slate-300 font-medium">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed font-sans">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <p key={idx} className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans font-normal my-4">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <CurrencyProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <main className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
        <UtilityBar />
        <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 flex-1">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs text-orange-400 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>

          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-orange-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                {post.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author Bio Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-bold text-orange-400">
                  {post.author ? post.author.charAt(0) : 'Y'}
                </div>
                <div>
                  <strong className="text-white font-bold block">{post.author || 'You & Me Team'}</strong>
                  <span className="text-slate-400 text-[11px] block">{post.authorRole || 'Travel Specialist'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'Recently Published'}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          <div className="relative h-80 sm:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content with Markdown parser */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 text-slate-300 text-base leading-relaxed shadow-2xl font-sans space-y-4">
            {renderFormattedContent(post.content)}
          </div>

          {/* Author Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
              {post.author ? post.author.charAt(0) : 'Y'}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-orange-400 font-bold block">Written By</span>
              <h4 className="font-serif text-lg font-bold text-white">{post.author || 'You & Me Team'}</h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {post.authorRole || 'Travel Specialist'} at You & Me – Independent Voyage. Specializing in bespoke private tours, temple trails, backwater cruises, and South Indian road trips.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <span className="text-xs text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Ready to explore South India?
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">Plan a private custom journey</h3>
            </div>
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 relative z-10"
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h3 className="font-serif text-2xl font-bold text-white">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3 hover:border-orange-500/50 transition-all shadow-lg"
                  >
                    <img src={rel.coverImage} alt={rel.title} className="h-32 w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
                    <span className="text-[10px] text-orange-400 font-bold uppercase block">{rel.category}</span>
                    <h4 className="font-serif font-bold text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <Footer />
        <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      </main>
    </CurrencyProvider>
  );
}
