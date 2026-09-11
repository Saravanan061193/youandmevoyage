// Global In-Memory Store for Server-Side Fallback Caching when DB is unreachable

export interface ReviewItem {
  id: string;
  author: string;
  country: string;
  countryFlag: string;
  rating: number;
  text: string;
  travelType?: string;
  verified?: boolean;
  createdAt?: string;
}

export interface SafariItem {
  id: string;
  title: string;
  slug: string;
  priceUSD: number;
  days: number;
  nights: number;
  category: string;
  region: string;
  badge?: string | null;
  image: string;
  route: string;
  startingLocation?: string;
  endingLocation?: string;
  bestTimeToTravel?: string;
  accommodation: string;
  description: string;
  inclusions: string;
  exclusions: string;
  gallery?: string;
  itineraries?: string;
  featured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  createdAt?: string;
}

export interface DestinationItem {
  id: string;
  title: string;
  slug?: string;
  subtitle: string;
  image: string;
  region: string;
  size: string;
  description: string;
  highlights?: string;
  experiences?: string;
  duration?: string;
  order?: number;
  createdAt?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  image: string;
  category: string;
  description: string;
  highlights: string;
  order?: number;
  createdAt?: string;
}

export interface GalleryItemType {
  id: string;
  title?: string;
  image: string;
  category: string;
  location?: string;
  order?: number;
  createdAt?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  published: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  category?: string | null;
  destination?: string | null;
  month?: string | null;
  duration?: string | null;
  travelers?: number | string | null;
  message?: string | null;
  status: string;
  proposalAmount?: number | null;
  followupDate?: string | null;
  crmNotes?: string | null;
  lostReason?: string | null;
  travelDates?: string | null;
  travelStyle?: string | null;
  destinationsList?: string | null;
  interests?: string | null;
  accommodationReq?: string | null;
  vehicleReq?: string | null;
  specialRequirements?: string | null;
  createdAt?: string;
}

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'review-1',
    author: 'Robert & Eleanor S.',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    text: 'Traveling South India with You & Me Independent Voyage was the highlight of our year. Sathish Kannan was so knowledgeable, calm, and attentive to every detail. We felt safe and cared for throughout Tamil Nadu and Kerala.',
    travelType: 'Custom 12-Day Couple Journey',
    verified: true,
  },
  {
    id: 'review-2',
    author: 'Marc & Sophie L.',
    country: 'France',
    countryFlag: '🇫🇷',
    rating: 5,
    text: 'Sathish from You & Me speaks fluent French and English! From Pondicherry to the tea hills of Munnar, the journey was smooth, safe, and rich in local culture.',
    travelType: 'Custom Family Journey',
    verified: true,
  },
  {
    id: 'review-3',
    author: 'David & Clare K.',
    country: 'USA',
    countryFlag: '🇺🇸',
    rating: 5,
    text: 'The Chettinad food trail and private houseboat in Alleppey organized by You & Me Independent Voyage were top notch! Sathish customized every stop to our tempo. Highly recommended on TripAdvisor!',
    travelType: 'Private Custom Cultural Tour',
    verified: true,
  },
  {
    id: 'review-4',
    author: 'Priya & Rahul M.',
    country: 'India',
    countryFlag: '🇮🇳',
    rating: 5,
    text: 'Immaculate AC vehicle, expert driver Sathish who knew every hidden gem and local eatery in South India. Top 5-star experience from Chennai!',
    travelType: 'Kerala & Tamil Nadu Road Trip',
    verified: true,
  },
];

