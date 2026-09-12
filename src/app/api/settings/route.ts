export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { logAuditEvent } from '@/lib/auditLogger';

const DEFAULT_SETTINGS = {
  id: 'default-settings',
  siteTitle: 'You & Me – Independent Voyage',
  siteLogo: '',
  siteFavicon: '',
  contactEmail: 'youandmevoyage@gmail.com',
  whatsappNumber: '+91 9994315778',
  address: 'Chennai, Tamil Nadu, India',
  weatherText: 'South India: 28°C Pleasant',
  adminPasscode: 'admin123',

  instagramUrl: 'https://www.instagram.com/youandmevoyage/',
  facebookUrl: 'https://www.facebook.com/p/Youme-independent-voyage-100064363920653/',
  tripadvisorUrl: 'https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews-You_Me_Independent_Voyage-Chennai_Madras_Chennai_District_Tamil_Nadu.html',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  xUrl: 'https://x.com',
  linkedinUrl: 'https://linkedin.com',

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'zfvizmyg',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '831486493558769',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'q7KP6TlLZwFLzyS0aTrbGMws5EI',
  cloudinaryUploadPreset: 'voyage_uploads',
  enableCloudinary: true,

  usdToEur: 0.92,
  usdToGbp: 0.78,
  usdToNad: 83.5,
  defaultCurrency: 'USD',

  siteMetaTitle: 'You & Me – Independent Voyage | Custom South India Private Tours',
  siteMetaDescription: 'Private journeys, authentic local experiences, and custom driver-assisted itineraries across Tamil Nadu and Kerala.',
  siteKeywords: 'South India private tours, Tamil Nadu driver, Kerala custom itinerary, private travel South India',
  googleAnalyticsId: 'G-YM12345678',
  enableRobotsIndex: true,

  heroHeadline: 'Travel South India Your Way',
  heroSubheadline: 'Private journeys · Authentic experiences · Experienced local companions',
  heroCopy: 'Thoughtfully crafted itineraries across Tamil Nadu, Kerala, and South India tailored specifically to your speed and preferences.',
  heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85',
  heroBanners: JSON.stringify([]),
  announcementBannerText: '✨ Custom Private Tours for 2026 Season Now Open! Plan your Tamil Nadu & Kerala road trip today.',
  announcementBannerLink: '/build-your-trip',
  enableAnnouncementBanner: true,
  termsContent: '',
  privacyContent: '',

  // About Page CMS Settings Defaults
  aboutHeroHeadline: 'Crafting Authentic South India Journeys',
  aboutHeroSubheadline: 'Bespoke Private Escapes · Heritage Temples · Expert Local Companions',
  aboutHeroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=85',
  aboutCompanyStoryTitle: 'Our Story: Independent Travel Companions',
  aboutCompanyStorySubheadline: 'Engineered for travelers seeking authentic South Indian heritage',
  aboutCompanyStoryContent: 'Founded in Chennai, You & Me – Independent Voyage was born out of a passion for authentic cultural journeys, pristine temple architecture, and serene backwater escapes. We provide unhurried, private, and deeply personal travel experiences with dedicated local driver companions tailored to your schedule.',
  aboutCompanyStoryImage: '/images/our_story_fleet.jpg',
  aboutMission: 'To celebrate and share South India’s rich culture and serene landscapes through sustainable, personalized private driver journeys.',
  aboutVision: 'To set the gold standard for authentic, driver-assisted private travel in South India.',
  aboutWhyChooseUs: JSON.stringify([]),
  aboutTeamMembers: JSON.stringify([]),
  aboutSustainabilityTitle: 'Eco-Conscious & Authentic Local Travel',
  aboutSustainabilityContent: 'We honor the land and local communities by recommending eco-conscious heritage lodges, supporting local artisans, and promoting plastic-free travel practices across South India.',
  aboutSustainabilityImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
  aboutSafetyTitle: 'Traveler Safety & 24/7 Local Support',
  aboutSafetyContent: 'Your safety is our top priority. All private vehicles undergo thorough maintenance checks and are driven by verified, licensed local companions with 24/7 dispatch support.',
  aboutCertifications: JSON.stringify([]),
  aboutAwards: JSON.stringify([]),
  aboutMetaTitle: '',
  aboutMetaDescription: '',
  aboutKeywords: '',
  aboutCtaHeadline: 'Ready to Plan Your Custom South India Journey?',
  aboutCtaSubheadline: 'Speak with our travel specialists to receive a custom itinerary proposal.',
  aboutCtaButtonText: 'Request Custom Itinerary Quote',

  // Google Maps Location Settings Defaults
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.498305719363!2d80.25268487507693!3d13.003923387313888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267e7c992769d%3A0xbbfd1d36d4f9c158!2sIndira%20Nagar%2C%20Adyar%2C%20Chennai%2C%20Tamil%20Nadu%20600020!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  officeAddress: 'Indira Nagar, Adyar, Chennai, Tamil Nadu, India - 600020',
  officePhone: '+91 9994315778 / +91 63814 20556',
  secondaryPhone: '+91 63814 20556',
  operationHours: '24/7 Support & Dispatch',
  showGoogleMapInFooter: true,

  // Lead Magnet eBook PDF Settings
  leadMagnetTitle: 'Download Free: Ultimate South India Travel Guide',
  leadMagnetSubtext: 'Route Maps · Best Season Charts · Boutique Hotel Price Breakdown',
  leadMagnetButtonText: 'Get Free eBook PDF',
  leadMagnetPdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',

  // Home Page Signature Itinerary CMS
  homeItineraryHeadline: '10-day classic South India explorer',
  homeItineraryCopy: 'One signature journey. Tamil Nadu temples, Chettinad heritage, Munnar tea hills, and Kerala backwaters in seamless sequence.',
  homeItineraries: JSON.stringify([]),
  siteExperiences: JSON.stringify([]),
};

