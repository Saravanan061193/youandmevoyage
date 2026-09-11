'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ShieldCheck,
  MapPin,
  Phone,
  PhoneCall,
  Mail,
  Clock,
  Navigation,
} from 'lucide-react';
import { useCurrency } from './CurrencyContext';

export const Footer = () => {
  const { settings } = useCurrency();
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    const loadDestinations = async () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_destinations_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDestinations(parsed);
            }
          } catch (e) {}
        }
      }

      try {
        const res = await fetch('/api/destinations');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDestinations(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem('site_destinations_cache', JSON.stringify(data));
            }
          }
        }
      } catch (e) {
        console.error('Failed to load destinations for footer:', e);
      }
    };

    loadDestinations();

    const handleSync = () => loadDestinations();
    if (typeof window !== 'undefined') {
      window.addEventListener('destinations_updated', handleSync);
      window.addEventListener('storage', handleSync);
      return () => {
        window.removeEventListener('destinations_updated', handleSync);
        window.removeEventListener('storage', handleSync);
      };
    }
  }, []);

  const whatsappNum = settings?.whatsappNumber || '+91 9994315778';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/youandmevoyage/';
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/p/Youme-independent-voyage-100064363920653/';
  const tripadvisorUrl = settings?.tripadvisorUrl || settings?.tripAdvisorUrl || 'https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html';

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
                    {settings?.officeAddress || settings?.address || 'Indira Nagar, Adyar, Chennai, Tamil Nadu, India - 600020'}
                  </p>

                  <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{settings?.officePhone || whatsappNum}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{settings?.contactEmail || 'youandmevoyage@gmail.com'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Mon – Sat: 08:30 – 19:30 (IST) · 24/7 Driver Support</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings?.officeAddress || settings?.address || 'Indira Nagar, Adyar, Chennai, India 600020')}`}
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
                <span className="font-serif text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
                  {settings?.siteTitle || 'You & Me – Independent Voyage'}
                </span>
              </div>
            </Link>
            <p className="text-xs text-orange-400/90 font-serif italic mt-3">Travel South India Your Way.</p>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              {settings?.officeAddress || settings?.address || 'Indira Nagar, Adyar, Chennai, Tamil Nadu, India - 600020'}<br />
              {settings?.contactEmail || 'youandmevoyage@gmail.com'}<br />
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
            <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog / Travel Journal</Link>
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-slate-300">
            <span className="font-bold text-[#FFFFFF] uppercase tracking-wider text-xs mb-1 text-orange-400">Popular Destinations</span>
            {destinations && destinations.length > 0 ? (
              destinations.map((dest) => {
                const destSlug = dest.slug || dest.id || dest.title.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={dest.id || destSlug}
                    href={`/destinations/${destSlug}`}
                    className="hover:text-orange-400 transition-colors block py-0.5 font-medium"
                  >
                    {dest.title}
                  </Link>
                );
              })
            ) : (
              <span className="text-xs text-slate-500 italic">No destinations added</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-bold text-[#FFFFFF] uppercase tracking-wider text-xs text-orange-400">Follow the Journey</span>
            <div className="flex items-center gap-3 mt-1.5">
              {/* Instagram Official Logo */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Follow Us on Instagram"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center transition-all shadow-md hover:scale-110 active:scale-95 group"
              >
                <svg className="w-5 h-5 fill-none stroke-current group-hover:rotate-6 transition-transform" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook Official Logo */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Follow Us on Facebook"
                className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-md hover:scale-110 active:scale-95 group"
              >
                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TripAdvisor Official Owl Logo */}
              <a
                href={tripadvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripAdvisor"
                title="Read TripAdvisor Reviews"
                className="w-10 h-10 rounded-xl bg-[#00AA6C] hover:bg-[#008f5a] text-white flex items-center justify-center transition-all shadow-md hover:scale-110 active:scale-95 group"
              >
                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M19.324 7.648a4.965 4.965 0 0 0-4.307-2.474c-.958 0-1.849.278-2.61.761a4.978 4.978 0 0 0-2.612-.761 4.966 4.966 0 0 0-4.307 2.474C2.511 8.878 2 10.384 2 12c0 3.033 1.95 5.617 4.717 6.554L4 21.333h3.5l1.833-2.133c.833.3 1.733.467 2.667.467s1.833-.167 2.667-.467L16.5 21.333H20l-2.717-2.779C20.05 17.617 22 15.033 22 12c0-1.616-.511-3.122-3.476-4.352zm-12.824 7.352a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm11 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM6.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
              </a>
            </div>

            <small className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Private Driver & Guided Journeys
            </small>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span className="flex items-center flex-wrap gap-1">
            © {new Date().getFullYear()} {settings?.siteTitle || 'You & Me – Independent Voyage'}. All Rights Reserved.
            <span className="inline-flex items-center gap-1 ml-1 text-slate-400">
              ❤️ Developed by{' '}
              <a
                href="https://joydigital.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-bold hover:underline transition-colors"
              >
                Joydigital
              </a>
            </span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

      {/* Floating Sticky Circular Action Buttons: Direct Call on TOP, WhatsApp on BOTTOM */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* Call Round Button */}
        <a
          href={`tel:${whatsappNum.replace(/[^0-9+]/g, '')}`}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(249,115,22,0.6)] hover:scale-110 active:scale-95 transition-all ring-4 ring-orange-500/20 group relative"
          aria-label="Call Us Directly"
          title={`Call Us ${whatsappNum}`}
        >
          <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-700 pointer-events-none hidden sm:block">
            Call Us: {whatsappNum}
          </span>
        </a>

        {/* WhatsApp Official Round Button */}
        <a
          href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Hi You & Me! I would like to inquire about a customized South India journey.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all ring-4 ring-[#25D366]/20 group relative"
          aria-label="Chat on WhatsApp"
          title="WhatsApp Us"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-700 pointer-events-none hidden sm:block">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </>
  );
};

