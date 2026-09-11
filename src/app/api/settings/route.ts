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
  weatherText: 'Chennai, Tamil Nadu: 30°C Sunny',
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
  siteMetaDescription: 'Experience authentic South India with custom driver-guided private tours across Tamil Nadu and Kerala.',
  siteKeywords: 'south india tours, tamil nadu driver, kerala custom itinerary, private travel',
  googleAnalyticsId: 'G-YM12345678',
  enableRobotsIndex: true,

  heroHeadline: 'Thanjavur Brihadeeswarar Temple & South India Heritage',
  heroSubheadline: 'THANJAI PERIYA KOVIL · UNESCO WORLD HERITAGE · CHOLA ARCHITECTURE',
  heroCopy: 'Explore the magnificent 1,000-year-old Thanjavur Big Temple (Thanjai Periya Kovil), iconic coastal shore temples, and authentic cultural routes across South India.',
  heroImage: '/images/thanjavur_periya_kovil.png',
  heroBanners: JSON.stringify([
    { id: 1, headline: 'Thanjavur Brihadeeswarar Temple & Great Chola Heritage', subheadline: 'THANJAI PERIYA KOVIL · UNESCO WORLD HERITAGE · CHOLA ARCHITECTURE', image: '/images/thanjavur_periya_kovil.png', copy: 'Explore the magnificent 1,000-year-old Thanjavur Big Temple (Thanjai Periya Kovil), pristine shore temples, and heritage routes across South India.' },
    { id: 2, headline: 'Serene Alleppey Backwaters & Houseboat Cruises', subheadline: 'KERALA BACKWATERS · HOUSEBOATS · PRIVATE CRUISES', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90', copy: 'Drift along palm-fringed canal waters, enjoy freshly cooked Kerala delicacies, and wake up to emerald lagoons at your own tempo.' },
    { id: 3, headline: 'Mist-Covered Hills of Munnar & Nilgiri Trails', subheadline: 'HILL STATIONS · TEA ESTATES · NATURE EXPEDITIONS', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2200&q=90', copy: 'Breathe crisp mountain air amidst sprawling tea gardens, spice plantations, and scenic Western Ghats private routes.' },
  ]),
  announcementBannerText: '✨ Custom Private Tours for 2026 Season Now Open! Plan your Tamil Nadu & Kerala road trip today.',
  announcementBannerLink: '/build-your-trip',
  enableAnnouncementBanner: true,
  termsContent: 'Welcome to You & Me – Independent Voyage. By booking a journey with us, you agree to our booking terms, deposit conditions, cancellation policies, and liability waivers.',
  privacyContent: 'You & Me – Independent Voyage values your privacy. We strictly protect your personal information, contact details, payment info, and passport data.',

  // About Page CMS Settings Defaults
  aboutHeroHeadline: 'Crafting Authentic South India Journeys',
  aboutHeroSubheadline: 'Bespoke Private Escapes · Heritage Temples · Expert Local Companions',

  // Google Maps Location Settings Defaults
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.498305719363!2d80.25268487507693!3d13.003923387313888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267e7c992769d%3A0xbbfd1d36d4f9c158!2sIndira%20Nagar%2C%20Adyar%2C%20Chennai%2C%20Tamil%20Nadu%20600020!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  officeAddress: 'Indira Nagar, Adyar, Chennai, Tamil Nadu, India - 600020',
  officePhone: '+91 9994315778',
  operationHours: 'Mon – Sat: 08:00 – 18:00 · 24/7 Dispatch',
  showGoogleMapInFooter: true,
  aboutHeroImage: '/images/our_story_fleet.jpg',
  aboutCompanyStoryTitle: 'Our Story: Independent Travel Companions',
  aboutCompanyStorySubheadline: 'Engineered for travelers seeking authentic South Indian heritage',
  aboutCompanyStoryContent: 'Founded in Chennai, You & Me – Independent Voyage was born out of a passion for authentic cultural journeys, pristine temple architecture, and serene backwater escapes. We provide unhurried, private, and deeply personal travel experiences with dedicated local driver companions tailored to your schedule.',
  aboutCompanyStoryImage: '/images/our_story_fleet.jpg',
  aboutMission: 'To celebrate and share South India’s rich culture and serene landscapes through sustainable, personalized private driver journeys.',
  aboutVision: 'To set the gold standard for authentic, driver-assisted private travel in South India.',
  aboutWhyChooseUs: JSON.stringify([
    { id: 1, title: '100% Private Driver Journeys', desc: 'No shared buses. Your private AC vehicle, expert local driver companion, and flexible pace.' },
    { id: 2, title: 'Experienced Local Companions', desc: 'Drivers with deep regional route knowledge, safety training, and attentive hospitality.' },
    { id: 3, title: 'Handpicked Boutique Hotels', desc: 'Curated heritage stays, resort villas, and luxury houseboats across Tamil Nadu & Kerala.' },
    { id: 4, title: 'Uncompromising Safety', desc: '24/7 personal customer support and insured modern fleet vehicles.' }
  ]),
  aboutTeamMembers: JSON.stringify([
    { id: 1, name: 'Sathish Kannan', role: 'Founder & Lead Travel Companion', bio: 'With over 12 years across Tamil Nadu & Kerala routes, Sathish ensures seamless private travel experiences.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85' },
  ]),
  aboutSustainabilityTitle: 'Eco-Conscious & Authentic Local Travel',
  aboutSustainabilityContent: 'We honor the land and local communities by recommending eco-conscious heritage lodges, supporting local artisans, and promoting plastic-free travel practices across South India.',
  aboutSustainabilityImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
  aboutSafetyTitle: 'Traveler Safety & 24/7 Local Support',
  aboutSafetyContent: 'Your safety is our top priority. All private vehicles undergo thorough maintenance checks and are driven by verified, licensed local companions with 24/7 dispatch support.',
  aboutCertifications: JSON.stringify([
    'Registered South India Private Tour Companion Operator',
    'TripAdvisor Travelers\' Choice Rated Partner',
    'Tamil Nadu & Kerala Heritage Route Specialist'
  ]),
  aboutAwards: JSON.stringify([
    '⭐ TripAdvisor Travelers\' Choice Award 2025',
    '🏆 South India Tourism Excellence Award 2024'
  ]),
  aboutMetaTitle: 'About Us | You & Me Independent Voyage - Custom South India Tours',
  aboutMetaDescription: 'Discover the story behind You & Me Independent Voyage. We provide unhurried private driver journeys across Tamil Nadu and Kerala.',
  aboutKeywords: 'South India private tours, custom Kerala itineraries, Tamil Nadu driver',
  aboutCtaHeadline: 'Ready to Plan Your Custom South India Journey?',
  aboutCtaSubheadline: 'Speak with our travel specialists to receive a custom itinerary proposal.',
  aboutCtaButtonText: 'Request Custom Itinerary Quote',

  // Lead Magnet eBook PDF Settings
  leadMagnetTitle: 'Download Free: Ultimate South India Travel Guide',
  leadMagnetSubtext: 'Route Maps · Best Season Charts · Boutique Hotel Price Breakdown',
  leadMagnetButtonText: 'Get Free eBook PDF',
  leadMagnetPdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',

  // Home Page Signature Itinerary CMS
  homeItineraryHeadline: '10-day classic South India explorer',
  homeItineraryCopy: 'One signature journey. Tamil Nadu temples, Chettinad heritage, Munnar tea hills, and Kerala backwaters in seamless sequence.',
  homeItineraries: JSON.stringify([
    {
      dayNumber: '01',
      daysLabel: 'Day 01',
      title: 'Arrival in Chennai & Historic City Walk',
      description: 'Welcome to South India. Meet your private driver companion at Chennai airport and check into your heritage hotel.',
      duration: '45 min · 20 km',
      mealPlan: 'Dinner',
      accommodation: 'Taj Connemara',
      accommodationSub: 'Heritage Hotel · Chennai',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    },
  ]),
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
];

let inMemorySettingsCache: any = null;

export async function GET() {
  try {
    const dbPromise = prisma.siteSettings.findFirst();
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
    const settings = await Promise.race([dbPromise, timeoutPromise]);

    const merged = {
      ...DEFAULT_SETTINGS,
      ...(settings || {}),
      ...(inMemorySettingsCache || {}),
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
          prismaUpdateData[field] = parseFloat(updateData[field]);
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
        const existing = await prisma.siteSettings.findFirst();
        if (existing) {
          // Preserve existing logo and favicon if not provided in request or empty
          if (!prismaUpdateData.siteLogo && existing.siteLogo) {
            prismaUpdateData.siteLogo = existing.siteLogo;
          }
          if (!prismaUpdateData.siteFavicon && existing.siteFavicon) {
            prismaUpdateData.siteFavicon = existing.siteFavicon;
          }
          return await prisma.siteSettings.update({
            where: { id: existing.id },
            data: prismaUpdateData,
          });
        } else {
          return await prisma.siteSettings.create({
            data: prismaUpdateData,
          });
        }
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 12000));
      settings = await Promise.race([dbPromise, timeoutPromise]);
    } catch (e) {
      console.warn('DB settings update failed or timed out:', e);
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
