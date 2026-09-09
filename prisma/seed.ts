import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding You & Me – Independent Voyage database...');

  // Reset existing data
  await prisma.safari.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.blogPost.deleteMany();

  // Create Site Settings
  await prisma.siteSettings.create({
    data: {
      siteTitle: 'You & Me – Independent Voyage',
      siteLogo: '',
      contactEmail: 'info@youandmevoyage.com',
      whatsappNumber: '+91 98765 43210',
      address: 'Chennai, Tamil Nadu, India',
      weatherText: 'Tamil Nadu & Kerala: 28°C Pleasant',
      adminPasscode: 'admin123',
      usdToEur: 0.92,
      usdToGbp: 0.78,
      usdToNad: 83.5,
      heroHeadline: 'Travel South India Your Way',
      heroSubheadline: 'Private journeys · Authentic experiences · Experienced local companions',
      heroCopy: 'Bespoke private journeys, heritage accommodations, and driver-assisted road trips engineered for international and discerning travellers.',
      heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85',
      announcementBannerText: '✨ Custom Private Journeys for 2026 Now Open! Plan your personalized Tamil Nadu & Kerala road trip today.',
      announcementBannerLink: '/build-your-trip',
      enableAnnouncementBanner: true,
      termsContent: 'Welcome to You & Me – Independent Voyage. By booking a journey with us, you agree to our booking terms, deposit conditions, cancellation policies, and liability waivers. All private journeys include dedicated vehicle, experienced local driver companion, and flexible itinerary planning.',
      privacyContent: 'You & Me – Independent Voyage values your privacy. We strictly protect your personal information, contact details, payment info, and passport data required for bookings. We do not sell or share your data with third parties.',
    },
  });

  // Create Journeys (stored in Safari model)
  const journey1 = await prisma.safari.create({
    data: {
      title: 'Grand Tamil Nadu Temple & Heritage Trail',
      slug: 'grand-tamil-nadu-temple-heritage-trail',
      priceUSD: 1450,
      days: 10,
      nights: 9,
      category: 'Tamil Nadu Journeys',
      region: 'Tamil Nadu',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      route: 'Chennai → Mahabalipuram → Pondicherry → Thanjavur → Madurai → Kanyakumari',
      startingLocation: 'Chennai',
      endingLocation: 'Kanyakumari / Trivandrum',
      bestTimeToTravel: 'October to March',
      accommodation: 'Boutique Heritage Hotels & Palace Resorts',
      description: 'Journey through centuries of Dravidian architecture, UNESCO World Heritage temples, French colonial quarters, and vibrant cultural heartlands of South India.',
      inclusions: JSON.stringify([
        'Private AC vehicle with dedicated professional driver companion',
        'Handpicked heritage hotel accommodations with daily breakfast',
        'Local expert guides at UNESCO heritage sites & temples',
        '24/7 personal trip assistance and route flexibility',
        'Fuel, tolls, parking, and driver expenses included',
      ]),
      exclusions: JSON.stringify([
        'International and domestic flight tickets',
        'Personal shopping, laundry, and guide gratuities',
        'Camera fees at select monument sites',
        'Travel insurance',
      ]),
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
      ]),
      featured: true,
    },
  });

  const journey2 = await prisma.safari.create({
    data: {
      title: 'Kerala Backwaters & Mist-Covered Hills',
      slug: 'kerala-backwaters-mist-covered-hills',
      priceUSD: 1280,
      days: 7,
      nights: 6,
      category: 'Kerala Journeys',
      region: 'Kerala',
      badge: 'Nature & Wellness',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
      route: 'Kochi → Munnar → Thekkady → Alleppey → Kochi',
      startingLocation: 'Kochi (Cochin)',
      endingLocation: 'Kochi (Cochin)',
      bestTimeToTravel: 'September to April',
      accommodation: 'Luxury Tea Bungalows & Private Houseboat',
      description: 'Relax in emerald tea plantations, aroma-rich spice hills, and serene palm-fringed backwater lagoons on a private luxury houseboat.',
      inclusions: JSON.stringify([
        'Private premium sedan/SUV with experienced local driver',
        'Exclusive luxury houseboat cruise in Alleppey with full board',
        'Tea estate walks & spice plantation guided tour',
        'Daily breakfast at luxury hillside resorts',
      ]),
      exclusions: JSON.stringify([
        'Airfare & visa fees',
        'Ayurvedic treatment packages (optional add-on)',
        'Gratuities for driver and staff',
      ]),
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
      ]),
      featured: true,
    },
  });

  const journey3 = await prisma.safari.create({
    data: {
      title: 'The Ultimate South India Odyssey: Tamil Nadu & Kerala',
      slug: 'ultimate-south-india-odyssey-tamil-nadu-kerala',
      priceUSD: 2150,
      days: 14,
      nights: 13,
      category: 'South India Journeys',
      region: 'South India',
      badge: 'Private Custom',
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
      route: 'Chennai → Pondicherry → Tanjore → Chettinad → Madurai → Munnar → Alleppey → Fort Kochi',
      startingLocation: 'Chennai',
      endingLocation: 'Kochi',
      bestTimeToTravel: 'October to May',
      accommodation: 'Heritage Mansions, Luxury Lodges & Houseboats',
      description: 'The definitive 14-day journey combining ancient Chola architecture, Chettinad culinary feasts, majestic Western Ghats hill country, and tranquil backwater cruises.',
      inclusions: JSON.stringify([
        'Dedicated chauffeur-driven vehicle throughout the entire 14 days',
        'Private luxury houseboat night with chef-curated meals',
        'Chettinad heritage mansion stay with home-style cooking class',
        'All temple entry passes & expert local historians',
      ]),
      exclusions: JSON.stringify([
        'International flights',
        'Personal spending & alcoholic beverages',
      ]),
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      ]),
      featured: true,
    },
  });

  const journey4 = await prisma.safari.create({
    data: {
      title: 'Chettinad Heritage & Culinary Expedition',
      slug: 'chettinad-heritage-culinary-expedition',
      priceUSD: 890,
      days: 5,
      nights: 4,
      category: 'Food & Culinary Journeys',
      region: 'Tamil Nadu',
      badge: 'Cultural',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
      route: 'Trichy → Karaikudi (Chettinad) → Madurai',
      startingLocation: 'Trichy',
      endingLocation: 'Madurai',
      bestTimeToTravel: 'Year round',
      accommodation: 'Restored 19th-Century Chettinad Mansions',
      description: 'Immerse yourself in legendary Chettinad architecture, antique tile factories, handloom silk weaving, and fiery authentic Chettinad gastronomy.',
      inclusions: JSON.stringify([
        'Private AC vehicle with expert driver',
        'Stay at restored ancestral palatial mansion',
        'Chettinad cooking demonstration & banana leaf feast',
        'Antique market walk & tile artisan workshop visit',
      ]),
      exclusions: JSON.stringify([
        'Flights to Trichy / from Madurai',
        'Personal gratuities',
      ]),
      featured: true,
    },
  });

  // Create Itinerary Items for Grand Tamil Nadu Temple & Heritage Trail
  await prisma.itineraryItem.createMany({
    data: [
      {
        safariId: journey1.id,
        dayNumber: '01',
        daysLabel: 'Day 01',
        title: 'Arrival in Chennai & Coastal Promenade Walk',
        description: 'Welcome to South India! Meet your private driver companion at Chennai airport. Check in to your coastal hotel, then enjoy a sunset stroll along Marina Beach and visit historic San Thome Basilica.',
        duration: '3 hrs · 25 km',
        mealPlan: 'Welcome Dinner',
        accommodation: 'Taj Connemara / Heritage Hotel',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        order: 1,
      },
      {
        safariId: journey1.id,
        dayNumber: '02',
        daysLabel: 'Day 02',
        title: 'Mahabalipuram UNESCO Rock-Cut Monuments',
        description: 'Drive along the Scenic East Coast Road to Mahabalipuram. Explore 7th-century Shore Temple, Arjuna’s Penance rock relief, and Pancha Rathas with an expert local guide.',
        duration: '2.5 hrs · 60 km',
        mealPlan: 'Breakfast & Seafood Lunch',
        accommodation: 'Radisson Blu Resort Temple Bay',
        location: 'Mahabalipuram',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        order: 2,
      },
      {
        safariId: journey1.id,
        dayNumber: '03',
        daysLabel: 'Days 03–04',
        title: 'French Quarters & Sacred Spaces of Pondicherry',
        description: 'Drive south to Pondicherry. Wander mustard-yellow colonial streets, visit Sri Aurobindo Ashram, take a trip to experimental township Auroville, and dine at French-Tamil bistro cafes.',
        duration: '2 hrs · 100 km',
        mealPlan: 'Breakfast',
        accommodation: 'Palais de Mahe / Maison Perumal',
        location: 'Pondicherry',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=900&q=85',
        order: 3,
      },
      {
        safariId: journey1.id,
        dayNumber: '04',
        daysLabel: 'Days 05–06',
        title: 'Great Living Chola Temples of Thanjavur',
        description: 'Travel inland to Thanjavur, the heartland of Chola dynasty art. Marvel at the 1,000-year-old Brihadeeswarar Temple (Big Temple), Royal Palace Museum, and bronze metal casting workshops.',
        duration: '4 hrs · 170 km',
        mealPlan: 'Breakfast & Traditional South Indian Thali',
        accommodation: 'Svatma Heritage Resort Thanjavur',
        location: 'Thanjavur',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=85',
        order: 4,
      },
      {
        safariId: journey1.id,
        dayNumber: '05',
        daysLabel: 'Days 07–10',
        title: 'Madurai Meenakshi Temple & Coastal Kanyakumari',
        description: 'Discover the ancient temple city of Madurai. Witness the evening night ceremony at Meenakshi Amman Temple. Continue to Kanyakumari where three oceans meet for a breathtaking sunrise.',
        duration: '4 hrs · 240 km',
        mealPlan: 'Breakfast & Farewell Dinner',
        accommodation: 'Heritage Madurai & Annai Resorts',
        location: 'Madurai & Kanyakumari',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=85',
        order: 5,
      },
    ],
  });

  // Create Destinations
  await prisma.destination.createMany({
    data: [
      {
        title: 'Chennai',
        slug: 'chennai',
        subtitle: 'Gateway to South India & Classical Arts',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        region: 'Tamil Nadu',
        size: 'large',
        description: 'A vibrant metropolis blending centuries-old Dravidian temples, colonial seaside architecture, classical Bharatanatyam dance, and renowned culinary streets.',
        highlights: JSON.stringify(['Kapaleeshwarar Temple', 'Marina Beach Walk', 'San Thome Basilica', 'Mylapore Heritage Walk']),
        experiences: JSON.stringify(['Filter coffee tasting', 'Temple bell ceremonies', 'Silk saree shopping in T. Nagar']),
        duration: '2 Days',
        order: 1,
      },
      {
        title: 'Mahabalipuram',
        slug: 'mahabalipuram',
        subtitle: 'Ancient Shore Temples & Rock Carvings',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
        region: 'Tamil Nadu',
        size: 'tall',
        description: 'A coastal UNESCO World Heritage town famous for 7th-century Pallava cave temples, monolith rathas, and beachside stone carving studios.',
        highlights: JSON.stringify(['Shore Temple', 'Arjuna’s Penance', 'Pancha Rathas', 'Krishna’s Butterball']),
        experiences: JSON.stringify(['Stone sculpting workshop', 'Coastal seafood dining', 'Beach sunrise walk']),
        duration: '1-2 Days',
        order: 2,
      },
      {
        title: 'Pondicherry',
        slug: 'pondicherry',
        subtitle: 'French Boulevards & Quiet Coastal Charm',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=900&q=85',
        region: 'Tamil Nadu',
        size: 'short',
        description: 'Cobblestone streets, French colonial villas, bougainvillea-draped cafes, and spiritual tranquility near the Bay of Bengal.',
        highlights: JSON.stringify(['White Town French Quarter', 'Promenade Beach', 'Auroville Matrimandir', 'Sri Aurobindo Ashram']),
        experiences: JSON.stringify(['Cycle tour of French Quarter', 'Artisanal cafe hopping', 'Pottery workshops']),
        duration: '2 Days',
        order: 3,
      },
      {
        title: 'Madurai',
        slug: 'madurai',
        subtitle: 'The Soul of Tamil Culture & Meenakshi Temple',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=85',
        region: 'Tamil Nadu',
        size: 'short',
        description: 'One of the oldest continuously inhabited cities in the world, renowned for the soaring gopurams of Meenakshi Amman Temple and bustling night markets.',
        highlights: JSON.stringify(['Meenakshi Amman Temple', 'Thirumalai Nayakar Palace', 'Gandhi Memorial Museum']),
        experiences: JSON.stringify(['Evening temple chariot ceremony', 'Jigarthanda street drink', 'Late night food walks']),
        duration: '2 Days',
        order: 4,
      },
      {
        title: 'Munnar',
        slug: 'munnar',
        subtitle: 'Rolling Tea Gardens & Cool Mountain Air',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
        region: 'Kerala',
        size: 'tall',
        description: 'Tucked in the Western Ghats mountain range, Munnar features misty green valleys, endless tea estates, and endangered Nilgiri Tahr mountain goats.',
        highlights: JSON.stringify(['Tea Museum & Factory', 'Eravikulam National Park', 'Mattupetty Dam', 'Anamudi Peak Views']),
        experiences: JSON.stringify(['Tea plucking with locals', 'Spice estate trek', 'Cozy bungalow stays']),
        duration: '2-3 Days',
        order: 5,
      },
      {
        title: 'Alleppey',
        slug: 'alleppey',
        subtitle: 'Venice of the East & Luxury Houseboats',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85',
        region: 'Kerala',
        size: 'short',
        description: 'Glide gently through quiet palm-shaded canals, paddy fields, and traditional village life aboard your private air-conditioned kettuvallam houseboat.',
        highlights: JSON.stringify(['Punnamada Lake', 'Backwater Canals', 'Vembanad Lake', 'Marari Beach']),
        experiences: JSON.stringify(['Private houseboat night stay', 'Fresh Kuttanad fish curry', 'Canoe canal ride']),
        duration: '1-2 Days',
        order: 6,
      },
    ],
  });

  // Create Experiences
  await prisma.experience.createMany({
    data: [
      {
        title: 'Temple Architecture & Ancient Heritage',
        slug: 'temple-architecture-ancient-heritage',
        subtitle: 'Soaring Dravidian Gopurams & UNESCO Monuments',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        category: 'Heritage',
        description: 'Explore thousands of years of stone carving mastery, Chola bronzes, and active living temple rituals with knowledgeable local historians.',
        highlights: JSON.stringify(['UNESCO World Heritage site access', 'Private guided morning & evening walks', 'Architectural stone carving insights']),
        order: 1,
      },
      {
        title: 'South Indian Food & Culinary Trails',
        slug: 'south-indian-food-culinary-trails',
        subtitle: 'From Chettinad Feasts to Coastal Seafood',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
        category: 'Food',
        description: 'Savor authentic banana leaf thalis, aromatic Chettinad spice blends, fresh coconut sea curries, and iconic brass filter coffee.',
        highlights: JSON.stringify(['Home-style cooking classes with local hosts', 'Street food walking tours', 'Spice market exploration']),
        order: 2,
      },
      {
        title: 'Kerala Backwater Private Houseboat Cruises',
        slug: 'kerala-backwater-houseboat-cruises',
        subtitle: 'Tranquil Waterways & Village Lagoons',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
        category: 'Nature',
        description: 'Unwind on custom luxury houseboats with dedicated private chef, navigating serene mirror-like canals away from crowded tourist routes.',
        highlights: JSON.stringify(['Private chef preparing local delicacies', 'Sunset over Vembanad lake', 'Quiet country canoe excursions']),
        order: 3,
      },
      {
        title: 'Local Village & Traditional Arts Encounters',
        slug: 'local-village-traditional-arts',
        subtitle: 'Weavers, Potters & Classical Dancers',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
        category: 'Culture',
        description: 'Engage directly with Kanchipuram silk weavers, Athangudi handmade tile artisans, and traditional Kathakali or Bharatanatyam performers.',
        highlights: JSON.stringify(['Artisan workshop visits', 'Private Kathakali makeup & performance', 'Silk loom demonstrations']),
        order: 4,
      },
    ],
  });

  // Create Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'Meenakshi Temple Gopuram at Dusk',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        category: 'Tamil Nadu',
        location: 'Madurai',
        order: 1,
      },
      {
        title: 'French Quarter Colonial Streets',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
        category: 'Culture',
        location: 'Pondicherry',
        order: 2,
      },
      {
        title: 'Alleppey Backwaters Houseboat',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        category: 'Kerala',
        location: 'Alleppey',
        order: 3,
      },
      {
        title: 'Traditional South Indian Thali Feast',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
        category: 'Food',
        location: 'Chettinad',
        order: 4,
      },
      {
        title: 'Shore Temple Sunset View',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        category: 'Temples',
        location: 'Mahabalipuram',
        order: 5,
      },
      {
        title: 'Munnar Misty Tea Gardens',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
        category: 'Nature',
        location: 'Munnar',
        order: 6,
      },
    ],
  });

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        author: 'Robert & Eleanor S.',
        country: 'United Kingdom',
        countryFlag: '🇬🇧',
        rating: 5,
        text: 'Traveling South India with You & Me Independant Voyage was the highlight of our year. Sathish Kannan was so knowledgeable, calm, and attentive to every detail. We felt safe and cared for throughout Tamil Nadu and Kerala.',
        travelType: 'Custom 12-Day Couple Journey',
        verified: true,
      },
      {
        author: 'Marc & Sophie L.',
        country: 'France',
        countryFlag: '🇫🇷',
        rating: 5,
        text: 'Sathish from You & Me speaks fluent French and English! From Pondicherry to the tea hills of Munnar, the journey was smooth, safe, and rich in local culture.',
        travelType: 'Custom Family Journey',
        verified: true,
      },
      {
        author: 'David & Clare K.',
        country: 'USA',
        countryFlag: '🇺🇸',
        rating: 5,
        text: 'The Chettinad food trail and private houseboat in Alleppey organized by You & Me Independant Voyage were top notch! Sathish customized every stop to our tempo. Highly recommended on TripAdvisor!',
        travelType: 'Private Custom Cultural Tour',
        verified: true,
      },
      {
        author: 'Priya & Rahul M.',
        country: 'India',
        countryFlag: '🇮🇳',
        rating: 5,
        text: 'Immaculate AC vehicle, expert driver Sathish who knew every hidden gem and local eatery in South India. Top 5-star experience from Chennai!',
        travelType: 'Kerala & Tamil Nadu Road Trip',
        verified: true,
      },
    ],
  });

  // Create Blog Posts (Travel Journal)
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Best Places to Visit in Tamil Nadu: A Curated Road Trip Guide',
        slug: 'best-places-to-visit-in-tamil-nadu-road-trip-guide',
        excerpt: 'Discover UNESCO temples, coastal French enclaves, heritage Chettinad mansions, and spiritual cities across Tamil Nadu.',
        content: `Tamil Nadu is one of India's richest cultural states, offering thousands of years of continuous temple heritage, coastal charm, and culinary masterpieces.

### 1. Mahabalipuram: Coastal Stone Sculptures
Located just 60 km south of Chennai on the East Coast Road, Mahabalipuram is home to 7th-century Pallava cave temples and the iconic Shore Temple standing right at the ocean edge.

### 2. Pondicherry: French Quarter & Boulevard Vibes
Wander streets lined with mustard-yellow colonial villas, enjoy fresh pastries, and visit Auroville for a serene spiritual retreat.

### 3. Thanjavur: The Great Chola Living Temple
The 1,000-year-old Brihadeeswarar Temple in Thanjavur is an architectural miracle built entirely of granite blocks with a 81-ton apex dome.

### 4. Madurai: Meenakshi Amman Temple
Madurai is the spiritual heart of Tamil Nadu. The soaring gopurams of Meenakshi Temple are covered in thousands of colorful mythological statues.`,
        coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
        author: 'Arun Kumar',
        authorRole: 'Senior South India Travel Companion',
        category: 'Travel Guide',
        readTime: '6 min read',
        metaTitle: 'Best Places to Visit in Tamil Nadu | You & Me Independent Voyage',
        metaDescription: 'Curated guide to exploring Mahabalipuram, Pondicherry, Thanjavur, and Madurai on a private driver-assisted road trip.',
        published: true,
      },
      {
        title: 'The Ultimate 10-Day Tamil Nadu & Kerala Private Itinerary',
        slug: 'ultimate-10-day-tamil-nadu-kerala-itinerary',
        excerpt: 'Combine temple majesty with emerald tea hills and serene backwater houseboats on this seamlessly planned private route.',
        content: `Combining Tamil Nadu's vibrant culture with Kerala's tranquil backwaters creates the ultimate South India holiday.

### Suggested Route Overview
- **Days 1–2:** Chennai to Mahabalipuram & Pondicherry
- **Days 3–4:** Thanjavur & Chettinad Mansions
- **Days 5–6:** Madurai Meenakshi Temple
- **Days 7–8:** Scenic climb into Munnar Tea Gardens
- **Days 9–10:** Alleppey Houseboat & Departure from Kochi

### Why Travel with a Private Local Driver?
Navigating South India's scenic state highways, temple towns, and hill roads is stress-free when assisted by a courteous local driver companion who knows the best tea stops, clean rest areas, and scenic viewpoints along the way.`,
        coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        author: 'Meera Nair',
        authorRole: 'Itinerary Planner',
        category: 'Itinerary',
        readTime: '7 min read',
        metaTitle: '10 Day Tamil Nadu & Kerala Itinerary | You & Me Voyage',
        metaDescription: 'Step-by-step 10 day itinerary for private travel across Tamil Nadu and Kerala with dedicated driver and handpicked heritage stays.',
        published: true,
      },
      {
        title: 'A Traveler Guide to Authentic South Indian Food Traditions',
        slug: 'traveler-guide-authentic-south-indian-food-traditions',
        excerpt: 'From Chettinad spice blends to Kerala banana leaf feasts and brass filter coffee rituals.',
        content: `Food in South India is deeply regional, fresh, and deeply connected to local spice harvests and coastal ingredients.

### Highlights of South Indian Culinary Journeys
- **Chettinad Cuisine:** Renowned for sun-dried spices, black pepper, star anise, and slow-cooked mutton & chicken curries.
- **Banana Leaf Meals:** A traditional thali experience featuring steamed rice, sambar, rasam, curd, and seasonal vegetable curries served on a fresh banana leaf.
- **Filter Coffee:** Dark roasted coffee beans brewed in a brass percolator and frothed with hot milk in a traditional tumbler and dabarah.`,
        coverImage: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
        author: 'Chef S. Ramanathan',
        authorRole: 'Culinary Specialist',
        category: 'Food',
        readTime: '5 min read',
        metaTitle: 'South Indian Food & Culinary Guide | You & Me Independent Voyage',
        metaDescription: 'Explore Chettinad spices, banana leaf thalis, and coastal seafood traditions on a private South India culinary journey.',
        published: true,
      },
    ],
  });

  console.log('Seeding completed successfully for You & Me – Independent Voyage!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
