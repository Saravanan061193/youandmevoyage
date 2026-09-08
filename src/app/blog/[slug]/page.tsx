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

    fetch(`/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.title) {
          setPost(data);
        }
        fetch('/api/blogs')
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
      <div className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-400 font-mono">Loading blog article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col justify-center items-center p-6 space-y-4">
        <h2 className="font-serif text-3xl font-bold">Article Not Found</h2>
        <p className="text-xs text-stone-400">The blog post you requested could not be located.</p>
        <Link href="/blog" className="gold-button">
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
      name: 'Discovery Safaris Namibia',
      url: 'https://discovery-safaris-namibia.com',
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
  };

  const parseBoldItalics = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-stone-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-stone-200">{part.slice(1, -1)}</em>;
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
          className="text-[#c5a059] font-bold underline underline-offset-4 hover:text-amber-300 transition-colors"
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
          <h1 key={idx} className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 mt-8 mb-4 border-b border-stone-800 pb-3">
            {renderInlineMarkdown(trimmed.replace(/^#\s+/, ''))}
          </h1>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-[#c5a059] mt-8 mb-3">
            {renderInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-stone-200 mt-6 mb-2">
            {renderInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
          </h3>
        );
      }

      if (trimmed === '---') {
        return <hr key={idx} className="border-stone-800 my-8" />;
      }

      if (trimmed.startsWith('|') && trimmed.includes('|')) {
        const lines = trimmed.split('\n').filter((l) => l.trim() && !l.includes('---'));
        if (lines.length > 0) {
          const headers = lines[0].split('|').map((c) => c.trim()).filter(Boolean);
          const rows = lines.slice(1).map((l) => l.split('|').map((c) => c.trim()).filter(Boolean));

          return (
            <div key={idx} className="overflow-x-auto my-6 border border-stone-800 rounded-xl bg-stone-900/60 p-2 shadow-inner">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-800 text-[#c5a059] font-bold">
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="p-3">{renderInlineMarkdown(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-stone-800/30">
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
          <ul key={idx} className="list-disc list-inside space-y-2 my-4 pl-2 text-stone-300">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map((item) => item.replace(/^\d+\.\s+/, '').trim());
        return (
          <ol key={idx} className="list-decimal list-inside space-y-2 my-4 pl-2 text-stone-300 font-semibold">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <p key={idx} className="text-stone-300 text-base leading-relaxed font-light my-4">
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
      <main className="min-h-screen bg-[#0e0c0a] text-stone-100 flex flex-col selection:bg-[#c5a059] selection:text-black">
        <UtilityBar />
        <Navbar onOpenQuoteModal={() => setIsQuoteOpen(true)} />

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-6 py-12 w-full space-y-8 flex-1">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs text-[#c5a059] font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>

          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#c5a059] text-black text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 leading-tight">
              {post.title}
            </h1>

            <p className="text-base text-stone-300 font-light leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author Bio Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1c1916] border border-[#383129] flex items-center justify-center font-bold text-[#c5a059]">
                  {post.author ? post.author.charAt(0) : 'D'}
                </div>
                <div>
                  <strong className="text-stone-100 font-bold block">{post.author || 'Discovery Safaris Team'}</strong>
                  <span className="text-stone-400 text-[11px] block">{post.authorRole || 'Safari Specialist'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-stone-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
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
          <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content with Markdown parser */}
          <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 sm:p-10 text-stone-300 text-base leading-relaxed shadow-xl font-light space-y-4">
            {renderFormattedContent(post.content)}
          </div>

          {/* Author Box */}
          <div className="bg-[#181614] border border-stone-800 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c5a059] text-black font-bold text-lg flex items-center justify-center shrink-0">
              {post.author ? post.author.charAt(0) : 'D'}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold block">Written By</span>
              <h4 className="font-serif text-lg font-bold text-stone-100">{post.author || 'Discovery Safaris Team'}</h4>
              <p className="text-xs text-stone-400 font-light">
                {post.authorRole || 'Safari Specialist'} at Discovery Safaris Namibia. Specializing in bespoke private expeditions, luxury tented camp logistics, and Namibian conservation.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-[#1c1916] to-[#25201a] border border-[#3d3326] p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Ready to explore Namibia?
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-100">Plan a private custom safari journey</h3>
            </div>
            <button onClick={() => setIsQuoteOpen(true)} className="gold-button shrink-0">
              Request Custom Quote <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-stone-800">
              <h3 className="font-serif text-2xl font-bold text-stone-100">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group bg-[#141210] border border-stone-800 rounded-xl overflow-hidden p-4 space-y-3 hover:border-[#c5a059] transition-all"
                  >
                    <img src={rel.coverImage} alt={rel.title} className="h-32 w-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                    <span className="text-[10px] text-[#c5a059] font-bold uppercase block">{rel.category}</span>
                    <h4 className="font-serif font-bold text-sm text-stone-200 group-hover:text-[#c5a059] transition-colors line-clamp-2">
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
