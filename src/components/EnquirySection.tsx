'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, PhoneCall, Compass, Sparkles, ArrowRight, ArrowLeft, Star, Lock } from 'lucide-react';

export const EnquirySection = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    category: 'Private Luxury Safari',
    destination: 'Sossusvlei & Etosha National Park',
    month: 'October 2026',
    duration: '7 - 10 Days',
    travelers: '2',
    budget: '$4,000 - $6,500 per person',
    message: '',
  });

  const nextStep = () => {
    if (step === 1) {
      if (!formData.category || !formData.destination) {
        alert('Please select your preferred safari category and destination.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.travelers || !formData.duration) {
        alert('Please enter number of travelers and duration.');
        return;
      }
    }
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
          destination: formData.destination,
          month: formData.month,
          duration: `${formData.duration} | Budget: ${formData.budget}`,
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
        setSubmittedName(formData.name);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enquiry" className="py-20 bg-[#0F172A] text-slate-100 relative overflow-hidden border-t border-slate-800">
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Information & Trust */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Interactive 3-Step Journey Planner
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Plan Your Dream <span className="text-orange-500 italic">South India Expedition</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Every journey crafted by You & Me – Independent Voyage is tailor-made to your timeline, budget, and travel preferences. Complete our quick 3-step form to receive a complimentary custom itinerary.
            </p>

            {/* Strategic Social Proof Card */}
            <div className="bg-slate-900/80 border border-orange-500/30 rounded-2xl p-4 space-y-2 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-400" />
                ))}
                <span className="text-white font-bold text-sm ml-1">4.9 / 5.0</span>
              </div>
              <p className="text-xs text-slate-300">
                "An unforgettable 10-day private driver safari across Tamil Nadu temples and Kerala backwaters. Flawlessly executed."
              </p>
              <span className="text-[10px] text-orange-400 font-semibold block font-serif">
                — Verified TripAdvisor Review
              </span>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">100% Tailored & Private</h4>
                  <p className="text-xs text-slate-400">Exclusive AC vehicles & dedicated experienced local companion drivers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Guaranteed 24-Hour Response</h4>
                  <p className="text-xs text-slate-400">Direct consultation via WhatsApp or Email within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Local South India Specialists</h4>
                  <p className="text-xs text-slate-400">Based in Chennai with decades of local route expertise.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Enquiry Form Card */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto text-orange-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Enquiry Received, {submittedName}!
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for submitting your trip details. Our senior travel planner is reviewing your request and will send a personalized itinerary proposal to <strong>{formData.email}</strong> or WhatsApp within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      country: '',
                      category: 'Tamil Nadu Journeys',
                      destination: 'Chennai & Mahabalipuram',
                      month: 'October 2026',
                      duration: '7 - 10 Days',
                      travelers: '2',
                      budget: '$1,500 - $3,000 per person',
                      message: '',
                    });
                  }}
                  className="mt-6 px-6 py-2.5 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 3-Step Wizard Header & Progress Bar */}
                <div className="space-y-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-orange-400">Bespoke Journey Enquiry</h3>
                    <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
                      Step {step} of 3
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-orange-500 h-full transition-all duration-500"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>

                  {/* Step Labels */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className={step >= 1 ? 'text-orange-400 font-bold' : ''}>1. Trip Details</span>
                    <span className={step >= 2 ? 'text-orange-400 font-bold' : ''}>2. Travelers & Style</span>
                    <span className={step >= 3 ? 'text-orange-400 font-bold' : ''}>3. Contact Info</span>
                  </div>
                </div>

                {/* STEP 1: TRIP DETAILS */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" /> Step 1: Select Your Journey Preferences
                    </h4>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Journey Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors"
                      >
                        <option value="Tamil Nadu Journeys">Tamil Nadu Temple & Cultural Journeys</option>
                        <option value="Kerala Backwater & Hill Journeys">Kerala Backwater & Hill Station Journeys</option>
                        <option value="South India Signature Grand Tour">South India Signature Grand Tour</option>
                        <option value="Food & Culinary Journeys">Food & Culinary Journeys</option>
                        <option value="Private Custom Road Trip">Private Custom Road Trip</option>
                      </select>
                    </div>

                    {/* Target Destination */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Target Destination *
                      </label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors"
                      >
                        <option value="Chennai & Mahabalipuram">Chennai & Mahabalipuram Coastal Heritage</option>
                        <option value="Pondicherry & Thanjavur">Pondicherry French Quarter & Thanjavur Temples</option>
                        <option value="Madurai & Chettinad">Madurai Meenakshi Temple & Chettinad Heritage</option>
                        <option value="Munnar & Alleppey">Munnar Tea Gardens & Alleppey Houseboat</option>
                        <option value="Full South India Circuit">Full South India Circuit (14 Days)</option>
                      </select>
                    </div>

                    {/* Travel Month & Budget Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Target Travel Month
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. October 2026"
                          value={formData.month}
                          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Estimated Budget p.p.
                          </label>
                          <span className="text-[10px] text-orange-400 font-bold">⭐ 4.9/5 Rating</span>
                        </div>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors"
                        >
                          <option value="$1,000 - $2,000 per person">$1,000 – $2,000 per person</option>
                          <option value="$2,000 - $3,500 per person">$2,000 – $3,500 per person</option>
                          <option value="$3,500 - $5,000 per person">$3,500 – $5,000 per person</option>
                          <option value="$5,000+ per person">$5,000+ per person</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full mt-4 py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Continue to Step 2: Travelers <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2: TRAVELERS & EXPERIENCE */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" /> Step 2: Group Size & Trip Duration
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Number of Travelers *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          required
                          value={formData.travelers}
                          onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Ideal Duration *
                        </label>
                        <select
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors"
                        >
                          <option value="3 - 5 Days">3 - 5 Days (Short Highlights)</option>
                          <option value="7 - 10 Days">7 - 10 Days (Signature Expedition)</option>
                          <option value="12 - 14 Days">12 - 14 Days (Grand South India Tour)</option>
                          <option value="15+ Days">15+ Days (Comprehensive Journey)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Special Requests or Wishlist Experiences
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about specific interests (e.g., temple ceremonies, houseboat overnight, tea tasting, Chettinad cuisine, local markets)..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors placeholder:text-slate-600 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/3 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-2/3 py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Continue to Contact Info <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: CONTACT INFO & SUBMIT */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" /> Step 3: Where Should We Send Your Itinerary?
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Eleanor Vance"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. eleanor@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +1 (555) 234-5678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Country of Residence
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Germany, USA, UK"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-3 text-slate-100 text-sm focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Social Proof & Security Badge directly above Submit */}
                    <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-between text-[11px] text-orange-300">
                      <span className="flex items-center gap-1 font-semibold">
                        <Lock className="w-3.5 h-3.5 text-orange-400" /> 100% Complimentary & No Obligation
                      </span>
                      <span className="font-bold">⭐ 4.9/5 TripAdvisor Rated</span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/3 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Submitting Request...' : 'Submit Journey Enquiry'} <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
