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
  const whatsappNum = settings?.whatsappNumber || '+264 81 123 4567';
  const whatsappClean = whatsappNum.replace(/[^0-9]/g, '');

  const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';
  const xUrl = settings?.xUrl || 'https://x.com';

  const extractDirectMapUrl = (embedUrl: string) => {
    if (!embedUrl) return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117924.96016766436!2d17.026402!3d-22.56088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c0b1b5e3a3f5a05%3A0x6a0c0b1b5e3a3f5a!2sWindhoek%2C%20Namibia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s';
    const iframeMatch = embedUrl.match(/src=["']([^"']+)["']/);
    return iframeMatch ? iframeMatch[1] : embedUrl;
  };

  const mapEmbedSrc = extractDirectMapUrl(
    settings?.googleMapEmbedUrl ||
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117924.96016766436!2d17.026402!3d-22.56088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c0b1b5e3a3f5a05%3A0x6a0c0b1b5e3a3f5a!2sWindhoek%2C%20Namibia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
  );

  const showMap = settings?.showGoogleMapInFooter !== false;

  return (
    <>
      <footer id="contact" className="footer">
        {/* GOOGLE MAP LOCATION CARD */}
        {showMap && (
          <div className="max-w-7xl mx-auto mb-12 px-2">
            <div className="bg-[#181614] border border-stone-800 rounded-3xl p-6 md:p-8 text-stone-100 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c5a059]">
                  <MapPin className="w-4 h-4 text-[#c5a059]" /> Head Office & Base Camp Location
                </div>
                <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">Windhoek, Namibia</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Details */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-stone-100">
                    Discovery Safaris HQ
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {settings?.officeAddress || '77 Independence Avenue, Central Business District, Windhoek, Namibia'}
                  </p>

                  <div className="space-y-2.5 text-xs text-stone-300 pt-3 border-t border-stone-800">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span>{settings?.officePhone || whatsappNum}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span>{settings?.contactEmail || 'info@discoverysafaris.com'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span>{settings?.operationHours || 'Mon – Sat: 08:00 – 18:00 (CAT) · 24/7 Dispatch'}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings?.officeAddress || 'Windhoek, Namibia')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-stone-950 bg-gold-gradient px-4 py-2.5 rounded-xl hover:brightness-110 shadow-md transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Get Directions on Google Maps →
                    </a>
                  </div>
                </div>

                {/* Google Map iFrame Embed */}
                <div className="lg:col-span-7 h-64 sm:h-72 rounded-2xl overflow-hidden border border-stone-800 relative shadow-inner">
                  <iframe
                    src={mapEmbedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.05) opacity(0.95)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Discovery Safaris Google Map Location"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="footer-main">
          <div>
            <Link href="#top" className="flex items-center gap-3 group">
              {settings?.siteLogo ? (
                <img
                  src={settings.siteLogo}
                  alt={settings?.siteTitle || 'Discovery Safaris'}
                  className="h-10 w-auto object-contain max-w-[220px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`flex items-center gap-3 ${settings?.siteLogo ? 'hidden' : ''}`}>
                <span className="w-9 h-9 rounded bg-[#c5a059]/20 border border-[#c5a059] text-[#c5a059] font-bold text-xs flex items-center justify-center font-sans tracking-widest shrink-0 shadow-md">
                  DS
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold text-stone-100 group-hover:text-[#c5a059] transition-colors leading-tight drop-shadow-sm">
                    {settings?.siteTitle || 'Discovery Safaris'}
                  </span>
                  <span className="text-[10px] font-bold font-sans tracking-[0.24em] uppercase text-[#c5a059] mt-0.5">
                    Namibia
                  </span>
                </div>
              </div>
            </Link>
            <p className="footer-lead">The wild, considered.</p>
            <p className="footer-address">
              {settings?.officeAddress || 'Windhoek · Namibia'}<br />
              {settings?.contactEmail || 'hello@discoverysafaris.na'}<br />
              {whatsappNum}
            </p>
          </div>

          <div className="footer-col">
            <span>Explore</span>
            <Link href="/#safaris" className="hover:text-amber-400 transition-colors">Safari Journeys</Link>
            <Link href="/#destinations" className="hover:text-amber-400 transition-colors">Destinations</Link>
            <Link href="/about" className="hover:text-amber-400 transition-colors font-semibold">About Us</Link>
            <Link href="/blog" className="hover:text-amber-400 transition-colors font-semibold">Namibia Safari Blog</Link>
          </div>

          <div className="footer-col">
            <span>Follow the journey</span>
            <div className="flex items-center gap-2.5 mt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-sm group"
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
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="YouTube"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.8a6.34 6.34 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9a8.16 8.16 0 0 0 4.89 1.62V7.17a4.85 4.85 0 0 1-1-.48z"/>
                </svg>
              </a>

              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-sm group"
              >
                <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <small className="schema-note mt-3">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> Travel Agency · Dynamic CMS Links
            </small>
          </div>
        </div>

        {/* Bottom Bar - Flex Between Layout */}
        <div className="max-w-7xl mx-auto border-t border-stone-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <span>© {new Date().getFullYear()} {settings?.siteTitle || 'Discovery Safaris Namibia'}. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <span className="text-stone-700">•</span>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

      {/* Floating Sticky WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappClean}?text=Hello%20Discovery%20Safaris%20Namibia%2C%20I%20would%20love%20to%20plan%20a%20private%20safari.`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Plan your safari</span>
      </a>
    </>
  );
};
