'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Star, Lock, Sparkles, Send, MessageCircle } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal = ({ isOpen, onClose }: QuoteModalProps) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    date: '',
    travelers: '2',
    category: 'Tamil Nadu Temple & Cultural Journeys',
    message: '',
  });

  if (!isOpen) return null;

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

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
          category: `${formData.category} (${formData.country ? formData.country : 'Global'})`,
          month: formData.date || 'October 2026',
          travelers: formData.travelers,
          message: formData.message,
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
    <div className="modal-backdrop">
      <div className="custom-quote-modal max-w-xl">
        <button onClick={onClose} className="custom-quote-close" aria-label="Close modal">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-white">Enquiry Received!</h2>
            <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed font-sans">
              Thank you, <strong className="text-white">{formData.name}</strong>. A senior travel specialist will reach out to you personally within 24 hours.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/919994315778?text=${encodeURIComponent(`Hi You & Me! I just submitted a custom journey enquiry on your website.\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Category:* ${formData.category}\n*Travel Date:* ${formData.date || 'Flexible'}\n*Travellers:* ${formData.travelers}\n*Notes:* ${formData.message}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg flex-1 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Send via WhatsApp
              </a>
              <button
                onClick={() => { setSubmitted(false); setStep(1); onClose(); }}
                className="w-full sm:w-auto py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex-1 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="modal-subheading">INTERACTIVE JOURNEY PLANNER</p>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full shadow-sm">
                Step {step} of 3
              </span>
            </div>

            <h2 className="modal-title font-serif text-3xl sm:text-4xl">
              Request a custom <em>journey quote</em>
            </h2>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden my-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-400 h-full transition-all duration-300 shadow-sm"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="custom-quote-form space-y-3 mt-4">
              {/* STEP 1: TRIP DETAILS */}
              {step === 1 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="field-group">
                    <label>JOURNEY CATEGORY / STYLE</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Tamil Nadu Journeys">Tamil Nadu Temple & Cultural Journeys</option>
                      <option value="Kerala Backwater & Hill Journeys">Kerala Backwater & Hill Station Journeys</option>
                      <option value="South India Signature Grand Tour">South India Signature Grand Tour</option>
                      <option value="Food & Culinary Journeys">Food & Culinary Journeys</option>
                      <option value="Goa Beach & Portuguese Heritage">Goa Beach & Portuguese Heritage</option>
                      <option value="Karnataka Royal & Garden Trail">Karnataka Royal & Garden Trail</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="custom-quote-submit"
                  >
                    Step 2: Travelers & Dates <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: DATES & TRAVELERS */}
              {step === 2 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="form-row two-col">
                    <div className="field-group">
                      <label>TRAVEL DATE</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="field-group">
                      <label>NUMBER OF TRAVELLERS</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>SPECIAL REQUESTS OR WISHLIST</label>
                    <textarea
                      rows={2}
                      placeholder="Tell us what would make this journey unforgettable..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="custom-quote-submit flex-1"
                    >
                      Step 3: Contact Info <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONTACT INFO & SUBMIT */}
              {step === 3 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="form-row two-col">
                    <input
                      type="text"
                      required
                      placeholder="Full name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-row two-col">
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp / Phone *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Country of residence"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>

                  {/* Strategic Social Proof Badge */}
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-center justify-between shadow-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-orange-400" /> 100% Free & No Obligation
                    </span>
                    <span className="font-bold text-orange-400">⭐ 4.9/5 TripAdvisor</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button type="submit" disabled={loading} className="custom-quote-submit flex-1">
                      {loading ? 'Sending enquiry...' : 'Submit Journey Enquiry'} <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
