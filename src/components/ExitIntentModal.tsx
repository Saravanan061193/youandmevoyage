'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Star, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react';

interface ExitIntentModalProps {
  onOpenQuoteModal: () => void;
}

export const ExitIntentModal = ({ onOpenQuoteModal }: ExitIntentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    interest: 'Private Luxury Safari',
  });

  useEffect(() => {
    // Check if exit intent was already shown in this session
    const shown = sessionStorage.getItem('exit_intent_shown');
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    };

    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () => document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggered]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = formData.emailOrPhone.includes('@');
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: isEmail ? formData.emailOrPhone : 'exitintent@discoverysafaris.com',
          phone: !isEmail ? formData.emailOrPhone : '+264 81 123 4567',
          category: `Exit-Intent Lead: ${formData.interest}`,
          destination: 'Sossusvlei & Etosha National Park',
          message: 'Captured via Exit-Intent Popup: Requested urgent 24-hour safari expert consultation.',
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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 ring-1 ring-orange-500/20">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto text-orange-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Consultation Scheduled!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.name}</strong>. One of our head travel specialists will reach out to you within 24 hours with your custom itinerary.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-colors"
            >
              Back to Exploration
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Before You Leave
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Speak to a <span className="text-orange-500 italic">Travel Expert</span> within 24h
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Don't leave empty-handed. Leave your details below to receive a complimentary custom itinerary + free 2026 South India Travel Guide.
              </p>
            </div>

            {/* Social Proof Strip */}
            <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center text-orange-400 gap-0.5 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-orange-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300">
                <span className="font-bold text-white">4.9/5 Rating</span> • Rated Top Luxury Tour Operator in South India
              </p>
            </div>

            {/* Quick Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address or WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sarah@example.com or +1 555-0192"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Preferred Journey Style
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-slate-100 text-sm outline-none transition-colors"
                >
                  <option value="Tamil Nadu Journeys">Tamil Nadu Temple & Cultural Journeys</option>
                  <option value="Kerala Backwaters">Kerala Backwater & Hill Station Journeys</option>
                  <option value="South India Signature">South India Signature Grand Tour</option>
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Requesting Consultation...' : 'Get Free Consultation & Guide'} <Send className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="w-full py-2 text-slate-400 hover:text-orange-400 text-xs font-semibold transition-colors text-center block"
                >
                  Or build detailed custom quote wizard →
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> 100% Free & No Obligation</span>
              <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5 text-orange-400" /> 24h Response</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
