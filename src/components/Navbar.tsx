'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, MessageSquare, ChevronDown, Compass } from 'lucide-react';
import { useCurrency } from './CurrencyContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export const Navbar = ({ onOpenQuoteModal }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { settings } = useCurrency();
  const whatsappNumber = (settings?.whatsappNumber || '').replace(/[^0-9+]/g, '');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur-2xl transition-all shadow-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8 sm:py-3.5 gap-2">
        {/* Brand Mark with Dynamic Logo (Links to /) */}
        <Link href="/" className="brand-mark flex items-center group shrink-0">
          {settings?.siteLogo && !logoError ? (
            <img
              src={settings.siteLogo}
              alt={settings?.siteTitle || "Brand Logo"}
              onError={() => setLogoError(true)}
              className="h-9 xs:h-11 sm:h-14 lg:h-16 w-auto max-w-[160px] xs:max-w-[200px] sm:max-w-[280px] lg:max-w-[340px] object-contain drop-shadow-md bg-white p-1.5 rounded-lg"
            />
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shrink-0 border border-orange-400/40 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          )}
        </Link>

        {/* Desktop Nav: [Logo] | Home | About Us | Explore ▾ | Contact | [Build Your Trip ✨] | GB EN | WhatsApp */}
        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
          <Link
            href="/"
            className="nav-link text-xs uppercase tracking-widest font-bold text-slate-200 hover:text-orange-400 transition-colors"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="nav-link text-xs uppercase tracking-widest font-bold text-slate-200 hover:text-orange-400 transition-colors"
          >
            About Us
          </Link>


          {/* Explore Dropdown */}
          <div
            className="relative group py-2"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setExploreOpen(!exploreOpen)}
              className="nav-link text-xs uppercase tracking-widest font-bold text-slate-200 hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${exploreOpen ? 'rotate-180 text-orange-400' : ''}`} />
            </button>

            {/* Dropdown Card */}
            {exploreOpen && (
              <div className="absolute top-full left-0 w-48 bg-[#0F172A] backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-2 font-sans animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <Link
                  href="/destinations"
                  onClick={() => setExploreOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition-colors"
                >
                  Destinations
                </Link>
                <Link
                  href="/journeys"
                  onClick={() => setExploreOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition-colors"
                >
                  Journeys
                </Link>
                <Link
                  href="/experiences"
                  onClick={() => setExploreOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition-colors"
                >
                  Experiences
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setExploreOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition-colors"
                >
                  Blog / Travel Journal
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className="nav-link text-xs uppercase tracking-widest font-bold text-slate-200 hover:text-orange-400 transition-colors"
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className="nav-link text-xs uppercase tracking-widest font-bold text-slate-200 hover:text-orange-400 transition-colors"
          >
            Contact
          </Link>

          {/* Highlighted CTA */}
          <Link
            href="/build-your-trip"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md hover:shadow-orange-500/25 transition-all transform hover:scale-105 shrink-0"
          >
            Build Your Trip ✨
          </Link>

          <div className="border-l border-slate-700/80 pl-2">
            <LanguageSwitcher variant="compact" />
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I would like to inquire about customized South India private journeys.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </nav>

        {/* Mobile Toggle & Quick Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I would like to inquire about customized South India private journeys.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            title="WhatsApp Us"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <LanguageSwitcher variant="compact" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate-200 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0F172A] px-6 py-5 flex flex-col gap-3.5 text-slate-200 animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
          <div className="py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1.5 font-mono">
              LANGUAGE:
            </span>
            <LanguageSwitcher variant="full" />
          </div>

          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base font-semibold hover:text-orange-400">
            Home
          </Link>

          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base font-semibold hover:text-orange-400">
            About Us
          </Link>


          <div className="py-2 border-y border-slate-800 space-y-2">
            <span className="text-xs uppercase font-bold text-orange-400 tracking-wider block">Explore:</span>
            <Link href="/destinations" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm font-medium hover:text-orange-400">
              Destinations
            </Link>
            <Link href="/journeys" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm font-medium hover:text-orange-400">
              Journeys
            </Link>
            <Link href="/experiences" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm font-medium hover:text-orange-400">
              Experiences
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block pl-3 py-1 text-sm font-medium hover:text-orange-400">
              Blog / Travel Journal
            </Link>
          </div>

          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base font-semibold hover:text-orange-400">
            Blog
          </Link>

          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base font-semibold hover:text-orange-400">
            Contact
          </Link>
          
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/build-your-trip"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              Build Your Trip ✨
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I would like to inquire about customized South India private journeys.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};


