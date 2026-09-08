'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Star, Lock, Sparkles, Send } from 'lucide-react';

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
    budget: '$4,000 - $6,500 per person',
    category: 'Private Luxury Safari',
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
          duration: `Budget: ${formData.budget}`,
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
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <CheckCircle2 className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-stone-900">Enquiry Received</h2>
            <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{formData.name}</strong>. A senior safari designer will be in touch personally within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setStep(1); onClose(); }}
              className="custom-quote-submit mt-4 max-w-xs mx-auto"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="modal-subheading">INTERACTIVE SAFARI PLANNER</p>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Step {step} of 3
              </span>
            </div>

            <h2 className="modal-title font-serif text-3xl sm:text-4xl">
              Request a custom <em>safari quote</em>
            </h2>

            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden my-3">
              <div
                className="bg-amber-600 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="custom-quote-form space-y-3 mt-4">
              {/* STEP 1: TRIP DETAILS */}
              {step === 1 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="field-group">
                    <label>SAFARI CATEGORY / STYLE</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Private Luxury Safari">Private Luxury Safari (Etosha & Sossusvlei)</option>
                      <option value="Luxury Fly-in Expedition">Luxury Fly-in Expedition (Private Cessna)</option>
                      <option value="Honeymoon & Romantic Escape">Honeymoon & Romantic Escape</option>
                      <option value="Wildlife Photography Safari">Wildlife Photography Safari</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <div className="flex items-center justify-between">
                      <label>ESTIMATED BUDGET PER PERSON</label>
                      <span className="text-[9.5px] text-amber-700 font-bold">⭐ 4.9/5 Value Rated</span>
                    </div>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="$2,500 - $4,000 per person">$2,500 – $4,000 per person</option>
                      <option value="$4,000 - $6,500 per person">$4,000 – $6,500 per person</option>
                      <option value="$6,500 - $10,000 per person">$6,500 – $10,000 per person</option>
                      <option value="$10,000+ per person">$10,000+ per person</option>
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
                      className="px-4 py-3 bg-stone-200 text-stone-800 font-bold text-xs rounded hover:bg-stone-300 transition-colors"
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
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <Lock className="w-3.5 h-3.5 text-amber-700" /> 100% Free & No Obligation
                    </span>
                    <span className="font-bold">⭐ 4.9/5 TripAdvisor</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 bg-stone-200 text-stone-800 font-bold text-xs rounded hover:bg-stone-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button type="submit" disabled={loading} className="custom-quote-submit flex-1">
                      {loading ? 'Sending enquiry...' : 'Submit Safari Enquiry'} <Send className="w-4 h-4" />
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