export const DEFAULT_SAFARIS: SafariItem[] = [
  {
    id: 'journey-1',
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
    inclusions: '["Private AC vehicle with dedicated professional driver companion","Handpicked heritage hotel accommodations","Local expert guides at UNESCO heritage sites & temples"]',
    exclusions: '["International flights","Personal shopping & guide gratuities"]',
    featured: true,
  },
  {
    id: 'journey-2',
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
    inclusions: '["Private premium sedan/SUV with driver","Exclusive luxury houseboat cruise in Alleppey","Tea estate walks & spice plantation guided tour"]',
    exclusions: '["Airfare & visa fees","Ayurvedic treatment packages"]',
    featured: true,
  },
  {
    id: 'journey-3',
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
    inclusions: '["Dedicated chauffeur-driven vehicle for 14 days","Private luxury houseboat night with chef","Chettinad heritage mansion stay"]',
    exclusions: '["International flights"]',
    featured: true,
  },
  {
    id: 'journey-4',
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
    inclusions: '["Private AC vehicle","Chettinad cooking demonstration & banana leaf feast","Antique market walk"]',
    exclusions: '["Flights to Trichy / from Madurai"]',
    featured: true,
  },
  {
    id: 'journey-5',
    title: 'Goa Coastal Sunshine & Portuguese Heritage Escape',
    slug: 'goa-coastal-sunshine-portuguese-heritage-escape',
    priceUSD: 980,
    days: 5,
    nights: 4,
    category: 'Goa Journeys',
    region: 'Goa',
    badge: 'Beach & Heritage',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
    route: 'Panaji → Old Goa Cathedrals → Spice Plantations → Palolem Beach → Mandovi River',
    startingLocation: 'Goa Airport (Dabolim/Mopa)',
    endingLocation: 'Goa Airport (Dabolim/Mopa)',
    bestTimeToTravel: 'October to April',
    accommodation: 'Luxury Beachfront Resorts & Heritage Portuguese Villas',
    description: 'Relax along golden palm-fringed coastlines, explore 16th-century UNESCO Old Goa cathedrals, wander yellow Latin quarters in Fontainhas, savor spice farm lunches, and enjoy private Mandovi sunset cruises.',
    inclusions: '["Private AC SUV with dedicated professional driver companion","Handpicked beachfront resort stays with daily breakfast","Old Goa guided heritage walking tour","Sahakari spice plantation tour with Goan buffet lunch","Private Mandovi river sunset cruise"]',
    exclusions: '["Airfare & visa fees","Water sports activities & personal shopping"]',
    featured: true,
  },
  {
    id: 'journey-6',
    title: 'Royal Karnataka & Bangalore Garden City Trail',
    slug: 'royal-karnataka-bangalore-garden-city-trail',
    priceUSD: 1150,
    days: 6,
    nights: 5,
    category: 'Karnataka Journeys',
    region: 'Karnataka',
    badge: 'Royal & Nature',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=85',
    route: 'Bangalore → Mysore Palace → Coorg Coffee Estates → Bangalore',
    startingLocation: 'Bangalore (Bengaluru)',
    endingLocation: 'Bangalore (Bengaluru)',
    bestTimeToTravel: 'September to March',
    accommodation: 'Palace Hotels & Luxury Coorg Plantation Bungalows',
    description: 'Experience Bangalore’s historic gardens and tech energy, witness the grand illumination of Mysore Palace, walk through aromatic cardamom & coffee estates of Coorg, and taste authentic Kodava cuisine.',
    inclusions: '["Private AC sedan/SUV with experienced local driver","Boutique heritage stay in Mysore & luxury coffee estate resort in Coorg","Guided tour of Bangalore Palace & Lalbagh Gardens","Private coffee & spice plantation walk in Coorg"]',
    exclusions: '["Flight tickets to Bangalore","Personal expenses & alcoholic beverages"]',
    featured: true,
  },
];

