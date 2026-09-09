'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Plane, Star, ShieldCheck, MapPin, Compass } from 'lucide-react';

interface IntentLandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntentLandingModal = ({ isOpen, onClose }: IntentLandingModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '2',
    month: 'October 2026',
    specialRequest: '',
  });

  if (!isOpen) return null;

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
          phone: formData.phone,
          category: 'High-Intent SEO: Luxury Fly-in Safari Etosha & Sossusvlei',
          destination: 'Etosha Private Game Reserve & Sossusvlei Dunes',
          month: formData.month,
          travelers: formData.travelers,
          message: formData.specialRequest || 'Requested private Cessna charter fly-in expedition quote.',
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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 ring-1 ring-orange-500/20 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto text-orange-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">Custom Journey Quote Requested!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.name}</strong>. Our senior travel specialist is preparing your private driver itinerary & hotel availability report.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
                <Plane className="w-3.5 h-3.5" /> Signature Private Journey Package
              </div>

              <div className="flex items-center text-orange-400 gap-1 text-xs font-bold">
                <Star className="w-4 h-4 fill-orange-400" />
                <span>4.9/5 Rated on TripAdvisor</span>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Private Driver Journey: <span className="text-orange-500 italic">Tamil Nadu & Kerala</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Enjoy seamless road travel with dedicated AC vehicles and local companion drivers across South India.
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vehicle Class</span>
                <strong className="text-white block">Dedicated AC SUV / Sedan</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                <strong className="text-orange-400 block">7 Days / 6 Nights</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hotel Level</span>
                <strong className="text-white block">4★ / 5★ Heritage Lodges</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Est. Investment</span>
                <strong className="text-orange-400 block">$1,500 - $3,200 p.p.</strong>
              </div>
            </div>

            {/* Direct Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Instant Driver Availability Check & Quote
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Hassel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. david@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Travel Month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Calculating Journey Quote...' : 'Request Private Driver Itinerary & Pricing'} <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Complimentary Itinerary</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-400" /> Private AC Vehicle</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
