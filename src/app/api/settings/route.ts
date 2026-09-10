import { NextResponse } from 'next/server';
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

  cloudinaryCloudName: 'youandmevoyage',
  cloudinaryApiKey: '',
  cloudinaryApiSecret: '',
  cloudinaryUploadPreset: 'voyage_uploads',
  enableCloudinary: false,

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
  showGoogleMapInFooter: true,
  aboutHeroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=85',
  aboutCompanyStoryTitle: 'Our Story: Independent Travel Companions',
  aboutCompanyStorySubheadline: 'Engineered for travelers seeking authentic South Indian heritage',
  aboutCompanyStoryContent: 'Founded in Chennai, You & Me – Independent Voyage was born out of a passion for authentic cultural journeys, pristine temple architecture, and serene backwater escapes. We provide unhurried, private, and deeply personal travel experiences with dedicated local driver companions tailored to your schedule.',
  aboutCompanyStoryImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
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
      tripadvisorUrl,
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
    if (tripadvisorUrl !== undefined || body.tripAdvisorUrl !== undefined) updateData.tripadvisorUrl = tripadvisorUrl || body.tripAdvisorUrl;
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
