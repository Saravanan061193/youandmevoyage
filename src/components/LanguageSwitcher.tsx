'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const LanguageSwitcher: React.FC<{ variant?: 'compact' | 'full' | 'dropdown' }> = ({
  variant = 'compact',
}) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect existing cookie language
    const getCookieLang = () => {
      const match = document.cookie.match(/(?:^|;) *googtrans=([^;]+)/);
      if (match && match[1]) {
        const parts = match[1].split('/');
        return parts[parts.length - 1] || 'en';
      }
      return localStorage.getItem('site_language') || 'en';
    };

    const initialLang = getCookieLang();
    setCurrentLang(initialLang);

    // Initialize Google Translate Script dynamically
    if (typeof window !== 'undefined') {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,de,fr,es,it,nl,af,zh-CN',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      } else if ((window as any).google?.translate?.TranslateElement) {
        try {
          (window as any).googleTranslateElementInit();
        } catch (e) {
          console.error('Google translate init error:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setTranslateCookie = (langCode: string) => {
    const hostname = window.location.hostname;
    const cookieVal = `/en/${langCode}`;

    // Clear old cookies
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;

    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local');
    if (!isLocal && hostname.includes('.')) {
      const rootDomain = '.' + hostname.split('.').slice(-2).join('.');
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${rootDomain};`;
    }
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    localStorage.setItem('site_language', langCode);
  };

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    setTranslateCookie(langCode);

    // Trigger Google Translate combo element
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  const activeLanguage = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  if (variant === 'compact') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div id="google_translate_element" className="hidden" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-800 transition-colors py-1.5 px-2.5 rounded-lg bg-stone-100/90 border border-stone-200/90 hover:bg-stone-200/80 shadow-xs"
          title="Translate Website / Sprache wählen"
        >
          <span className="text-sm leading-none">{activeLanguage.flag}</span>
          <span className="uppercase tracking-wider font-extrabold text-stone-900">{activeLanguage.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-stone-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-stone-200 shadow-xl z-50 py-1.5 text-stone-800 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 flex items-center justify-between">
              <span>Select Language</span>
              <span>Sprache</span>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors hover:bg-amber-50/80 ${
                      isSelected ? 'bg-amber-50/60 text-amber-900 font-semibold' : 'text-stone-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>
                        <span className="block font-medium">{lang.nativeName}</span>
                        {lang.name !== lang.nativeName && (
                          <span className="block text-[10px] text-stone-400 font-normal">{lang.name}</span>
                        )}
                      </span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div id="google_translate_element" className="hidden" />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-stone-200/80 rounded-lg hover:border-amber-700/50 hover:bg-amber-50/40 transition-all text-stone-800 shadow-sm"
      >
        <Globe className="w-4 h-4 text-amber-800" />
        <span className="text-base leading-none">{activeLanguage.flag}</span>
        <span>{activeLanguage.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 lg:right-0 lg:left-auto mt-2 w-52 rounded-xl bg-white border border-stone-200 shadow-xl z-50 py-1.5 text-stone-800">
          <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 flex items-center justify-between">
            <span>Website Language</span>
            <Globe className="w-3 h-3 text-amber-700" />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors hover:bg-amber-50/80 ${
                    isSelected ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>
                      <span className="block font-medium">{lang.nativeName}</span>
                      {lang.name !== lang.nativeName && (
                        <span className="block text-[10px] text-stone-400 font-normal">{lang.name}</span>
                      )}
                    </span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