export const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-1',
    title: 'Chennai',
    slug: 'chennai',
    subtitle: 'Gateway to South India & Classical Arts',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    region: 'Tamil Nadu',
    size: 'large',
    description: 'A vibrant metropolis blending centuries-old Dravidian temples, colonial seaside architecture, classical Bharatanatyam dance, and renowned culinary streets.',
    highlights: '["Kapaleeshwarar Temple","Marina Beach Walk","San Thome Basilica","Mylapore Heritage Walk"]',
    experiences: '["Filter coffee tasting","Temple bell ceremonies","Silk saree shopping in T. Nagar"]',
    duration: '2 Days',
    order: 1,
  },
  {
    id: 'dest-2',
    title: 'Mahabalipuram',
    slug: 'mahabalipuram',
    subtitle: 'Ancient Shore Temples & UNESCO Rock Carvings',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
    region: 'Tamil Nadu',
    size: 'tall',
    description: 'A coastal UNESCO World Heritage town famous for 7th-century Pallava cave temples, monolith rathas, and beachside stone carving studios.',
    highlights: '["Shore Temple","Arjuna’s Penance","Pancha Rathas","Krishna’s Butterball"]',
    experiences: '["Stone sculpting workshop","Coastal seafood dining","Beach sunrise walk"]',
    duration: '1-2 Days',
    order: 2,
  },
  {
    id: 'dest-3',
    title: 'Pondicherry',
    slug: 'pondicherry',
    subtitle: 'French Boulevards & Quiet Coastal Charm',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=900&q=85',
    region: 'Tamil Nadu',
    size: 'short',
    description: 'Cobblestone streets, French colonial villas, bougainvillea-draped cafes, and spiritual tranquility near the Bay of Bengal.',
    highlights: '["White Town French Quarter","Promenade Beach","Auroville Matrimandir","Sri Aurobindo Ashram"]',
    experiences: '["Cycle tour of French Quarter","Artisanal cafe hopping","Pottery workshops"]',
    duration: '2 Days',
    order: 3,
  },
  {
    id: 'dest-4',
    title: 'Thanjavur (Tanjore)',
    slug: 'thanjavur',
    subtitle: 'Cradle of Chola Dynasty & Big Temple',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=85',
    region: 'Tamil Nadu',
    size: 'short',
    description: 'Home to the monumental 1,000-year-old Brihadeeswarar Big Temple (UNESCO), royal palaces, Tanjore paintings, and bronze casting mastery.',
    highlights: '["Brihadeeswarar Temple","Thanjavur Maratha Palace","Saraswathi Mahal Library","Royal Art Gallery"]',
    experiences: '["Tanjore painting workshop","Chola bronze casting demonstration","Classical Veena music experience"]',
    duration: '2 Days',
    order: 4,
  },
  {
    id: 'dest-5',
    title: 'Madurai',
    slug: 'madurai',
    subtitle: 'The Soul of Tamil Culture & Meenakshi Temple',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=85',
    region: 'Tamil Nadu',
    size: 'large',
    description: 'One of the oldest continuously inhabited cities in the world, renowned for the soaring gopurams of Meenakshi Amman Temple and bustling night markets.',
    highlights: '["Meenakshi Amman Temple","Thirumalai Nayakar Palace","Gandhi Memorial Museum","Vandiyur Mariamman Teppakulam"]',
    experiences: '["Evening temple chariot ceremony","Jigarthanda street drink","Late night food walks"]',
    duration: '2 Days',
    order: 5,
  },
  {
    id: 'dest-6',
    title: 'Chettinad (Karaikudi)',
    slug: 'chettinad',
    subtitle: 'Heritage Mansions & Culinary Legend',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',
    region: 'Tamil Nadu',
    size: 'short',
    description: 'A heritage cluster featuring 19th-century merchant mansions, Athangudi handmade tiles, antique markets, and world-renowned spicy gastronomy.',
    highlights: '["Karaikudi Mansions","Athangudi Tile Factories","Chettinad Heritage Museum","Pillar Mansions of Kanadukathan"]',
    experiences: '["Banana leaf Chettinad feast","Heritage mansion walk","Handloom silk saree weaving"]',
    duration: '2 Days',
    order: 6,
  },
  {
    id: 'dest-7',
    title: 'Munnar',
    slug: 'munnar',
    subtitle: 'Rolling Tea Gardens & Cool Mountain Air',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85',
    region: 'Kerala',
    size: 'tall',
    description: 'Tucked in the Western Ghats mountain range, Munnar features misty green valleys, endless tea estates, and endangered Nilgiri Tahr mountain goats.',
    highlights: '["Tea Museum & Factory","Eravikulam National Park","Mattupetty Dam","Anamudi Peak Views"]',
    experiences: '["Tea plucking with locals","Spice estate trek","Cozy tea bungalow stays"]',
    duration: '2-3 Days',
    order: 7,
  },
  {
    id: 'dest-8',
    title: 'Alleppey (Alappuzha)',
    slug: 'alleppey',
    subtitle: 'Venice of the East & Luxury Houseboats',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
    region: 'Kerala',
    size: 'short',
    description: 'Glide gently through quiet palm-shaded canals, paddy fields, and traditional village life aboard your private air-conditioned kettuvallam houseboat.',
    highlights: '["Punnamada Lake","Backwater Canals","Vembanad Lake","Marari Beach"]',
    experiences: '["Private houseboat night stay","Fresh Kuttanad fish curry","Canoe canal ride"]',
    duration: '1-2 Days',
    order: 8,
  },
  {
    id: 'dest-9',
    title: 'Kochi (Cochin)',
    slug: 'kochi',
    subtitle: 'Historic Spice Port & Chinese Fishing Nets',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=900&q=85',
    region: 'Kerala',
    size: 'short',
    description: 'An ancient Arabian Sea spice port blending Portuguese fortresses, Dutch colonial palaces, Jewish synagogue quarters, and iconic Chinese fishing nets.',
    highlights: '["Fort Kochi Chinese Fishing Nets","Mattancherry Dutch Palace","Paradesi Synagogue","St. Francis Church"]',
    experiences: '["Kathakali dance performance","Sunset harbour cruise","Jew Town antique shopping"]',
    duration: '2 Days',
    order: 9,
  },
  {
    id: 'dest-10',
    title: 'Kanyakumari',
    slug: 'kanyakumari',
    subtitle: 'Southern Tip of India & Ocean Confluence',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85',
    region: 'Tamil Nadu',
    size: 'tall',
    description: 'The southernmost tip of mainland India, where the Bay of Bengal, Arabian Sea, and Indian Ocean meet. Famous for Vivekananda Rock Memorial and ocean sunsets.',
    highlights: '["Vivekananda Rock Memorial","Thiruvalluvar Statue","Kanyakumari Amman Temple","Sunset Point Cape Comorin"]',
    experiences: '["Ferry ride to Rock Memorial","Tri-sea sunset & sunrise watching","Beachfront shell craft shopping"]',
    duration: '1-2 Days',
    order: 10,
  },
];

