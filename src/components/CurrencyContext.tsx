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

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  setCurrency: () => {},
  formatPrice: (price: number) => `₹${price.toLocaleString('en-IN')}`,
  settings: null,
  reloadSettings: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency] = useState<Currency>('INR');
  const [settings, setSettings] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('site_settings_cache');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      usdToInr: 83.5,
      weatherText: '',
      whatsappNumber: '',
    };
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const cleanData = Object.fromEntries(
          Object.entries(data || {}).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        );
        setSettings((prev: any) => ({ ...prev, ...cleanData }));
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
              Object.entries(parsed || {}).filter(([_, v]) => v !== null && v !== undefined && v !== '')
            );
            setSettings((prev: any) => ({ ...prev, ...cleanParsed }));
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
