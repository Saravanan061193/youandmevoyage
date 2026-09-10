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
      weatherText: 'Tamil Nadu & Kerala: 28°C Pleasant',
      whatsappNumber: '+91 9994315778',
    };
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        let cachedLogo = '';
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem('site_settings_cache');
            if (cached) {
              const parsed = JSON.parse(cached);
              cachedLogo = parsed?.siteLogo || '';
            }
          } catch (e) {}
        }
        const merged = { ...data };
        if (!merged.siteLogo && cachedLogo) {
          merged.siteLogo = cachedLogo;
        }
        setSettings(merged);
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_settings_cache', JSON.stringify(merged));
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
          if (cached) setSettings(JSON.parse(cached));
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
    if (settings?.siteFavicon && typeof window !== 'undefined') {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.siteFavicon;
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
