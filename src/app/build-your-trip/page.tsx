'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import {
  Calendar,
  Users,
  Heart,
  MapPin,
  Sparkles,
  Clock,
  Home,
  Car,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
} from 'lucide-react';

function BuildYourTripContent() {
  const { settings } = useCurrency();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  const handleDateSelection = (start: string, end: string) => {
    setStartDateInput(start);
    setEndDateInput(end);
    if (start && end) {
      const sDate = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const eDate = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setFormData((prev) => ({ ...prev, travelDates: `${sDate} – ${eDate}` }));
    } else if (start) {
      const sDate = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setFormData((prev) => ({ ...prev, travelDates: `From ${sDate}` }));
    }
  };

  const [formData, setFormData] = useState({
    travelDates: '',
    travelers: 2,
    travelStyle: 'Couple',
    destinations: [] as string[],
    interests: [] as string[],
    duration: '7–10 Days',
    accommodationReq: 'Boutique Heritage Hotels',
    vehicleReq: 'Innova Crysta / SUV AC',
    specialRequirements: '',
    name: '',
    email: '',
    phone: '',
  });

  const whatsappNum = (settings?.whatsappNumber || '').replace(/[^0-9+]/g, '');

  const availableDestinations = [
    'Chennai',
    'Mahabalipuram',
    'Pondicherry',
    'Thanjavur',
    'Trichy',
    'Madurai',
    'Chettinad',
    'Kanyakumari',
    'Munnar',
    'Kerala Backwaters',
    'Thekkady',
    'Alleppey',
    'Fort Kochi',
    'Bangalore',
    'Mysore',
    'Coorg',
    'Goa',
  ];

  const availableInterests = [
    'Culture',
    'Temples',
    'Food',
    'Nature',
    'Beaches',
    'Heritage',
    'Photography',
    'Wellness',
    'Local Experiences',
    'Adventure',
  ];

  const travelStyles = [
    'Couple',
    'Family',
    'Friends',
    'Solo',
    'Senior Travellers',
    'Other',
  ];

  const accommodationOptions = [
    'Boutique Heritage Hotels',
    '4-Star Premium Comfort',
    '5-Star Luxury Resorts',
    'Tea Estate Bungalows & Eco Lodges',
    'Private Luxury Houseboat (Alleppey)',
  ];

  const vehicleOptions = [
    'Sedan AC (Toyota Etios / Dzire)',
    'Innova Crysta / SUV AC (4-5 Guests)',
    'Tempo Traveller AC (Group 6-10 Guests)',
    'Luxury Executive SUV',
  ];

  const toggleDestination = (dest: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter((d) => d !== dest)
        : [...prev.destinations, dest],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: 'Custom Trip Planner',
        destination: formData.destinations.join(', ') || 'South India',
        month: formData.travelDates,
        duration: formData.duration,
        travelers: Number(formData.travelers),
        message: `Style: ${formData.travelStyle}. Accommodation: ${formData.accommodationReq}. Vehicle: ${formData.vehicleReq}. Special: ${formData.specialRequirements}`,
        travelDates: formData.travelDates,
        travelStyle: formData.travelStyle,
        destinationsList: JSON.stringify(formData.destinations),
        interests: JSON.stringify(formData.interests),
        accommodationReq: formData.accommodationReq,
        vehicleReq: formData.vehicleReq,
        specialRequirements: formData.specialRequirements,
      };

      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      setIsSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    const text = `Hi You & Me! I just submitted a custom journey plan on your website:
- Name: ${formData.name}
- Dates: ${formData.travelDates || 'Flexible'}
- Travellers: ${formData.travelers} (${formData.travelStyle})
- Destinations: ${formData.destinations.join(', ') || 'Tamil Nadu & Kerala'}
- Interests: ${formData.interests.join(', ')}
- Duration: ${formData.duration}
- Vehicle: ${formData.vehicleReq}
I would love to receive a customized itinerary proposal!`;
    return encodeURIComponent(text);
  };  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">Bespoke Planning</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 mt-2">
            Tell Us How You Want to Travel
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-3 font-sans">
            Design your private customized South India journey step by step. Our travel specialists will craft a tailored itinerary just for you.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Progress Indicator */}
          {!isSubmitted && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Step {step} of 10</span>
                <span>{Math.round((step / 10) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          {isSubmitted ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-slate-900">
                Your Journey Request Received!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our South India travel specialist is reviewing your preferences and will get back to you within 24 hours.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${whatsappNum}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5" /> Continue on WhatsApp Instantly
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                  }}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all"
                >
                  Create Another Trip Plan
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1: Travel Dates */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">When do you plan to travel?</h3>
                      <p className="text-xs text-slate-500">Pick exact calendar dates or choose an approximate month</p>
                    </div>
                  </div>

                  {/* Option 1: Calendar Date Picker */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Option A: Select Exact Dates (Calendar)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-slate-500 mb-1 font-medium">Arrival Date</span>
                        <input
                          type="date"
                          value={startDateInput}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleDateSelection(e.target.value, endDateInput)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:border-orange-500 outline-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="block text-xs text-slate-500 mb-1 font-medium">Departure Date</span>
                        <input
                          type="date"
                          value={endDateInput}
                          min={startDateInput || new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleDateSelection(startDateInput, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:border-orange-500 outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Quick Month Selection Chips */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Option B: Or Select Preferred Month / Season
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'October 2026',
                        'November 2026',
                        'December 2026',
                        'January 2027',
                        'February 2027',
                        'March 2027',
                        'Flexible / Not Decided Yet',
                      ].map((month) => {
                        const isSelected = formData.travelDates === month;
                        return (
                          <button
                            key={month}
                            type="button"
                            onClick={() => {
                              setStartDateInput('');
                              setEndDateInput('');
                              setFormData({ ...formData, travelDates: month });
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                              isSelected
                                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {month}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option 3: Selected Dates Summary / Custom Input */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Your Selected Travel Window *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.travelDates}
                      onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                      placeholder="e.g. Nov 15 – Nov 25, 2026 or October 2026"
                      className="w-full bg-white border border-orange-300 rounded-xl p-4 text-sm font-semibold text-slate-900 focus:border-orange-500 outline-none shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Number of Travellers */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">How many travellers?</h3>
                      <p className="text-xs text-slate-500">Include adults and children</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })}
                      className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xl"
                    >
                      -
                    </button>
                    <span className="font-serif font-bold text-2xl px-4">{formData.travelers} Guests</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, travelers: formData.travelers + 1 })}
                      className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Travel Style */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">What is your travel style?</h3>
                      <p className="text-xs text-slate-500">Select the option that best describes your group</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelStyle: style })}
                        className={`p-4 rounded-xl border text-sm font-bold text-center transition-all ${
                          formData.travelStyle === style
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Destinations */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Which destinations interest you?</h3>
                      <p className="text-xs text-slate-500">Select multiple destinations across Tamil Nadu & Kerala</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableDestinations.map((dest) => {
                      const isSelected = formData.destinations.includes(dest);
                      return (
                        <button
                          key={dest}
                          type="button"
                          onClick={() => toggleDestination(dest)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {dest} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Interests */}
              {step === 5 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">What are your primary travel interests?</h3>
                      <p className="text-xs text-slate-500">Select all experiences you would love on this trip</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableInterests.map((interest) => {
                      const isSelected = formData.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {interest} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: Duration */}
              {step === 6 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Expected trip duration?</h3>
                      <p className="text-xs text-slate-500">Select total number of days</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['3–5 Days', '7–10 Days', '12–14 Days', '15+ Days'].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: dur })}
                        className={`p-4 rounded-xl border text-sm font-bold text-center transition-all ${
                          formData.duration === dur
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Accommodation Requirement */}
              {step === 7 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Accommodation preference?</h3>
                      <p className="text-xs text-slate-500">Handpicked stays across South India</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {accommodationOptions.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.accommodationReq === opt
                            ? 'bg-orange-50 border-orange-500 text-slate-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="acc"
                          checked={formData.accommodationReq === opt}
                          onChange={() => setFormData({ ...formData, accommodationReq: opt })}
                          className="accent-orange-500"
                        />
                        <span className="text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Vehicle Requirement */}
              {step === 8 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Vehicle & Companion preference?</h3>
                      <p className="text-xs text-slate-500">100% dedicated AC vehicle with experienced local driver companion</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {vehicleOptions.map((v) => (
                      <label
                        key={v}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.vehicleReq === v
                            ? 'bg-orange-50 border-orange-500 text-slate-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="veh"
                          checked={formData.vehicleReq === v}
                          onChange={() => setFormData({ ...formData, vehicleReq: v })}
                          className="accent-orange-500"
                        />
                        <span className="text-sm font-medium">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Special Requirements */}
              {step === 9 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Special requests or preferences?</h3>
                      <p className="text-xs text-slate-500">Dietary requirements, mobility needs, specific guides, pace of travel, etc.</p>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="Tell us any specific preferences, landmark wishes, or questions..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm focus:border-orange-500 focus:bg-white outline-none font-sans"
                  />
                </div>
              )}

              {/* STEP 10: Contact Information */}
              {step === 10 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Send className="w-6 h-6 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Where should we send your itinerary?</h3>
                      <p className="text-xs text-slate-500">Provide your contact details for your custom quotation</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 555 123 4567"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {step < 10 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:brightness-110 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Plan My Journey'} <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}


export default function BuildYourTripPage() {
  return (
    <CurrencyProvider>
      <BuildYourTripContent />
    </CurrencyProvider>
  );
}
