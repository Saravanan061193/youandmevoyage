'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceUSD: number) => string;
  settings: any;
  reloadSettings: () => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (price: number) => `$${price.toLocaleString()}`,
  settings: null,
  reloadSettings: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [settings, setSettings] = useState<any>({
    usdToEur: 0.92,
    usdToGbp: 0.78,
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
    let symbol = '$';

    if (currency === 'EUR') {
      converted = priceUSD * (settings.usdToEur || 0.92);
      symbol = '€';
    } else if (currency === 'GBP') {
      converted = priceUSD * (settings.usdToGbp || 0.78);
      symbol = '£';
    } else if (currency === 'INR') {
      converted = priceUSD * (settings.usdToInr || settings.usdToNad || 83.5);
      symbol = '₹';
    }

    const rounded = Math.round(converted);
    return `${symbol}${rounded.toLocaleString('en-IN')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
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