export const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Temple Architecture & Ancient Heritage',
    slug: 'temple-architecture-ancient-heritage',
    subtitle: 'Soaring Dravidian Gopurams & UNESCO Monuments',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    category: 'Heritage',
    description: 'Explore thousands of years of stone carving mastery, Chola bronzes, and active living temple rituals with knowledgeable local historians.',
    highlights: '["UNESCO World Heritage site access","Private guided morning & evening walks","Architectural stone carving insights"]',
    order: 1,
  },
  {
    id: 'exp-2',
    title: 'South Indian Food & Culinary Trails',
    slug: 'south-indian-food-culinary-trails',
    subtitle: 'From Chettinad Feasts to Coastal Seafood',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
    category: 'Food',
    description: 'Savor authentic banana leaf thalis, aromatic Chettinad spice blends, fresh coconut sea curries, and iconic brass filter coffee.',
    highlights: '["Home-style cooking classes with local hosts","Street food walking tours","Spice market exploration"]',
    order: 2,
  },
  {
    id: 'exp-3',
    title: 'Kerala Backwater Private Houseboat Cruises',
    slug: 'kerala-backwater-houseboat-cruises',
    subtitle: 'Tranquil Waterways & Village Lagoons',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85',
    category: 'Nature',
    description: 'Unwind on custom luxury houseboats with dedicated private chef, navigating serene mirror-like canals away from crowded tourist routes.',
    highlights: '["Private chef preparing local delicacies","Sunset over Vembanad lake","Quiet country canoe excursions"]',
    order: 3,
  },
  {
    id: 'exp-4',
    title: 'Local Village & Traditional Arts Encounters',
    slug: 'local-village-traditional-arts',
    subtitle: 'Weavers, Potters & Classical Dancers',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
    category: 'Culture',
    description: 'Engage directly with Kanchipuram silk weavers, Athangudi handmade tile artisans, and traditional Kathakali or Bharatanatyam performers.',
    highlights: '["Artisan workshop visits","Private Kathakali makeup & performance","Silk loom demonstrations"]',
    order: 4,
  },
];

