'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
} from 'lucide-react';
import { useCurrency } from './CurrencyContext';

export const Footer = () => {
  const { settings } = useCurrency();
  const whatsappNum = settings?.whatsappNumber || '+91 98765 43210';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';
  const xUrl = settings?.xUrl || 'https://x.com';

  const extractDirectMapUrl = (embedUrl: string) => {
    if (!embedUrl) return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248756.1167541638!2d80.06892534579308!3d13.047525492160913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a7037740e53a!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';
    const iframeMatch = embedUrl.match(/src=["']([^"']+)["']/);
    return iframeMatch ? iframeMatch[1] : embedUrl;
  };

  const mapEmbedSrc = extractDirectMapUrl(
    settings?.googleMapEmbedUrl ||
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248756.1167541638!2d80.06892534579308!3d13.047525492160913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a7037740e53a!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
  );

  const showMap = settings?.showGoogleMapInFooter !== false;

  return (
    <>
      <footer id="contact" className="footer bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        {/* GOOGLE MAP LOCATION CARD */}
        {showMap && (
          <div className="max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-slate-100 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <MapPin className="w-4 h-4 text-orange-400" /> South India Office & Dispatch
                </div>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Chennai & Kochi Operations</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Details */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-white">
                    You & Me – Independent Voyage
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {settings?.address || 'Chennai, Tamil Nadu, India'}
                  </p>

                  <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{settings?.officePhone || whatsappNum}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{settings?.contactEmail || 'info@youandmevoyage.com'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Mon – Sat: 08:30 – 19:30 (IST) · 24/7 Driver Support</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Chennai, Tamil Nadu')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2.5 rounded-xl hover:brightness-110 shadow-md transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Open Google Maps Location →
                    </a>
                  </div>
                </div>

                {/* Google Map iFrame Embed */}
                <div className="lg:col-span-7 h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 relative shadow-inner">
                  <iframe
                    src={mapEmbedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.05) opacity(0.95)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="You and Me Voyage Google Map Location"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              {settings?.siteLogo ? (
                <img
                  src={settings.siteLogo}
                  alt={settings?.siteTitle || 'You & Me – Independent Voyage'}
                  className="h-10 w-auto object-contain max-w-[220px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`flex items-center gap-2.5 ${settings?.siteLogo ? 'hidden' : ''}`}>
                <span className="w-10 h-10 rounded-xl bg-orange-500 text-white font-serif font-black text-xl flex items-center justify-center shadow-md shrink-0">
                  YM
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
                    {settings?.siteTitle || 'You & Me'}
                  </span>
                  <span className="text-[9.5px] font-bold font-sans tracking-widest uppercase text-orange-400 mt-0.5">
                    Independent Voyage
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-xs text-orange-400/90 font-serif italic mt-3">Travel South India Your Way.</p>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              {settings?.address || 'Chennai, Tamil Nadu, India'}<br />
              {settings?.contactEmail || 'info@youandmevoyage.com'}<br />
              {whatsappNum}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-slate-300">
            <span className="font-bold text-[#FFFFFF] uppercase tracking-wider text-xs mb-1 text-orange-400">Explore & Stories</span>
            <Link href="/journeys" className="hover:text-orange-400 transition-colors">South India Journeys</Link>
            <Link href="/destinations" className="hover:text-orange-400 transition-colors">Destinations</Link>
            <Link href="/experiences" className="hover:text-orange-400 transition-colors">Experiences</Link>
            <Link href="/build-your-trip" className="hover:text-orange-400 transition-colors font-bold text-orange-400">Build Your Trip ✨</Link>
            <Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link>
            <Link href="/reviews" className="hover:text-orange-400 transition-colors">Guest Reviews ⭐</Link>
            <Link href="/travel-journal" className="hover:text-orange-400 transition-colors">Travel Journal</Link>
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-slate-300">
            <span className="font-bold text-[#FFFFFF] uppercase tracking-wider text-xs mb-1 text-orange-400">Popular Destinations</span>
            <Link href="/destinations/chennai" className="hover:text-orange-400 transition-colors">Chennai & Heritage</Link>
            <Link href="/destinations/mahabalipuram" className="hover:text-orange-400 transition-colors">Mahabalipuram Shore Temples</Link>
            <Link href="/destinations/pondicherry" className="hover:text-orange-400 transition-colors">Pondicherry French Quarter</Link>
            <Link href="/destinations/madurai" className="hover:text-orange-400 transition-colors">Madurai Meenakshi Temple</Link>
            <Link href="/destinations/munnar" className="hover:text-orange-400 transition-colors">Munnar Tea Gardens</Link>
            <Link href="/destinations/alleppey" className="hover:text-orange-400 transition-colors">Alleppey Houseboats</Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-bold text-[#FFFFFF] uppercase tracking-wider text-xs text-orange-400">Follow the Journey</span>
            <div className="flex items-center gap-2.5 mt-1">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-orange-400 hover:border-orange-500/50 flex items-center justify-center transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-none stroke-current group-hover:scale-110 transition-transform" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-orange-400 hover:border-orange-500/50 flex items-center justify-center transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independant_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripAdvisor"
                title="TripAdvisor Reviews"
                className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500 flex items-center justify-center transition-all shadow-sm group"
              >
                <span className="font-bold text-[10px] font-sans tracking-tighter">TA</span>
              </a>
            </div>

            <small className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Private Driver & Guided Journeys
            </small>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {settings?.siteTitle || 'You & Me – Independent Voyage'}. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

      {/* Floating Sticky WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Hi You & Me! I would like to inquire about a customized South India journey.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-all ring-4 ring-emerald-500/20"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </>
  );
};

