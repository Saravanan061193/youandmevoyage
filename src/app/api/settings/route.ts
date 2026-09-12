export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/authGuard';
import { sanitizeObject } from '@/lib/sanitize';
import { logAuditEvent } from '@/lib/auditLogger';

const DEFAULT_SETTINGS = {
  id: 'default-settings',
  siteTitle: '',
  siteLogo: '',
  siteFavicon: '',
  contactEmail: '',
  whatsappNumber: '',
  weatherText: '',
  adminPasscode: 'admin123',

  instagramUrl: '',
  facebookUrl: '',
  tripadvisorUrl: '',
  youtubeUrl: '',
  tiktokUrl: '',
  xUrl: '',
  linkedinUrl: '',

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'zfvizmyg',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '831486493558769',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'q7KP6TlLZwFLzyS0aTrbGMws5EI',
  cloudinaryUploadPreset: 'voyage_uploads',
  enableCloudinary: true,


  usdToEur: 1,
  usdToGbp: 1,
  usdToNad: 1,
  defaultCurrency: 'USD',

  siteMetaTitle: '',
  siteMetaDescription: '',
  siteKeywords: '',
  googleAnalyticsId: '',
  enableRobotsIndex: true,

  heroHeadline: '',
  heroSubheadline: '',
  heroCopy: '',
  heroImage: '',
  heroBanners: JSON.stringify([]),
  announcementBannerText: '',
  announcementBannerLink: '',
  enableAnnouncementBanner: false,
  termsContent: '',
  privacyContent: '',

  // About Page CMS Settings Defaults
  aboutHeroHeadline: '',
  aboutHeroSubheadline: '',

  // Google Maps Location Settings Defaults
  googleMapEmbedUrl: '',
  officeAddress: '',
  officePhone: '',
  operationHours: '',
  showGoogleMapInFooter: false,
  aboutHeroImage: '',
  aboutCompanyStoryTitle: '',
  aboutCompanyStorySubheadline: '',
  aboutCompanyStoryContent: '',
  aboutCompanyStoryImage: '',
  aboutMission: '',
  aboutVision: '',
  aboutWhyChooseUs: JSON.stringify([]),
  aboutTeamMembers: JSON.stringify([]),
  aboutSustainabilityTitle: '',
  aboutSustainabilityContent: '',
  aboutSustainabilityImage: '',
  aboutSafetyTitle: '',
  aboutSafetyContent: '',
  aboutCertifications: JSON.stringify([]),
  aboutAwards: JSON.stringify([]),
  aboutMetaTitle: '',
  aboutMetaDescription: '',
  aboutKeywords: '',
  aboutCtaHeadline: '',
  aboutCtaSubheadline: '',
  aboutCtaButtonText: '',

  // Lead Magnet eBook PDF Settings
  leadMagnetTitle: '',
  leadMagnetSubtext: '',
  leadMagnetButtonText: '',
  leadMagnetPdfUrl: '',

  // Home Page Signature Itinerary CMS
  homeItineraryHeadline: '',
  homeItineraryCopy: '',
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

    const merged = {
      ...DEFAULT_SETTINGS,
      ...(settings || {}),
      ...(inMemorySettingsCache || {}),
      termsContent,
      privacyContent,
      siteExperiences,
    };

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
          prismaUpdateData[field] = Boolean(updateData[field]);
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
      const dbPromise = (async () => {
        const existing = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: 'desc' } });
        let res;
        if (existing) {
          // Preserve existing logo and favicon if not provided in request or empty
          if (!prismaUpdateData.siteLogo && existing.siteLogo) {
            prismaUpdateData.siteLogo = existing.siteLogo;
          }
          if (!prismaUpdateData.siteFavicon && existing.siteFavicon) {
            prismaUpdateData.siteFavicon = existing.siteFavicon;
          }
          res = await prisma.siteSettings.update({
            where: { id: existing.id },
            data: prismaUpdateData,
          });
          try {
            await prisma.siteSettings.deleteMany({
              where: { id: { not: existing.id } },
            });
          } catch (err) {}
        } else {
          res = await prisma.siteSettings.create({
            data: prismaUpdateData,
          });
        }
        return res;
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 12000));
      settings = await Promise.race([dbPromise, timeoutPromise]);
    } catch (e) {
      console.error('DB settings update failed:', e);
    }

    inMemorySettingsCache = {
      ...DEFAULT_SETTINGS,
      ...(settings || {}),
      ...(inMemorySettingsCache || {}),
      ...updateData,
    };

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

    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/terms');
    revalidatePath('/privacy');
    revalidateTag('settings');

    return NextResponse.json(inMemorySettingsCache);
  } catch (error: any) {
    revalidatePath('/', 'layout');
    revalidateTag('settings');
    return NextResponse.json(inMemorySettingsCache || DEFAULT_SETTINGS);
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