export const DEFAULT_GALLERY: GalleryItemType[] = [
  {
    id: 'gal-1',
    title: 'Meenakshi Temple Gopuram at Dusk',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    category: 'Tamil Nadu',
    location: 'Madurai',
    order: 1,
  },
  {
    id: 'gal-2',
    title: 'French Quarter Colonial Streets',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
    category: 'Culture',
    location: 'Pondicherry',
    order: 2,
  },
  {
    id: 'gal-3',
    title: 'Alleppey Backwaters Houseboat',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    category: 'Kerala',
    location: 'Alleppey',
    order: 3,
  },
  {
    id: 'gal-4',
    title: 'Traditional South Indian Thali Feast',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
    category: 'Food',
    location: 'Chettinad',
    order: 4,
  },
];

export const DEFAULT_BLOGS: BlogItem[] = [
  {
    id: 'blog-1',
    title: 'Best Places to Visit in Tamil Nadu: A Curated Road Trip Guide',
    slug: 'best-places-to-visit-in-tamil-nadu-road-trip-guide',
    excerpt: 'Discover UNESCO temples, coastal French enclaves, heritage Chettinad mansions, and spiritual cities across Tamil Nadu.',
    content: `Tamil Nadu is one of India's richest cultural states, offering thousands of years of continuous temple heritage, coastal charm, and culinary masterpieces.

### 1. Mahabalipuram: Coastal Stone Sculptures
Located just 60 km south of Chennai on the East Coast Road, Mahabalipuram is home to 7th-century Pallava cave temples and the iconic Shore Temple standing right at the ocean edge.

### 2. Pondicherry: French Quarter & Boulevard Vibes
Wander streets lined with mustard-yellow colonial villas, enjoy fresh pastries, and visit Auroville for a serene spiritual retreat.

### 3. Thanjavur: The Great Chola Living Temple
The 1,000-year-old Brihadeeswarar Temple in Thanjavur is an architectural miracle built entirely of granite blocks with an 81-ton apex dome.

### 4. Madurai: Meenakshi Amman Temple
Madurai is the spiritual heart of Tamil Nadu. The soaring gopurams of Meenakshi Temple are covered in thousands of colorful mythological statues.`,
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    author: 'Arun Kumar',
    authorRole: 'Senior South India Travel Companion',
    category: 'Travel Guide',
    readTime: '6 min read',
    published: true,
  },
  {
    id: 'blog-2',
    title: 'The Ultimate 10-Day Tamil Nadu & Kerala Private Itinerary',
    slug: 'ultimate-10-day-tamil-nadu-kerala-itinerary',
    excerpt: 'Combine temple majesty with emerald tea hills and serene backwater houseboats on this seamlessly planned private route.',
    content: `Combining Tamil Nadu's vibrant culture with Kerala's tranquil backwaters creates the ultimate South India holiday.

### Suggested Route Overview
- **Days 1–2:** Chennai to Mahabalipuram & Pondicherry
- **Days 3–4:** Thanjavur & Chettinad Mansions
- **Days 5–6:** Madurai Meenakshi Temple
- **Days 7–8:** Scenic climb into Munnar Tea Gardens
- **Days 9–10:** Alleppey Houseboat & Departure from Kochi`,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    author: 'Meera Nair',
    authorRole: 'Itinerary Planner',
    category: 'Itinerary',
    readTime: '7 min read',
    published: true,
  },
  {
    id: 'blog-3',
    title: 'A Traveler Guide to Authentic South Indian Food & Culinary Traditions',
    slug: 'traveler-guide-authentic-south-indian-food-traditions',
    excerpt: 'From crispy filter coffee morning rituals to spicy Chettinad banana leaf feasts and Kerala backwater seafood curries.',
    content: `Food in South India is a sensory journey that varies dramatically across every district and culture.

### 1. Filter Coffee & Tiffin Culture in Chennai & Tanjore
Start every morning with steaming, aromatic degree filter coffee served in traditional brass dabarah and tumbler, paired with crispy ghee roast dosas and fluffy idlis.

### 2. The Royal Chettinad Banana Leaf Feast
Explore Karaikudi for authentic Chettinad chicken, mutton chuka, and complex freshly ground spice mixes served on freshly cut banana leaves.

### 3. Coconut & Seafood Delights of Kerala Backwaters
Savor fresh Karimeen Pollichathu (pearl spot fish wrapped in banana leaf and grilled with spices) while floating down Alleppey's mirror-like lagoons.`,
    coverImage: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=85',
    author: 'Sathish Kumar',
    authorRole: 'Founder & Travel Companion',
    category: 'Food & Culture',
    readTime: '5 min read',
    published: true,
  },
];

