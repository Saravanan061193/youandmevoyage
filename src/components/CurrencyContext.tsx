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
  const [settings, setSettings] = useState<any>({
    usdToInr: 83.5,
    weatherText: 'Tamil Nadu & Kerala: 28°C Pleasant',
    whatsappNumber: '+91 98765 43210',
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  useEffect(() => {
    fetchSettings();
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
