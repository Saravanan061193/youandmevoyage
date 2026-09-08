import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Discovery Safaris Namibia database...');

  // Reset existing data
  await prisma.safari.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Create Site Settings
  await prisma.siteSettings.create({
    data: {
      heroHeadline: 'Experience the raw majesty of Namibia',
      heroSubheadline: 'Private journeys · Wild places · 2004—2026',
      heroCopy: 'Bespoke private safaris, luxury tented camps, and wildlife expeditions engineered for international travelers.',
      heroImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1920&q=85',
      weatherText: 'Etosha National Park: 28°C Sunny',
      whatsappNumber: '+264 81 123 4567',
      usdToEur: 0.92,
      usdToGbp: 0.78,
      usdToNad: 18.5,
      adminPasscode: 'admin123',
    },
  });

  // Create Safaris
  const safari1 = await prisma.safari.create({
    data: {
      title: 'Classic Namibian Explorer',
      slug: 'classic-namibian-explorer',
      priceUSD: 3850,
      days: 10,
      nights: 9,
      category: 'Private',
      region: 'Central',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85',
      route: 'Windhoek → Sossusvlei → Swakopmund → Etosha',
      accommodation: 'Luxury Lodges & Tented Camps',
      description: 'From the iconic red dunes of Sossusvlei to the vast salt pans and game-rich waterholes of Etosha, experience Namibia’s ultimate signature safari.',
      inclusions: JSON.stringify([
        'Private 4x4 safari vehicle & expert guide',
        'Luxury accommodation with full board',
        'All park fees, transfers & activities',
        'Airport meet-and-greet in Windhoek',
      ]),
      exclusions: JSON.stringify([
        'International flights & travel insurance',
        'Visa fees and personal purchases',
        'Optional scenic flights',
        'Guide gratuities',
      ]),
      featured: true,
    },
  });

  await prisma.safari.create({
    data: {
      title: 'Desert & Dunes Private Escape',
      slug: 'desert-and-dunes-private-escape',
      priceUSD: 4200,
      days: 7,
      nights: 6,
      category: 'Luxury Tented',
      region: 'South',
      badge: 'Luxury',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85',
      route: 'Windhoek → Sossusvlei → Damaraland',
      accommodation: 'Boutique Desert Retreats',
      description: 'An intimate journey focused on southern Namibia’s mesmerizing landscapes, ancient desert geology, and luxury eco-villas.',
      inclusions: JSON.stringify([
        'Private fly-in or 4x4 transport',
        'Boutique desert retreat lodging',
        'Stargazing & wine tasting dinners',
      ]),
      exclusions: JSON.stringify([
        'International airfare',
        'Gratuities & personal items',
      ]),
      featured: true,
    },
  });

  await prisma.safari.create({
    data: {
      title: 'Etosha Wildlife Immersion',
      slug: 'etosha-wildlife-immersion',
      priceUSD: 2950,
      days: 8,
      nights: 7,
      category: 'Adventure',
      region: 'North',
      badge: 'Wildlife',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85',
      route: 'Windhoek → Etosha → Damaraland → Windhoek',
      accommodation: 'Safari Lodges & Private Reserves',
      description: 'Dedicated wildlife tracking expedition through northern Namibia. Spot lions, desert-adapted elephants, rhinos, and hundreds of bird species.',
      inclusions: JSON.stringify([
        'Custom pop-top 4x4 safari cruiser',
        'Professional wildlife tracker & guide',
        'All game drives and park permits',
      ]),
      exclusions: JSON.stringify([
        'International flights',
        'Personal insurance',
      ]),
      featured: true,
    },
  });

  // Create Itinerary Items for Classic Namibian Explorer
  await prisma.itineraryItem.createMany({
    data: [
      {
        safariId: safari1.id,
        dayNumber: '01',
        daysLabel: 'Day 01',
        title: 'Arrival in Windhoek & Sunset Game Drive',
        description: 'Welcome to Namibia. Meet your private guide, settle into your design-led lodge, then watch the city turn amber from a quiet reserve.',
        duration: '45 min · 35 km',
        mealPlan: 'Dinner',
        accommodation: 'Habitas Windhoek',
        location: 'Windhoek',
        image: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=1200&q=85',
        order: 1,
      },
      {
        safariId: safari1.id,
        dayNumber: '02',
        daysLabel: 'Days 02–03',
        title: 'Sossusvlei Dunes & Deadvlei 4x4 Excursion',
        description: 'Journey south into the ancient Namib Desert. Climb Dune 45 at sunrise, walk among the ancient camel thorn trees of Deadvlei, and explore Sesriem Canyon.',
        duration: '4.5 hrs · 350 km',
        mealPlan: 'Full Board',
        accommodation: 'Little Kulala Villa',
        location: 'Sossusvlei',
        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
        order: 2,
      },
      {
        safariId: safari1.id,
        dayNumber: '03',
        daysLabel: 'Days 04–05',
        title: 'Coastal Swakopmund & Living Desert Tour',
        description: 'Traverse the desert to the coastal town of Swakopmund. Enjoy fresh oysters, a marine cataman cruise in Walvis Bay, and a living desert gecko hunt.',
        duration: '4 hrs · 320 km',
        mealPlan: 'Breakfast & Lunch',
        accommodation: 'Strand Hotel Swakopmund',
        location: 'Swakopmund',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
        order: 3,
      },
      {
        safariId: safari1.id,
        dayNumber: '04',
        daysLabel: 'Days 06–08',
        title: 'Etosha National Park Big Five Safari',
        description: 'Enter Etosha National Park for three full days of premier game viewing around floodlit waterholes teeming with lions, elephants, and black rhinos.',
        duration: '5 hrs · 490 km',
        mealPlan: 'Full Board',
        accommodation: 'Ongava Lodge',
        location: 'Etosha',
        image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=85',
        order: 4,
      },
      {
        safariId: safari1.id,
        dayNumber: '05',
        daysLabel: 'Days 09–10',
        title: 'Damaraland Rock Art & Return',
        description: 'Discover Twyfelfontein UNESCO rock engravings and track desert-adapted elephants before returning to Windhoek for international departure.',
        duration: '4 hrs · 380 km',
        mealPlan: 'Breakfast & Farewell Dinner',
        accommodation: 'Okapuka Safari Lodge',
        location: 'Damaraland',
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85',
        order: 5,
      },
    ],
  });

  // Create Destinations
  await prisma.destination.createMany({
    data: [
      {
        title: 'Sossusvlei',
        subtitle: 'Red dunes at first light',
        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
        region: 'South',
        size: 'large',
        description: 'Home to the world’s highest sand dunes and the famous stark white clay pan of Deadvlei.',
        order: 1,
      },
      {
        title: 'Etosha',
        subtitle: 'Wildlife, waterholes & wide skies',
        image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=85',
        region: 'North',
        size: 'tall',
        description: 'One of Africa’s greatest game reserves dominated by a massive salt pan visible from space.',
        order: 2,
      },
      {
        title: 'Swakopmund',
        subtitle: 'Atlantic air & living desert',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
        region: 'Central',
        size: 'short',
        description: 'German colonial charm meets ocean breeze and thrilling desert adventures.',
        order: 3,
      },
      {
        title: 'Skeleton Coast',
        subtitle: 'The wild edge of the continent',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85',
        region: 'North',
        size: 'short',
        description: 'Hauntingly beautiful coastline scattered with shipwrecks and seal colonies.',
        order: 4,
      },
      {
        title: 'Damaraland',
        subtitle: 'Ancient rock art & desert elephants',
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85',
        region: 'North',
        size: 'tall',
        description: 'Rugged granitic landscapes where desert lions and elephants roam free.',
        order: 5,
      },
    ],
  });

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        author: 'Anna & Lukas M.',
        country: 'Germany',
        countryFlag: 'DE',
        rating: 5,
        text: 'Every detail felt considered. Our guide knew when to talk, when to pause, and exactly where the light would land.',
        verified: true,
      },
      {
        author: 'Michael R.',
        country: 'USA',
        countryFlag: 'US',
        rating: 5,
        text: 'This was not a checklist trip. It was beautifully paced, deeply personal, and far beyond what we imagined.',
        verified: true,
      },
      {
        author: 'Charlotte P.',
        country: 'UK',
        countryFlag: 'GB',
        rating: 5,
        text: 'The camps, the landscapes, the service — Discovery Safaris made Namibia feel like our own secret.',
        verified: true,
      },
      {
        author: 'Claire D.',
        country: 'France',
        countryFlag: 'FR',
        rating: 5,
        text: 'A rare combination of precision and warmth. We felt completely looked after from landing to take-off.',
        verified: true,
      },
    ],
  });

  // Create Blog Posts
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'The Ultimate Guide to Planning a Private Namibia Safari in 2026',
        slug: 'ultimate-guide-planning-namibia-safari-2026',
        excerpt: 'Everything you need to know about weather windows, fly-in options vs custom 4x4 overland expeditions, and reserving luxury tented camps.',
        content: `Namibia is unlike anywhere else on earth. A country defined by ancient sand dunes, vast salt pans, and desert-adapted wildlife that thrives in one of the planet's most dramatic landscapes.

### When is the Best Time to Visit Namibia?
The dry season between **May and October** offers premier wildlife viewing around waterholes in Etosha National Park. Clear blue skies, comfortable daytime temperatures, and minimal humidity make this ideal for tracking big game and desert elephants.

### 4x4 Guided vs Fly-In Safaris
- **Custom Pop-top 4x4 Safaris:** Perfect for slow travel lovers who want to absorb the changing red dunes of Sossusvlei, granite boulders of Damaraland, and Atlantic coastline of Swakopmund.
- **Private Fly-In Safaris:** Ideal for travelers short on time who want to maximize game drives and stay at remote boutique villas.

### Must-Visit Safari Destinations in 2026
1. **Sossusvlei & Deadvlei:** Climb Dune 45 at first light and walk among 900-year-old skeleton trees.
2. **Etosha National Park:** Spend sunset hours around floodlit waterholes watching rhino and lion pride interactions.
3. **Damaraland:** Track free-roaming desert-adapted elephants through granitic dry riverbeds.`,
        coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85',
        author: 'Dr. Johan van Zyl',
        authorRole: 'Head Wildlife Ecologist',
        category: 'Travel Guide',
        readTime: '6 min read',
        metaTitle: 'The Ultimate Guide to Planning a Namibia Safari in 2026 | Discovery Safaris',
        metaDescription: 'Expert guide to planning private Namibia safaris, weather seasons, fly-in transfers, and top wildlife luxury lodges in 2026.',
        published: true,
      },
      {
        title: 'Top 10 Wildlife Spotting Tips for Etosha National Park',
        slug: 'top-10-wildlife-spotting-tips-etosha-national-park',
        excerpt: 'Discover secret waterholes, optimal game drive timings, and photographer insider tricks for sighting lions, cheetahs, and black rhinos.',
        content: `Etosha National Park is centered around a massive salt pan visible from space. Understanding animal movements around the park's network of natural and solar-powered waterholes is key to a successful safari.

### 1. Master Waterhole Etiquette & Timing
Wild animals gather around waterholes early in the morning and during the golden hour before sunset. Midday heat drives predators to rest under acacia shade.

### 2. Okaukuejo Night Wildlife Viewing
The floodlit waterhole at Okaukuejo camp is internationally famous for nightly visits by endangered black rhinos, lion prides, and giraffe herds.

### 3. Essential Gear Checklist
- High-grade 8x42 or 10x42 binoculars
- DSLR camera with 100-400mm telephoto lens
- Polarized sunglasses and wide-brimmed safari hat`,
        coverImage: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=1200&q=85',
        author: 'Elena Rostova',
        authorRole: 'Senior Safari Guide',
        category: 'Wildlife',
        readTime: '4 min read',
        metaTitle: '10 Expert Wildlife Spotting Tips for Etosha | Discovery Safaris Namibia',
        metaDescription: 'Insider tips for spotting black rhinos, lions, and leopards in Etosha National Park with expert guide advice.',
        published: true,
      },
      {
        title: 'Sossusvlei Dune Photography: Sunrise & Golden Hour Masterclass',
        slug: 'sossusvlei-dune-photography-sunrise-golden-hour',
        excerpt: 'How to capture contrast shadows, deep orange sand ripples, and stark camel thorn trees in Deadvlei with professional camera techniques.',
        content: `Sossusvlei features some of the highest sand dunes in the world. As the sun rises over the Namib-Naukluft Park, one side of each dune glows intense crimson while the other remains cast in indigo shadow.

### Camera Settings for Sand Dunes
- **Aperture:** f/8 to f/11 for sharp corner-to-corner focus across dune ridges.
- **ISO:** Keep at base 100 for maximum dynamic range.
- **Filter:** Use a circular polarizer to eliminate haze and deepen desert skies.

### Photographing Deadvlei
Arrive at Deadvlei right when park gates open at dawn. The white clay pan, dark burnt trees, and towering red dune background create a surreal high-contrast scene.`,
        coverImage: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
        author: 'Marcus Vance',
        authorRole: 'Expedition Photographer',
        category: 'Photography',
        readTime: '5 min read',
        metaTitle: 'Sossusvlei Photography Masterclass & Sunrise Tips | Discovery Safaris',
        metaDescription: 'Learn how to shoot breathtaking photos of Sossusvlei dunes and Deadvlei with professional camera settings and light timing.',
        published: true,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