export const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 555 019 2834',
    category: 'Tamil Nadu & Kerala Odyssey',
    destination: 'Tamil Nadu & Kerala',
    month: 'October 2026',
    duration: '10 Days',
    travelers: 2,
    message: 'Looking for a private customized trip with dedicated AC vehicle and local driver.',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
];

const globalForStore = globalThis as unknown as {
  inMemoryReviews?: ReviewItem[];
  inMemorySafaris?: SafariItem[];
  inMemoryDestinations?: DestinationItem[];
  inMemoryExperiences?: ExperienceItem[];
  inMemoryGallery?: GalleryItemType[];
  inMemoryBlogs?: BlogItem[];
  inMemoryInquiries?: InquiryItem[];
};

if (!globalForStore.inMemoryReviews) {
  globalForStore.inMemoryReviews = [...DEFAULT_REVIEWS];
}
if (!globalForStore.inMemorySafaris) {
  globalForStore.inMemorySafaris = [...DEFAULT_SAFARIS];
}
if (!globalForStore.inMemoryDestinations) {
  globalForStore.inMemoryDestinations = [...DEFAULT_DESTINATIONS];
}
if (!globalForStore.inMemoryExperiences) {
  globalForStore.inMemoryExperiences = [...DEFAULT_EXPERIENCES];
}
if (!globalForStore.inMemoryGallery) {
  globalForStore.inMemoryGallery = [...DEFAULT_GALLERY];
}
if (!globalForStore.inMemoryBlogs) {
  globalForStore.inMemoryBlogs = [...DEFAULT_BLOGS];
}
if (!globalForStore.inMemoryInquiries) {
  globalForStore.inMemoryInquiries = [...DEFAULT_INQUIRIES];
}

// HELPERS
export function getInMemoryReviews(): ReviewItem[] {
  return globalForStore.inMemoryReviews!;
}
export function setInMemoryReviews(items: ReviewItem[]) {
  globalForStore.inMemoryReviews = items;
}

export function getInMemorySafaris(): SafariItem[] {
  return globalForStore.inMemorySafaris!;
}
export function setInMemorySafaris(items: SafariItem[]) {
  globalForStore.inMemorySafaris = items;
}

export function getInMemoryDestinations(): DestinationItem[] {
  return globalForStore.inMemoryDestinations!;
}
export function setInMemoryDestinations(items: DestinationItem[]) {
  globalForStore.inMemoryDestinations = items;
}

export function getInMemoryExperiences(): ExperienceItem[] {
  return globalForStore.inMemoryExperiences!;
}
export function setInMemoryExperiences(items: ExperienceItem[]) {
  globalForStore.inMemoryExperiences = items;
}

export function getInMemoryGallery(): GalleryItemType[] {
  return globalForStore.inMemoryGallery!;
}
export function setInMemoryGallery(items: GalleryItemType[]) {
  globalForStore.inMemoryGallery = items;
}

export function getInMemoryBlogs(): BlogItem[] {
  return globalForStore.inMemoryBlogs!;
}
export function setInMemoryBlogs(items: BlogItem[]) {
  globalForStore.inMemoryBlogs = items;
}