const ALLOWED_SETTING_FIELDS = [
  'siteTitle',
  'siteLogo',
  'siteFavicon',
  'contactEmail',
  'whatsappNumber',
  'address',
  'weatherText',
  'adminPasscode',
  'instagramUrl',
  'facebookUrl',
  'tripadvisorUrl',
  'youtubeUrl',
  'tiktokUrl',
  'xUrl',
  'linkedinUrl',
  'cloudinaryCloudName',
  'cloudinaryApiKey',
  'cloudinaryApiSecret',
  'cloudinaryUploadPreset',
  'enableCloudinary',
  'usdToEur',
  'usdToGbp',
  'usdToNad',
  'defaultCurrency',
  'siteMetaTitle',
  'siteMetaDescription',
  'siteKeywords',
  'googleAnalyticsId',
  'enableRobotsIndex',
  'heroHeadline',
  'heroSubheadline',
  'heroCopy',
  'heroImage',
  'heroBanners',
  'announcementBannerText',
  'announcementBannerLink',
  'enableAnnouncementBanner',
  'termsContent',
  'privacyContent',
  'aboutHeroHeadline',
  'aboutHeroSubheadline',
  'aboutHeroImage',
  'aboutCompanyStoryTitle',
  'aboutCompanyStorySubheadline',
  'aboutCompanyStoryContent',
  'aboutCompanyStoryImage',
  'aboutMission',
  'aboutVision',
  'aboutWhyChooseUs',
  'aboutTeamMembers',
  'aboutSustainabilityTitle',
  'aboutSustainabilityContent',
  'aboutSustainabilityImage',
  'aboutSafetyTitle',
  'aboutSafetyContent',
  'aboutCertifications',
  'aboutAwards',
  'aboutMetaTitle',
  'aboutMetaDescription',
  'aboutKeywords',
  'aboutCtaHeadline',
  'aboutCtaSubheadline',
  'aboutCtaButtonText',
  'googleMapEmbedUrl',
  'officeAddress',
  'officePhone',
  'secondaryPhone',
  'operationHours',
  'showGoogleMapInFooter',
  'homeItineraryHeadline',
  'homeItineraryCopy',
  'homeItineraries',
  'leadMagnetTitle',
  'leadMagnetSubtext',
  'leadMagnetButtonText',
  'leadMagnetPdfUrl',
  'siteExperiences',
];

const BOOLEAN_FIELDS = new Set(['enableCloudinary', 'enableRobotsIndex', 'enableAnnouncementBanner', 'showGoogleMapInFooter']);

function isEmptyValue(v: any, isBooleanField: boolean): boolean {
  if (v === null || v === undefined) return true;
  if (!isBooleanField && v === '') return true;
  return false;
}

