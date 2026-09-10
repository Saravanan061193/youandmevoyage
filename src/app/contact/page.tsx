'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CurrencyProvider, useCurrency } from '@/components/CurrencyContext';
import { QuoteModal } from '@/components/QuoteModal';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

function ContactContent() {
  const { settings } = useCurrency();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Tamil Nadu & Kerala',
    message: '',
  });

  const whatsappNum = settings?.whatsappNumber || '+91 63814 20556';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-orange-500">Get In Touch</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Contact You & Me – Independent Voyage
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Have questions about planning a customized private tour across Tamil Nadu, Kerala, or South India? We are here to help.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info & Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-slate-900">Direct Contact</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Address</strong>
                  <span>{settings?.officeAddress || settings?.address || 'Indira Nagar, Adyar, Chennai, Tamil Nadu, India - 600020'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Phone / Call</strong>
                  <span>{settings?.officePhone || whatsappNum}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">WhatsApp Chat</strong>
                  <a
                    href={`https://wa.me/${whatsappClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-bold hover:underline"
                  >
                    {whatsappNum} (Instant Response)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Email</strong>
                  <span>{settings?.contactEmail || 'youandmevoyage@gmail.com'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Office Hours</strong>
                  <span>Mon – Sat: 08:30 – 19:30 (IST) · 24/7 Companion Support</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Hi You & Me! I would like to inquire about customized private journeys.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Start WhatsApp Conversation
              </a>
              <a
                href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-orange-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-orange-500/30 transition-all shadow-sm"
              >
                <span>Read TripAdvisor Reviews ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-slate-900">Message Sent Successfully</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-md mx-auto">
                  Thank you for reaching out to You & Me – Independent Voyage. We will contact you shortly via email/WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#0F172A] text-white font-bold text-xs rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 555 123 4567"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Destination of Interest</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="e.g. Tamil Nadu, Kerala, Chettinad, Munnar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Message / Inquiry *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your travel plans, number of guests, travel dates..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </main>
  );
}


export default function ContactPage() {
  return (
    <CurrencyProvider>
      <ContactContent />
    </CurrencyProvider>
  );
}