export function getInMemoryInquiries(): InquiryItem[] {
  return globalForStore.inMemoryInquiries!;
}
export function setInMemoryInquiries(items: InquiryItem[]) {
  globalForStore.inMemoryInquiries = items;
}
export function addInMemoryInquiry(item: InquiryItem): InquiryItem {
  globalForStore.inMemoryInquiries!.unshift(item);
  return item;
}
export function updateInMemoryInquiry(id: string, updates: Partial<InquiryItem>): InquiryItem | null {
  const index = globalForStore.inMemoryInquiries!.findIndex((i) => i.id === id);
  if (index === -1) return null;
  globalForStore.inMemoryInquiries![index] = { ...globalForStore.inMemoryInquiries![index], ...updates };
  return globalForStore.inMemoryInquiries![index];
}
export function deleteInMemoryInquiry(id: string): boolean {
  const initialLen = globalForStore.inMemoryInquiries!.length;
  globalForStore.inMemoryInquiries = globalForStore.inMemoryInquiries!.filter((i) => i.id !== id);
  return globalForStore.inMemoryInquiries.length < initialLen;
}

export function addInMemorySafari(item: SafariItem): SafariItem {
  globalForStore.inMemorySafaris!.unshift(item);
  return item;
}
export function updateInMemorySafari(id: string, updates: Partial<SafariItem>): SafariItem | null {
  const index = globalForStore.inMemorySafaris!.findIndex((s) => s.id === id);
  if (index === -1) return null;
  globalForStore.inMemorySafaris![index] = { ...globalForStore.inMemorySafaris![index], ...updates };
  return globalForStore.inMemorySafaris![index];
}
export function deleteInMemorySafari(id: string): boolean {
  const initialLen = globalForStore.inMemorySafaris!.length;
  globalForStore.inMemorySafaris = globalForStore.inMemorySafaris!.filter((s) => s.id !== id);
  return globalForStore.inMemorySafaris.length < initialLen;
}

export function addInMemoryDestination(item: DestinationItem): DestinationItem {
  globalForStore.inMemoryDestinations!.unshift(item);
  return item;
}
export function updateInMemoryDestination(id: string, updates: Partial<DestinationItem>): DestinationItem | null {
  const index = globalForStore.inMemoryDestinations!.findIndex((d) => d.id === id);
  if (index === -1) return null;
  globalForStore.inMemoryDestinations![index] = { ...globalForStore.inMemoryDestinations![index], ...updates };
  return globalForStore.inMemoryDestinations![index];
}
export function deleteInMemoryDestination(id: string): boolean {
  const initialLen = globalForStore.inMemoryDestinations!.length;
  globalForStore.inMemoryDestinations = globalForStore.inMemoryDestinations!.filter((d) => d.id !== id);
  return globalForStore.inMemoryDestinations.length < initialLen;
}

export function addInMemoryBlog(item: BlogItem): BlogItem {
  globalForStore.inMemoryBlogs!.unshift(item);
  return item;
}
export function updateInMemoryBlog(id: string, updates: Partial<BlogItem>): BlogItem | null {
  const index = globalForStore.inMemoryBlogs!.findIndex((b) => b.id === id);
  if (index === -1) return null;
  globalForStore.inMemoryBlogs![index] = { ...globalForStore.inMemoryBlogs![index], ...updates };
  return globalForStore.inMemoryBlogs![index];
}
export function deleteInMemoryBlog(id: string): boolean {
  const initialLen = globalForStore.inMemoryBlogs!.length;
  globalForStore.inMemoryBlogs = globalForStore.inMemoryBlogs!.filter((b) => b.id !== id);
  return globalForStore.inMemoryBlogs.length < initialLen;
}

export function addInMemoryReview(item: ReviewItem): ReviewItem {
  globalForStore.inMemoryReviews!.unshift(item);
  return item;
}
export function updateInMemoryReview(id: string, updates: Partial<ReviewItem>): ReviewItem | null {
  const index = globalForStore.inMemoryReviews!.findIndex((r) => r.id === id);
  if (index === -1) return null;
  globalForStore.inMemoryReviews![index] = { ...globalForStore.inMemoryReviews![index], ...updates };
  return globalForStore.inMemoryReviews![index];
}
export function deleteInMemoryReview(id: string): boolean {
  const initialLen = globalForStore.inMemoryReviews!.length;
  globalForStore.inMemoryReviews = globalForStore.inMemoryReviews!.filter((r) => r.id !== id);
  return globalForStore.inMemoryReviews.length < initialLen;
}