function applyDefaults(target: Record<string, any>) {
  const result: Record<string, any> = { ...DEFAULT_SETTINGS, ...target };
  for (const [key, defaultVal] of Object.entries(DEFAULT_SETTINGS)) {
    const isBool = BOOLEAN_FIELDS.has(key);
    // For boolean fields: only apply default when value is null/undefined (not when false)
    // For string fields: apply default when null/undefined/empty-string
    if (isEmptyValue(result[key], isBool) && defaultVal !== undefined) {
      result[key] = defaultVal;
    }
  }
  return result;
}

let inMemorySettingsCache: any = null;

export async function GET() {
  try {
    const dbPromise = prisma.siteSettings.findFirst({ orderBy: { updatedAt: 'desc' } });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
    const settings = await Promise.race([dbPromise, timeoutPromise]);

    const fallbackTerms = 'Welcome to You & Me – Independent Voyage. By booking a private tour package with us, you agree to our terms and conditions. All private tour packages include dedicated AC vehicle, experienced local driver companion, and full itinerary support.';
    const fallbackPrivacy = 'You & Me – Independent Voyage values your privacy. We strictly protect your personal information, contact details, payment info, and booking requirements.';

    const termsContent =
      inMemorySettingsCache?.termsContent !== undefined && inMemorySettingsCache?.termsContent !== null && inMemorySettingsCache?.termsContent !== ''
        ? inMemorySettingsCache.termsContent
        : settings?.termsContent !== undefined && settings?.termsContent !== null && settings?.termsContent !== ''
        ? settings.termsContent
        : fallbackTerms;

    const privacyContent =
      inMemorySettingsCache?.privacyContent !== undefined && inMemorySettingsCache?.privacyContent !== null && inMemorySettingsCache?.privacyContent !== ''
        ? inMemorySettingsCache.privacyContent
        : settings?.privacyContent !== undefined && settings?.privacyContent !== null && settings?.privacyContent !== ''
        ? settings.privacyContent
        : fallbackPrivacy;

    const siteExperiences =
      inMemorySettingsCache?.siteExperiences !== undefined && inMemorySettingsCache?.siteExperiences !== null
        ? inMemorySettingsCache.siteExperiences
        : settings?.siteExperiences !== undefined && settings?.siteExperiences !== null
        ? settings.siteExperiences
        : JSON.stringify([]);

    const heroBanners =
      inMemorySettingsCache?.heroBanners !== undefined && inMemorySettingsCache?.heroBanners !== null && inMemorySettingsCache?.heroBanners !== '' && inMemorySettingsCache?.heroBanners !== '[]'
        ? inMemorySettingsCache.heroBanners
        : settings?.heroBanners !== undefined && settings?.heroBanners !== null && settings?.heroBanners !== '' && settings?.heroBanners !== '[]'
        ? settings.heroBanners
        : JSON.stringify([]);

    // Strip null/undefined/empty-strings from cache but KEEP boolean false values
    const cleanCache = Object.fromEntries(
      Object.entries(inMemorySettingsCache || {}).filter(([k, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v !== 'boolean' && v === '') return false;
        return true;
      })
    );
    // DB is authoritative – apply it LAST so it beats cache for any saved field
    // Also keep DB boolean false values (don't strip them)
    const cleanDb = Object.fromEntries(
      Object.entries(settings || {}).filter(([k, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v !== 'boolean' && v === '') return false;
        return true;
      })
    );

    const merged = applyDefaults({
      ...cleanCache,  // lowest priority after defaults
      ...cleanDb,     // DB beats cache (authoritative)
      termsContent,
      privacyContent,
      siteExperiences,
      heroBanners,
    });

    if (!merged.operationHours || merged.operationHours.includes('08:00') || merged.operationHours.includes('08:30')) {
      merged.operationHours = '24/7 Support & Dispatch';
    }

    if (!merged.siteLogo && settings?.siteLogo) {
      merged.siteLogo = settings.siteLogo;
    }
    if (!merged.siteLogo && inMemorySettingsCache?.siteLogo) {
      merged.siteLogo = inMemorySettingsCache.siteLogo;
    }
    if (!merged.siteFavicon && settings?.siteFavicon) {
      merged.siteFavicon = settings.siteFavicon;
    }
    if (!merged.siteFavicon && inMemorySettingsCache?.siteFavicon) {
      merged.siteFavicon = inMemorySettingsCache.siteFavicon;
    }

    inMemorySettingsCache = merged;
    return NextResponse.json(inMemorySettingsCache);
  } catch (error: any) {
    return NextResponse.json(applyDefaults(inMemorySettingsCache || {}));
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

    const updateData: Record<string, any> = {};
    const prismaUpdateData: Record<string, any> = {};

    const reservedKeys = ['id', '_id', 'createdAt', 'updatedAt'];
    for (const [key, val] of Object.entries(body)) {
      if (!reservedKeys.includes(key) && val !== undefined) {
        if (key === 'tripAdvisorUrl' && !body.tripadvisorUrl) {
          updateData.tripadvisorUrl = val;
        } else {
          updateData[key] = val;
        }
      }
    }

    for (const field of ALLOWED_SETTING_FIELDS) {
      if (updateData[field] !== undefined) {
        if (field === 'enableCloudinary' || field === 'enableRobotsIndex' || field === 'enableAnnouncementBanner' || field === 'showGoogleMapInFooter') {
          const v = updateData[field];
          if (typeof v === 'boolean') {
            prismaUpdateData[field] = v;
          } else if (typeof v === 'string') {
            prismaUpdateData[field] = v.toLowerCase() === 'true';
          } else {
            prismaUpdateData[field] = Boolean(v);
          }
        } else if (field === 'usdToEur' || field === 'usdToGbp' || field === 'usdToNad') {
          const num = parseFloat(updateData[field]);
          prismaUpdateData[field] = isNaN(num) ? 1 : num;
        } else if (typeof updateData[field] === 'object' && updateData[field] !== null) {
          prismaUpdateData[field] = JSON.stringify(updateData[field]);
        } else {
          prismaUpdateData[field] = updateData[field];
        }
      }
    }

    let settings = null;
    try {
      const existing = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: 'desc' } });
      if (existing) {
        if (!prismaUpdateData.siteLogo && existing.siteLogo) {
          prismaUpdateData.siteLogo = existing.siteLogo;
        }
        if (!prismaUpdateData.siteFavicon && existing.siteFavicon) {
          prismaUpdateData.siteFavicon = existing.siteFavicon;
        }
        settings = await prisma.siteSettings.update({
          where: { id: existing.id },
          data: prismaUpdateData,
        });
      } else {
        settings = await prisma.siteSettings.create({
          data: prismaUpdateData,
        });
      }
    } catch (e) {
      console.error('DB settings update failed:', e);
    }

    // updateData (what user just saved) is highest priority
    inMemorySettingsCache = applyDefaults({
      ...(inMemorySettingsCache || {}),
      ...(settings || {}),   // DB saved result beats old cache
      ...updateData,          // user's latest input beats everything
    });

    if (!inMemorySettingsCache.siteLogo && settings?.siteLogo) {
      inMemorySettingsCache.siteLogo = settings.siteLogo;
    }
    if (!inMemorySettingsCache.siteFavicon && settings?.siteFavicon) {
      inMemorySettingsCache.siteFavicon = settings.siteFavicon;
    }
    if (updateData.termsContent !== undefined) {
      inMemorySettingsCache.termsContent = updateData.termsContent;
    }
    if (updateData.privacyContent !== undefined) {
      inMemorySettingsCache.privacyContent = updateData.privacyContent;
    }
    if (updateData.siteExperiences !== undefined) {
      inMemorySettingsCache.siteExperiences = typeof updateData.siteExperiences === 'object'
        ? JSON.stringify(updateData.siteExperiences)
        : updateData.siteExperiences;
    }
    if (updateData.heroBanners !== undefined) {
      inMemorySettingsCache.heroBanners = typeof updateData.heroBanners === 'object'
        ? JSON.stringify(updateData.heroBanners)
        : updateData.heroBanners;
    }

    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/terms');
    revalidatePath('/privacy');
    revalidateTag('settings');

    return NextResponse.json(inMemorySettingsCache);
  } catch (error: any) {
    revalidatePath('/', 'layout');
    revalidateTag('settings');
    return NextResponse.json(applyDefaults(inMemorySettingsCache || {}));
  }
}

export async function POST(request: Request) {
  return PUT(request);
}

export async function PATCH(request: Request) {
  return PUT(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-auth',
    },
  });
}
