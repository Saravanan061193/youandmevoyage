'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useCurrency } from './CurrencyContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export const Navbar = ({ onOpenQuoteModal }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useCurrency();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fdfbf7]/95 backdrop-blur-xl transition-all shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        {/* Brand Mark with Dynamic Logo */}
        <Link href="#top" className="brand-mark flex items-center gap-3">
          {settings?.siteLogo ? (
            <img
              src={settings.siteLogo}
              alt={settings?.siteTitle || "Discovery Safaris"}
              className="h-9 w-auto max-w-[180px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <>
              <span className="brand-symbol shrink-0">DS</span>
              <span className="text-stone-900 font-bold text-xl font-serif tracking-tight leading-none">
                {settings?.siteTitle || "Discovery Safaris"}
                <small className="block text-[9px] uppercase tracking-widest text-[#a5813f] font-sans font-bold mt-1">NAMIBIA</small>
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/#safaris" className="nav-link font-semibold">Safaris</Link>
          <Link href="/#destinations" className="nav-link font-semibold">Destinations</Link>
          <Link href="/#itinerary" className="nav-link font-semibold">Itineraries</Link>
          <Link href="/about" className="nav-link font-semibold">About Us</Link>
          <Link href="/#reviews" className="nav-link font-semibold">Reviews</Link>
          <Link href="/#contact" className="nav-link font-semibold">Contact</Link>

          <div className="border-l border-stone-200/80 pl-4">
            <LanguageSwitcher variant="compact" />
          </div>

          <button onClick={onOpenQuoteModal} className="gold-button font-bold text-xs px-4 py-2.5 rounded shadow-sm hover:brightness-105 transition-all">
            Get Custom Safari Quote <ArrowRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Toggle & Quick Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher variant="compact" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-full p-2 text-stone-700 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-[#fdfbf7] px-6 py-5 flex flex-col gap-4 text-stone-800 animate-in slide-in-from-top-2">
          <div className="py-2 border-b border-stone-200 flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Language:</span>
            <LanguageSwitcher variant="full" />
          </div>
          <Link href="/#safaris" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base">
            Safaris
          </Link>
          <Link href="/#destinations" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base">
            Destinations
          </Link>
          <Link href="/#itinerary" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base">
            Itineraries
          </Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base font-bold text-amber-900">
            Blog & Travel Guides
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base font-bold text-amber-900">
            About Us
          </Link>
          <Link href="/#reviews" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base">
            Reviews
          </Link>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="nav-link py-1 text-base">
            Contact
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuoteModal();
            }}
            className="gold-button w-full justify-center mt-2"
          >
            Get Custom Safari Quote <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

