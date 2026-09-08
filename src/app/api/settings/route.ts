import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { logAuditEvent } from '@/lib/auditLogger';

const DEFAULT_SETTINGS = {
  id: 'default-settings',
  siteTitle: 'Discovery Safaris Namibia',
  siteLogo: '',
  siteFavicon: '',
  contactEmail: 'info@discoverysafaris.com',
  whatsappNumber: '+264 81 123 4567',
  weatherText: 'Etosha National Park: 28°C Sunny',
  adminPasscode: 'admin123',

  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  xUrl: 'https://x.com',
  linkedinUrl: 'https://linkedin.com',

  cloudinaryCloudName: 'discovery-safaris',
  cloudinaryApiKey: '',
  cloudinaryApiSecret: '',
  cloudinaryUploadPreset: 'safari_uploads',
  enableCloudinary: false,

  usdToEur: 0.92,
  usdToGbp: 0.78,
  usdToNad: 18.5,
  defaultCurrency: 'USD',

  siteMetaTitle: 'Discovery Safaris Namibia | Luxury Private Tours & Expeditions',
  siteMetaDescription: 'Experience the raw majesty of Namibia with bespoke private safaris, luxury tented camps, and wildlife expeditions.',
  siteKeywords: 'namibia safari, luxury travel, etosha wildlife, sossusvlei dunes',
  googleAnalyticsId: 'G-DS12345678',
  enableRobotsIndex: true,

  heroHeadline: 'Experience the raw majesty of Namibia',
  heroSubheadline: 'Private journeys · Wild places · 2004—2026',
  heroCopy: 'Bespoke private safaris, luxury tented camps, and wildlife expeditions engineered for international travelers.',
  heroImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1920&q=85',
  heroBanners: JSON.stringify([
    { id: 1, headline: 'Experience the raw majesty of Namibia', subheadline: 'Private journeys · Wild places · 2004—2026', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1920&q=85' },
    { id: 2, headline: 'Etosha Wildlife Waterholes Expedition', subheadline: 'Big 5 Safari · Luxury Tented Lodges', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=85' },
  ]),
  announcementBannerText: '🔥 Special Offer: Save 15% on 2026 Private Fly-in Safaris! Book by end of month.',
  announcementBannerLink: '/safari/classic-namibia-expedition',
  enableAnnouncementBanner: true,
  termsContent: 'Welcome to Discovery Safaris Namibia. By booking a safari journey with us, you agree to our terms and conditions. All private safaris include comprehensive guide coverage, vehicle insurance, and national park entry permits.',
  privacyContent: 'Discovery Safaris Namibia values your privacy. We strictly protect your personal information, contact details, payment info, and passport data required for park registrations.',

  // About Page CMS Settings Defaults
  aboutHeroHeadline: 'Crafting Extraordinary Namibian Journeys',
  aboutHeroSubheadline: 'Bespoke Private Expeditions · Wildlife Conservation · Expert Guides Since 2004',

  // Google Maps Location Settings Defaults
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117924.96016766436!2d17.026402!3d-22.56088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c0b1b5e3a3f5a05%3A0x6a0c0b1b5e3a3f5a!2sWindhoek%2C%20Namibia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s',
  officeAddress: '77 Independence Avenue, Central Business District, Windhoek, Namibia',
  officePhone: '+264 61 234 5678 / +264 81 123 4567',
  showGoogleMapInFooter: true,
  aboutHeroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=85',
  aboutCompanyStoryTitle: 'Our Story: Two Decades of Safari Heritage',
  aboutCompanyStorySubheadline: 'Engineered for international travelers seeking authentic African wilderness',
  aboutCompanyStoryContent: 'Founded in Windhoek in 2004, Discovery Safaris Namibia was born out of a passion for pristine wildlife sanctuaries and remote desert landscapes. Over the past 22 years, we have grown from a small family outfit into one of Namibia’s premier private safari operators. We own and maintain a private fleet of custom pop-top 4x4 Land Cruisers, equipped with satellite communications, onboard refrigeration, and top-tier optics. Our focus remains singular: providing unhurried, private, and deeply personal safari experiences tailored to your schedule.',
  aboutCompanyStoryImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85',
  aboutMission: 'To protect and celebrate Namibia’s wild places through sustainable, low-impact private tourism while delivering unforgettable luxury journeys to every guest.',
  aboutVision: 'To set the gold standard for wildlife conservation safaris in Southern Africa, empowering local communities and preserving desert-adapted wildlife for generations to come.',
  aboutWhyChooseUs: JSON.stringify([
    { id: 1, title: '100% Private Expeditions', desc: 'No shared tour buses. Your private 4x4 vehicle, expert guide, and customized daily itinerary.' },
    { id: 2, title: 'Master Wildlife Trackers', desc: 'Guides with 10+ years field experience, FGASA & NTB certified, trained in wildlife ecology.' },
    { id: 3, title: 'Handpicked Luxury Lodges', desc: 'Curated eco-luxury tented camps, desert villas, and boutique lodges with prime wildlife views.' },
    { id: 4, title: 'Uncompromising Safety', desc: 'Flying doctor medical evacuation insurance included with 24/7 satellite vehicle tracking.' }
  ]),
  aboutTeamMembers: JSON.stringify([
    { id: 1, name: 'Dr. Johan van Zyl', role: 'Head Wildlife Ecologist & Senior Guide', bio: 'With over 18 years in Etosha and Damaraland, Johan specializes in desert elephant and lion tracking.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85' },
    { id: 2, name: 'Sarah Alweendo', role: 'Lead Safari Designer & Concierge', bio: 'Sarah crafts bespoke fly-in and luxury overland itineraries tailored to international guests.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85' },
    { id: 3, name: 'Markus Becker', role: 'Expedition Operations Manager', bio: 'Former wilderness ranger with deep expertise in 4x4 desert logistics and remote safety.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85' }
  ]),
  aboutSustainabilityTitle: 'Eco-Conscious Travel & Wildlife Conservation',
  aboutSustainabilityContent: 'We believe true luxury honors the land. Discovery Safaris proudly contributes a portion of every booking directly to Save the Rhino Trust and local communal conservancies across Damaraland and the Skeleton Coast. Our safari camps utilize 100% solar power, eliminate single-use plastics, and source organic produce from local Namibian farmers.',
  aboutSustainabilityImage: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
  aboutSafetyTitle: 'Wilderness Safety & 24/7 Medical Coverage',
  aboutSafetyContent: 'Your safety is paramount. All our custom 4x4 vehicles are equipped with dual satellite phones, GPS tracking, comprehensive medical first-aid kits, and onboard oxygen. Every guest receives complimentary Westair Flying Doctors emergency air evacuation coverage for total peace of mind in remote regions.',
  aboutCertifications: JSON.stringify([
    'Namibia Tourism Board (NTB) Registered Operator #T0089',
    'Tour and Safari Association of Namibia (TASA) Accredited Member',
    'Eco-Awards Namibia 5-Flower Sustainability Seal',
    'FGASA Certified Level 3 Field Guides & Trackers'
  ]),
  aboutAwards: JSON.stringify([
    '🏆 World Travel Awards 2024 - Leading Namibia Safari Operator',
    '⭐ TripAdvisor Travelers\' Choice Award 2025 - Top 1% Worldwide',
    '🌿 African Eco Excellence Award 2023 - Conservation Partner'
  ]),
  aboutCtaHeadline: 'Ready to Plan Your Custom Namibia Safari?',
  aboutCtaSubheadline: 'Speak with our senior safari designers to receive a complimentary 24-hour itinerary proposal.',
  aboutCtaButtonText: 'Request Custom Safari Quote',

  // Lead Magnet eBook PDF Settings (Dynamic & Configurable)
  leadMagnetTitle: 'Download Free: Ultimate Namibia Safari Guide',
  leadMagnetSubtext: 'Wildlife Maps · Best Season Charts · Lodge Price Breakdown',
  leadMagnetButtonText: 'Get Free eBook PDF',
  leadMagnetPdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',

  // Home Page Signature Itinerary CMS
  homeItineraryHeadline: '10-day classic Namibian explorer',
  homeItineraryCopy: 'One signature journey. Five distinct landscapes. An itinerary designed to leave room for the moments you cannot plan.',
  homeItineraries: JSON.stringify([
    {
      dayNumber: '01',
      daysLabel: 'Day 01',
      title: 'Arrival in Windhoek & Sunset Game Drive',
      description: 'Welcome to Namibia. Meet your private guide, settle into your design-led lodge, then watch the city turn amber from a quiet reserve.',
      duration: '45 min · 35 km',
      mealPlan: 'Dinner',
      accommodation: 'Little Kulala',
      accommodationSub: 'Private desert villa · Sossusvlei',
      image: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '02',
      daysLabel: 'Days 02–03',
      title: 'Sossusvlei Dunes & Deadvlei 4x4 Excursion',
      description: 'Journey south into the ancient Namib Desert. Climb Dune 45 at sunrise, walk among the ancient camel thorn trees of Deadvlei, and explore Sesriem Canyon.',
      duration: '4.5 hrs · 350 km',
      mealPlan: 'Full Board',
      accommodation: 'Little Kulala Villa',
      accommodationSub: 'Luxury desert villa · Sossusvlei',
      image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
    },
    {
      dayNumber: '03',
      daysLabel: 'Days 04–05',
      title: 'Coastal Swakopmund & Living Desert Tour',
      description: 'Traverse the desert to the coastal town of Swakopmund. Enjoy fresh oysters, a marine catamaran cruise in Walvis Bay, and a living desert gecko hunt.',
      duration: '4 hrs · 320 km',
      mealPlan: 'Breakfast & Lunch',
      accommodation: 'Strand Hotel Swakopmund',
      accommodationSub: 'Luxury Atlantic retreat',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
    },
    {
      dayNumber: '04',
      daysLabel: 'Days 06–08',
      title: 'Etosha National Park Big Five Safari',
      description: 'Enter Etosha National Park for three full days of premier game viewing around floodlit waterholes teeming with lions, elephants, and black rhinos.',
      duration: '5 hrs · 490 km',
      mealPlan: 'Full Board',
      accommodation: 'Ongava Lodge',
      accommodationSub: 'Private reserve villa · Etosha',
      image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=85',
    },
    {
      dayNumber: '05',
      daysLabel: 'Days 09–10',
      title: 'Damaraland Rock Art & Return',
      description: 'Discover Twyfelfontein UNESCO rock engravings and track desert-adapted elephants before returning to Windhoek for international departure.',
      duration: '4 hrs · 380 km',
      mealPlan: 'Breakfast & Farewell Dinner',
      accommodation: 'Okapuka Safari Lodge',
      accommodationSub: 'Safari lodge · Windhoek',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85',
    },
  ]),
};

let inMemorySettingsCache: any = null;

export async function GET() {
  try {
    const dbPromise = prisma.siteSettings.findFirst();
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
    const settings = await Promise.race([dbPromise, timeoutPromise]);

    if (settings) {
      inMemorySettingsCache = { ...DEFAULT_SETTINGS, ...inMemorySettingsCache, ...settings };
      return NextResponse.json(inMemorySettingsCache);
    }

    return NextResponse.json(inMemorySettingsCache || DEFAULT_SETTINGS);
  } catch (error: any) {
    return NextResponse.json(inMemorySettingsCache || DEFAULT_SETTINGS);
  }
}

export async function PUT(request: Request) {
  const auth = requireAdminAuth(request);
  if (!auth.authorized) {
    logAuditEvent(request, 'UPDATE_SETTINGS', 'SETTINGS', 'UNAUTHORIZED');
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const body = sanitizeObject(rawBody);

    const {
      siteTitle,
      siteLogo,
      contactEmail,
      whatsappNumber,
      weatherText,
      adminPasscode,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      tiktokUrl,
      xUrl,
      linkedinUrl,
      cloudinaryCloudName,
      cloudinaryApiKey,
      cloudinaryApiSecret,
      cloudinaryUploadPreset,
      enableCloudinary,
      usdToEur,
      usdToGbp,
      usdToNad,
      defaultCurrency,
      siteMetaTitle,
      siteMetaDescription,
      siteKeywords,
      googleAnalyticsId,
      enableRobotsIndex,
      heroHeadline,
      heroSubheadline,
      heroCopy,
      heroImage,
      heroBanners,
      announcementBannerText,
      announcementBannerLink,
      enableAnnouncementBanner,
      termsContent,
      privacyContent,
    } = body;

    const updateData: any = {};
    if (siteTitle !== undefined) updateData.siteTitle = siteTitle;
    if (siteLogo !== undefined) updateData.siteLogo = siteLogo;
    if (body.siteFavicon !== undefined) updateData.siteFavicon = body.siteFavicon;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
    if (weatherText !== undefined) updateData.weatherText = weatherText;
    if (adminPasscode !== undefined) updateData.adminPasscode = adminPasscode;

    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
    if (tiktokUrl !== undefined) updateData.tiktokUrl = tiktokUrl;
    if (xUrl !== undefined) updateData.xUrl = xUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;

    if (cloudinaryCloudName !== undefined) updateData.cloudinaryCloudName = cloudinaryCloudName;
    if (cloudinaryApiKey !== undefined) updateData.cloudinaryApiKey = cloudinaryApiKey;
    if (cloudinaryApiSecret !== undefined) updateData.cloudinaryApiSecret = cloudinaryApiSecret;
    if (cloudinaryUploadPreset !== undefined) updateData.cloudinaryUploadPreset = cloudinaryUploadPreset;
    if (enableCloudinary !== undefined) updateData.enableCloudinary = Boolean(enableCloudinary);

    if (usdToEur !== undefined) updateData.usdToEur = parseFloat(usdToEur);
    if (usdToGbp !== undefined) updateData.usdToGbp = parseFloat(usdToGbp);
    if (usdToNad !== undefined) updateData.usdToNad = parseFloat(usdToNad);
    if (defaultCurrency !== undefined) updateData.defaultCurrency = defaultCurrency;

    if (siteMetaTitle !== undefined) updateData.siteMetaTitle = siteMetaTitle;
    if (siteMetaDescription !== undefined) updateData.siteMetaDescription = siteMetaDescription;
    if (siteKeywords !== undefined) updateData.siteKeywords = siteKeywords;
    if (googleAnalyticsId !== undefined) updateData.googleAnalyticsId = googleAnalyticsId;
    if (enableRobotsIndex !== undefined) updateData.enableRobotsIndex = Boolean(enableRobotsIndex);

    if (heroHeadline !== undefined) updateData.heroHeadline = heroHeadline;
    if (heroSubheadline !== undefined) updateData.heroSubheadline = heroSubheadline;
    if (heroCopy !== undefined) updateData.heroCopy = heroCopy;
    if (heroImage !== undefined) updateData.heroImage = heroImage;
    if (heroBanners !== undefined) updateData.heroBanners = typeof heroBanners === 'string' ? heroBanners : JSON.stringify(heroBanners);
    if (announcementBannerText !== undefined) updateData.announcementBannerText = announcementBannerText;
    if (announcementBannerLink !== undefined) updateData.announcementBannerLink = announcementBannerLink;
    if (enableAnnouncementBanner !== undefined) updateData.enableAnnouncementBanner = Boolean(enableAnnouncementBanner);

    if (termsContent !== undefined) updateData.termsContent = termsContent;
    if (privacyContent !== undefined) updateData.privacyContent = privacyContent;

    // About Page CMS fields
    if (body.aboutHeroHeadline !== undefined) updateData.aboutHeroHeadline = body.aboutHeroHeadline;
    if (body.aboutHeroSubheadline !== undefined) updateData.aboutHeroSubheadline = body.aboutHeroSubheadline;
    if (body.aboutHeroImage !== undefined) updateData.aboutHeroImage = body.aboutHeroImage;

    if (body.aboutCompanyStoryTitle !== undefined) updateData.aboutCompanyStoryTitle = body.aboutCompanyStoryTitle;
    if (body.aboutCompanyStorySubheadline !== undefined) updateData.aboutCompanyStorySubheadline = body.aboutCompanyStorySubheadline;
    if (body.aboutCompanyStoryContent !== undefined) updateData.aboutCompanyStoryContent = body.aboutCompanyStoryContent;
    if (body.aboutCompanyStoryImage !== undefined) updateData.aboutCompanyStoryImage = body.aboutCompanyStoryImage;

    if (body.aboutMission !== undefined) updateData.aboutMission = body.aboutMission;
    if (body.aboutVision !== undefined) updateData.aboutVision = body.aboutVision;

    if (body.aboutWhyChooseUs !== undefined) updateData.aboutWhyChooseUs = typeof body.aboutWhyChooseUs === 'string' ? body.aboutWhyChooseUs : JSON.stringify(body.aboutWhyChooseUs);
    if (body.aboutTeamMembers !== undefined) updateData.aboutTeamMembers = typeof body.aboutTeamMembers === 'string' ? body.aboutTeamMembers : JSON.stringify(body.aboutTeamMembers);

    if (body.aboutSustainabilityTitle !== undefined) updateData.aboutSustainabilityTitle = body.aboutSustainabilityTitle;
    if (body.aboutSustainabilityContent !== undefined) updateData.aboutSustainabilityContent = body.aboutSustainabilityContent;
    if (body.aboutSustainabilityImage !== undefined) updateData.aboutSustainabilityImage = body.aboutSustainabilityImage;

    if (body.aboutSafetyTitle !== undefined) updateData.aboutSafetyTitle = body.aboutSafetyTitle;
    if (body.aboutSafetyContent !== undefined) updateData.aboutSafetyContent = body.aboutSafetyContent;

    if (body.aboutCertifications !== undefined) updateData.aboutCertifications = typeof body.aboutCertifications === 'string' ? body.aboutCertifications : JSON.stringify(body.aboutCertifications);
    if (body.aboutAwards !== undefined) updateData.aboutAwards = typeof body.aboutAwards === 'string' ? body.aboutAwards : JSON.stringify(body.aboutAwards);

    if (body.aboutMetaTitle !== undefined) updateData.aboutMetaTitle = body.aboutMetaTitle;
    if (body.aboutMetaDescription !== undefined) updateData.aboutMetaDescription = body.aboutMetaDescription;
    if (body.aboutKeywords !== undefined) updateData.aboutKeywords = body.aboutKeywords;

    if (body.aboutCtaHeadline !== undefined) updateData.aboutCtaHeadline = body.aboutCtaHeadline;
    if (body.aboutCtaSubheadline !== undefined) updateData.aboutCtaSubheadline = body.aboutCtaSubheadline;
    if (body.aboutCtaButtonText !== undefined) updateData.aboutCtaButtonText = body.aboutCtaButtonText;

    if (body.googleMapEmbedUrl !== undefined) updateData.googleMapEmbedUrl = body.googleMapEmbedUrl;
    if (body.officeAddress !== undefined) updateData.officeAddress = body.officeAddress;
    if (body.officePhone !== undefined) updateData.officePhone = body.officePhone;
    if (body.showGoogleMapInFooter !== undefined) updateData.showGoogleMapInFooter = Boolean(body.showGoogleMapInFooter);

    // Lead Magnet eBook PDF fields
    if (body.leadMagnetTitle !== undefined) updateData.leadMagnetTitle = body.leadMagnetTitle;
    if (body.leadMagnetSubtext !== undefined) updateData.leadMagnetSubtext = body.leadMagnetSubtext;
    if (body.leadMagnetButtonText !== undefined) updateData.leadMagnetButtonText = body.leadMagnetButtonText;
    if (body.leadMagnetPdfUrl !== undefined) updateData.leadMagnetPdfUrl = body.leadMagnetPdfUrl;

    // Home Page Signature Itinerary fields
    if (body.homeItineraryHeadline !== undefined) updateData.homeItineraryHeadline = body.homeItineraryHeadline;
    if (body.homeItineraryCopy !== undefined) updateData.homeItineraryCopy = body.homeItineraryCopy;
    if (body.homeItineraries !== undefined) updateData.homeItineraries = typeof body.homeItineraries === 'string' ? body.homeItineraries : JSON.stringify(body.homeItineraries);

    let settings = null;
    try {
      const dbPromise = (async () => {
        const existing = await prisma.siteSettings.findFirst();
        if (existing) {
          return await prisma.siteSettings.update({
            where: { id: existing.id },
            data: updateData,
          });
        } else {
          return await prisma.siteSettings.create({
            data: updateData,
          });
        }
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
      settings = await Promise.race([dbPromise, timeoutPromise]);
    } catch (e) {
      console.warn('DB settings update failed or timed out:', e);
    }

    inMemorySettingsCache = { ...(inMemorySettingsCache || DEFAULT_SETTINGS), ...updateData, ...(settings || {}) };

    return NextResponse.json(inMemorySettingsCache);
  } catch (error: any) {
    return NextResponse.json(inMemorySettingsCache || DEFAULT_SETTINGS);
  }
}
