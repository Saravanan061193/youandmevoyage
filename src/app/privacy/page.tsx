'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { UtilityBar } from '@/components/UtilityBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/components/CurrencyContext';

export default function PrivacyPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Read from localStorage cache immediately
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_settings_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.privacyContent) {
            setContent(parsed.privacyContent);
            setLoading(false);
          }
        } catch (e) {}
      }
    }

    // 2. Fetch fresh settings from API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.privacyContent) {
          setContent(data.privacyContent);
          if (typeof window !== 'undefined') {
            try {
              const existing = JSON.parse(localStorage.getItem('site_settings_cache') || '{}');
              localStorage.setItem('site_settings_cache', JSON.stringify({ ...existing, ...data }));
            } catch (e) {}
          }
        } else if (!content) {
          setContent(
            'You & Me – Independent Voyage values your privacy. We strictly protect your personal information, contact details, payment info, and booking requirements.'
          );
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CurrencyProvider>
      <main className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white flex flex-col">
        <UtilityBar />
        <Navbar onOpenQuoteModal={() => {}} />

        <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-orange-500 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <header className="border-b border-slate-200 pb-6 space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-orange-500 font-bold flex items-center gap-2">
              <Lock className="w-4 h-4" /> Data Privacy & Protection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Last updated & synced with You & Me CMS</p>
          </header>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-slate-700 text-sm leading-relaxed whitespace-pre-line shadow-xl font-sans">
            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading privacy policy...</div>
            ) : (
              content
            )}
          </div>
        </div>

        <Footer />
      </main>
    </CurrencyProvider>
  );
}
