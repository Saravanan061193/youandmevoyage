'use client';

import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

// Official SVG Brand Logos
const InstagramLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.8a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 12a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.59a8.28 8.28 0 0 0 3.92 1.55V6.69z" />
  </svg>
);

const YouTubeLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const SocialMediaFeed = () => {
  const { settings } = useCurrency();

  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/youandmevoyage/';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/p/Youme-independent-voyage-100064363920653/';

  const socialStats = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: 'Instagram @youandmevoyage',
      count: settings?.instagramFollowers || '48.5K Followers',
      icon: InstagramLogo,
      url: instagramUrl,
      bg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#cc2366] text-white shadow-pink-500/20',
      hoverBorder: 'hover:border-pink-500/50',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: 'TikTok Travel Reels',
      count: settings?.tiktokFollowers || '22.4K Community',
      icon: TikTokLogo,
      url: tiktokUrl,
      bg: 'bg-black text-[#00f2fe] border border-stone-700 shadow-[0_0_12px_rgba(0,242,254,0.25)]',
      hoverBorder: 'hover:border-cyan-500/50',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: 'YouTube 4K Vlogs',
      count: settings?.youtubeSubscribers || '15.8K Subscribers',
      icon: YouTubeLogo,
      url: youtubeUrl,
      bg: 'bg-[#FF0000] text-white shadow-red-500/30',
      hoverBorder: 'hover:border-red-500/50',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'Facebook Travellers Hub',
      count: settings?.facebookMembers || '34K Members',
      icon: FacebookLogo,
      url: facebookUrl,
      bg: 'bg-[#1877F2] text-white shadow-blue-500/30',
      hoverBorder: 'hover:border-blue-500/50',
    },
  ];

  const videoCards = [
    {
      id: 1,
      tag: 'Instagram Reel',
      icon: InstagramLogo,
      iconColor: 'text-pink-400',
      title: 'Majestic Shore Temple Sunset in Mahabalipuram',
      image: settings?.socialCard1Image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85',
      url: settings?.socialCard1Url || instagramUrl,
    },
    {
      id: 2,
      tag: 'TikTok Viral',
      icon: TikTokLogo,
      iconColor: 'text-cyan-400',
      title: 'Serene Backwater Cruise in Alleppey Kerala',
      image: settings?.socialCard2Image || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85',
      url: settings?.socialCard2Url || tiktokUrl,
    },
    {
      id: 3,
      tag: 'YouTube 4K',
      icon: YouTubeLogo,
      iconColor: 'text-red-500',
      title: '4K Private South India Road Trip & Cultural Vlogs',
      image: settings?.socialCard3Image || 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=85',
      url: settings?.socialCard3Url || youtubeUrl,
    },
    {
      id: 4,
      tag: 'Facebook Story',
      icon: FacebookLogo,
      iconColor: 'text-blue-400',
      title: 'Misty Morning Tea Garden Walk in Munnar Hills',
      image: settings?.socialCard4Image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=85',
      url: settings?.socialCard4Url || facebookUrl,
    },
  ];

  return (
    <section id="social-community" className="section-wrap bg-[#0F172A] py-16 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title Lockup matching exact SS typography */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[2px] bg-orange-500" />
            <span className="text-[11px] font-mono tracking-widest text-orange-400 uppercase font-bold">
              LIVE CONTENT & SOCIAL MEDIA INTEGRATION
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Join Our <em className="text-orange-400 italic font-serif font-normal">Global Travel Community</em>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Follow <strong className="text-slate-200">@YouAndMeVoyage</strong> across Instagram, TikTok, YouTube & Facebook for daily live destination highlights, travel reels, and guest stories.
          </p>
        </div>

        {/* 4 Social Stat Pill Cards with Official Logos & Brand Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialStats.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-xl transition-all duration-300 group hover:bg-slate-800 ${item.hoverBorder}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${item.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-sm font-bold text-slate-100 block truncate font-sans">
                    {item.count}
                  </strong>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {item.handle}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-orange-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>

        {/* 4 Video / Reel Cards with Play Overlays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoCards.map((card) => {
            const TagIcon = card.icon;
            return (
              <a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/5] flex flex-col justify-between p-4 shadow-2xl transition-all duration-500 hover:border-orange-500/60 hover:shadow-orange-500/10"
              >
                {/* Background Image with Zoom */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 group-hover:from-black/95 transition-all" />

                {/* Top Badge Tag with Authentic Brand Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-200 shadow-md">
                    <TagIcon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                    {card.tag}
                  </span>
                </div>

                {/* Center Glowing Play Icon Overlay */}
                <div className="relative z-10 my-auto flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-orange-500/90 border border-orange-400/60 text-white flex items-center justify-center shadow-xl group-hover:scale-125 group-hover:bg-orange-500 transition-all duration-300">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Action CTA */}
                <div className="relative z-10 space-y-1">
                  <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-orange-400 transition-colors">
                    {card.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 group-hover:text-slate-200">
                    Click to view reel on {card.tag.split(' ')[0]} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

