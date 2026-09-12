'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceUSD: number) => string;
  settings: any;
  reloadSettings: () => void;
}

const DEFAULT_SETTINGS: Record<string, any> = {
  usdToInr: 83.5,
  weatherText: '',
  whatsappNumber: '+91 9994315778',
  officePhone: '+91 9994315778 / +91 63814 20556',
  secondaryPhone: '+91 63814 20556',
  officeAddress: 'Indira Nagar, Adyar, Chennai, Tamil Nadu, India - 600020',
  operationHours: '24/7 Support & Dispatch',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.498305719363!2d80.25268487507693!3d13.003923387313888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267e7c992769d%3A0xbbfd1d36d4f9c158!2sIndira%20Nagar%2C%20Adyar%2C%20Chennai%2C%20Tamil%20Nadu%20600020!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  showGoogleMapInFooter: true,
  siteTitle: 'You & Me – Independent Voyage',
  contactEmail: 'youandmevoyage@gmail.com',
  instagramUrl: 'https://www.instagram.com/youandmevoyage/',
  facebookUrl: 'https://www.facebook.com/p/Youme-independent-voyage-100064363920653/',
  tripadvisorUrl: 'https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html',
};

const keepValue = (v: any) => {
  if (v === null || v === undefined) return false;
  if (typeof v !== 'boolean' && v === '') return false;
  return true;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  setCurrency: () => {},
  formatPrice: (price: number) => `₹${price.toLocaleString('en-IN')}`,
  settings: DEFAULT_SETTINGS,
  reloadSettings: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency] = useState<Currency>('INR');
  const [settings, setSettings] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('site_settings_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const cleanData = Object.fromEntries(
          Object.entries(data || {}).filter(([_, v]) => keepValue(v))
        );
        setSettings((prev: any) => ({ ...DEFAULT_SETTINGS, ...prev, ...cleanData }));
        if (typeof window !== 'undefined') {
          const existing = JSON.parse(localStorage.getItem('site_settings_cache') || '{}');
          localStorage.setItem('site_settings_cache', JSON.stringify({ ...existing, ...cleanData }));
        }
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleSync = () => {
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('site_settings_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            const cleanParsed = Object.fromEntries(
              Object.entries(parsed || {}).filter(([_, v]) => keepValue(v))
            );
            setSettings((prev: any) => ({ ...DEFAULT_SETTINGS, ...prev, ...cleanParsed }));
          }
        } catch (e) {}
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('site_settings_updated', handleSync);
      window.addEventListener('storage', handleSync);
      return () => {
        window.removeEventListener('site_settings_updated', handleSync);
        window.removeEventListener('storage', handleSync);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && settings?.siteFavicon) {
      let iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (iconLinks.length === 0) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = settings.siteFavicon;
        document.head.appendChild(link);
      } else {
        iconLinks.forEach((link) => {
          link.href = settings.siteFavicon;
        });
      }
    }
  }, [settings?.siteFavicon]);

  const formatPrice = (priceUSD: number): string => {
    let converted = priceUSD;
    if (priceUSD < 20000) {
      converted = priceUSD * (settings?.usdToInr || 83.5);
    }
    const rounded = Math.round(converted);
    return `₹${rounded.toLocaleString('en-IN')}`;
  };


  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: () => {},

        formatPrice,
        settings,
        reloadSettings: fetchSettings,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
