'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Compass, Sparkles } from 'lucide-react';

export const GlobalLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show top progress bar on route change
    setLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(70), 150);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100000]">
      {/* Top Animated Gold-Orange Loading Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(249,115,22,0.8)]"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
        }}
      />

      {/* Floating Corner Spinner Indicator */}
      {loading && (
        <div className="fixed bottom-6 left-6 z-[100000] bg-slate-900/90 border border-orange-500/40 backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2.5 text-xs text-slate-200 animate-in fade-in zoom-in duration-200 ring-1 ring-orange-500/20">
          <div className="relative flex items-center justify-center w-5 h-5">
            <Compass className="w-4 h-4 text-orange-400 animate-spin" />
          </div>
          <span className="font-serif font-semibold text-[11px] text-white tracking-wide flex items-center gap-1">
            Loading <Sparkles className="w-3 h-3 text-orange-400 inline" />
          </span>
        </div>
      )}
    </div>
  );
};
