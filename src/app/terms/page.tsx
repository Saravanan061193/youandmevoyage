'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { SEOHelper } from '@/components/SEOHelper';

function cleanLegalHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  if (!/<[a-z][\s\S]*>/i.test(rawHtml)) {
    return rawHtml;
  }
  let cleaned = rawHtml;
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
  cleaned = cleaned.replace(/<html[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/html>/gi, '');
  cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, (headMatch) => {
    const styleMatches = headMatch.match(/<style[\s\S]*?<\/style>/gi) || [];
    return styleMatches.join('\n');
  });
  cleaned = cleaned.replace(/<body[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/body>/gi, '');
  return cleaned.trim();
}

export default function TermsPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Read from localStorage cache immediately
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_settings_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.termsContent) {
            setContent(parsed.termsContent);
            setLoading(false);
          }
        } catch (e) {}
      }
    }

    // 2. Fetch fresh settings from API
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.termsContent) {
          setContent(data.termsContent);
          if (typeof window !== 'undefined') {
            try {
              const existing = JSON.parse(localStorage.getItem('site_settings_cache') || '{}');
              localStorage.setItem('site_settings_cache', JSON.stringify({ ...existing, ...data }));
            } catch (e) {}
          }
        } else if (!content) {
          setContent(
            'Welcome to You & Me – Independent Voyage. By booking a private tour package with us, you agree to our terms and conditions. All private tour packages include dedicated AC vehicle, experienced local driver companion, and full itinerary support.'
          );
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  const formattedContent = cleanLegalHtml(content);

  return (
    <CurrencyProvider>
      <main className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white flex flex-col">
        <SEOHelper
          title="Terms & Conditions | You & Me – Independent Voyage"
          description="Read our terms and conditions for private tour bookings, driver companion services, payments, and cancellations in South India."
          canonicalUrl="https://youandmevoyage.com/terms"
        />
        <UtilityBar />
        <Navbar onOpenQuoteModal={() => {}} />

        <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-orange-500 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <header className="border-b border-slate-200 pb-6 space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-orange-500 font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Legal Information
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Terms & Conditions</h1>
            <p className="text-xs text-slate-500">Last updated & synced with You & Me CMS</p>
          </header>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-slate-700 text-sm leading-relaxed shadow-xl font-sans [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-4 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-slate-200 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-slate-900">
            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading terms content...</div>
            ) : isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
            ) : (
              <div className="whitespace-pre-line">{content}</div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </CurrencyProvider>
  );
}
