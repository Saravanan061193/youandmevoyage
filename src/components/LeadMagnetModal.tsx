'use client';

import React, { useState } from 'react';
import { X, Download, BookOpen, CheckCircle2, Star, Shield, Sparkles } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadMagnetModal = ({ isOpen, onClose }: LeadMagnetModalProps) => {
  const { settings } = useCurrency();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  if (!isOpen) return null;

  const pdfUrl = settings?.leadMagnetPdfUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: '+264 81 123 4567',
          category: `Lead Magnet: ${settings?.leadMagnetTitle || 'Namibia Safari Guide PDF'}`,
          destination: 'Sossusvlei & Etosha National Park',
          message: 'Requested Safari Guide eBook download.',
        }),
      });

      if (res.ok) {
        const newInquiry = await res.json();
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('site_inquiries_cache');
          let list: any[] = [];
          if (cached) {
            try { list = JSON.parse(cached); } catch (err) {}
          }
          list.unshift(newInquiry);
          localStorage.setItem('site_inquiries_cache', JSON.stringify(list));
          window.dispatchEvent(new Event('inquiries_updated'));
        }
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#141210] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 ring-1 ring-amber-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-900 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">Guide Ready to Download!</h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
              We have processed your request for <strong>{formData.email}</strong>. Download your official guide directly below:
            </p>
            <div className="pt-2 flex flex-col gap-3 max-w-xs mx-auto">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Namibia_Safari_Guide.pdf"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download PDF Guide
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Free Safari Guide Download
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* eBook Cover Card Preview */}
              <div className="sm:col-span-5 bg-gradient-to-br from-amber-950/60 to-stone-900 border border-amber-500/30 rounded-2xl p-5 text-center relative overflow-hidden shadow-xl">
                <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold mb-1">Official Publication</div>
                <h4 className="font-serif text-lg font-bold text-stone-100 leading-tight">
                  {settings?.leadMagnetTitle?.replace('Download Free: ', '') || 'Ultimate Namibia Safari Guide'}
                </h4>
                <div className="my-3 py-2 border-y border-amber-500/20 text-[10px] text-stone-300 font-sans leading-tight">
                  ⭐ Wildlife Maps & Season Charts
                </div>
                <span className="inline-block px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30">
                  Full Color PDF Edition
                </span>
              </div>

              {/* Description & Form */}
              <div className="sm:col-span-7 space-y-3">
                <h3 className="font-serif text-2xl font-bold text-stone-50 leading-tight">
                  Get the Insider Guide to <span className="text-amber-500 italic">Namibia Safaris</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {settings?.leadMagnetSubtext || 'Discover best travel months, wildlife tracking maps, luxury lodge comparisons & budget breakdowns.'}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                  <span>Trusted by 10,000+ Luxury Travelers</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email address for PDF delivery"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Preparing eBook...' : (settings?.leadMagnetButtonText || 'Download Free Guide (PDF)')} <Download className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                  <Shield className="w-3 h-3 text-amber-500" /> We respect your privacy. Instant download link.
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
