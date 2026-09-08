// Global In-Memory Store for Server-Side Fallback Caching when DB is unreachable

export interface ReviewItem {
  id: string;
  author: string;
  country: string;
  countryFlag: string;
  rating: number;
  text: string;
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
  accommodation: string;
  description: string;
  inclusions: string;
  exclusions: string;
  featured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  createdAt?: string;
}

export interface DestinationItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  region: string;
  size: string;
  description: string;
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
  createdAt?: string;
}

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'review-1',
    author: 'Anna & Lukas M.',
    country: 'Germany',
    countryFlag: 'DE',
    rating: 5,
    text: 'Every detail felt considered. Our guide knew when to talk, when to pause, and exactly where the light would land.',
    verified: true,
  },
  {
    id: 'review-2',
    author: 'Michael R.',
    country: 'USA',
    countryFlag: 'US',
    rating: 5,
    text: 'This was not a checklist trip. It was beautifully paced, deeply personal, and far beyond what we imagined.',
    verified: true,
  },
  {
    id: 'review-3',
    author: 'Charlotte P.',
    country: 'UK',
    countryFlag: 'GB',
    rating: 5,
    text: 'The camps, the landscapes, the service — Discovery Safaris made Namibia feel like our own secret.',
    verified: true,
  },
  {
    id: 'review-4',
    author: 'Claire D.',
    country: 'France',
    countryFlag: 'FR',
    rating: 5,
    text: 'A rare combination of precision and warmth. We felt completely looked after from landing to take-off.',
    verified: true,
  },
];

export const DEFAULT_SAFARIS: SafariItem[] = [
  {
    id: 'safari-1',
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
    inclusions: '["Private 4x4 vehicle & expert guide","Luxury accommodation","All park fees"]',
    exclusions: '["International flights","Visa fees"]',
    featured: true,
  },
  {
    id: 'safari-2',
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
    inclusions: '["Private fly-in transport","Boutique desert retreat lodging"]',
    exclusions: '["International airfare"]',
    featured: true,
  },
  {
    id: 'safari-3',
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
    inclusions: '["Custom pop-top 4x4 cruiser","Professional tracker"]',
    exclusions: '["Personal insurance"]',
    featured: true,
  },
];

export const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-1',
    title: 'Sossusvlei',
    subtitle: 'Red dunes at first light',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
    region: 'South',
    size: 'large',
    description: 'Home to the world’s highest sand dunes and the famous stark white clay pan of Deadvlei.',
    order: 1,
  },
  {
    id: 'dest-2',
    title: 'Etosha',
    subtitle: 'Wildlife, waterholes & wide skies',
    image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=85',
    region: 'North',
    size: 'tall',
    description: 'One of Africa’s greatest game reserves dominated by a massive salt pan visible from space.',
    order: 2,
  },
  {
    id: 'dest-3',
    title: 'Swakopmund',
    subtitle: 'Atlantic air & living desert',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
    region: 'Central',
    size: 'short',
    description: 'German colonial charm meets ocean breeze and thrilling desert adventures.',
    order: 3,
  },
  {
    id: 'dest-4',
    title: 'Skeleton Coast',
    subtitle: 'The wild edge of the continent',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85',
    region: 'North',
    size: 'short',
    description: 'Hauntingly beautiful coastline scattered with shipwrecks and seal colonies.',
    order: 4,
  },
  {
    id: 'dest-5',
    title: 'Damaraland',
    subtitle: 'Ancient rock art & desert elephants',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85',
    region: 'North',
    size: 'tall',
    description: 'Rugged granitic landscapes where desert lions and elephants roam free.',
    order: 5,
  },
];

export const DEFAULT_BLOGS: BlogItem[] = [
  {
    id: 'blog-2',
    title: 'How Safari Operators Can Attract More International Customers Online',
    slug: 'how-safari-operators-attract-international-customers-online',
    excerpt: 'A comprehensive guide for safari operators on building high-converting websites, international SEO strategies, destination content, and converting visitors into enquiries.',
    content: `# How Safari Operators Can Attract More International Customers Online

## Table of Contents
1. Introduction
2. Why Online Visibility Matters for Safari Operators
3. The Scope of Digital Growth in Safari Tourism
4. Step 1: Build a Professional Safari Website
5. Step 2: Create Destination-Focused Content
6. Step 3: Make Your Safari Packages Easy to Explore
7. Step 4: Build Trust With Real Experiences
8. Step 5: Optimise Your Website for Search Engines
9. Step 6: Make It Easy to Send an Enquiry
10. Important Website Features for Safari Operators
11. Conclusion
12. Build a Safari Website That Helps Your Business Grow

---

## Introduction

A traveller planning a safari today usually starts the journey online.

Before contacting a safari operator, they may search for destinations, compare safari packages, look at wildlife experiences, read reviews, check accommodation options and explore photographs from previous trips.

For safari operators targeting international travellers, this creates a major opportunity.

Your safari business may offer an excellent experience, but if potential customers cannot easily find your company online or understand what you offer, they may choose another operator.

A **professional safari website** can help you present your destinations, packages, experiences and expertise while making it easier for international travellers to contact your business.

Whether you operate in **Kenya, Tanzania, Namibia, Botswana, South Africa, Uganda, Rwanda or other African safari destinations**, your online presence can play an important role in attracting international customers.

---

## Why Online Visibility Matters for Safari Operators

International travellers often have many safari operators to choose from.

A strong online presence helps your business answer some of the questions they may have before making an enquiry:

* What safari destinations do you cover?
* What type of safari packages do you offer?
* Can you create a customised itinerary?
* What accommodation options are available?
* How experienced are your guides?
* What do previous travellers say about you?
* How can I contact you?
* Can I request a personalised safari quote?

If your website provides clear answers, it becomes more than an online brochure. It can become an important part of your **sales and lead-generation process**.

---

## The Scope of Digital Growth in Safari Tourism

The opportunity is not limited to simply creating a website.

A well-planned digital strategy can help safari operators reach customers across different international markets.

For example, a safari company can create dedicated content around searches such as:

* [Kenya Safari Tours](/#safaris)
* [Tanzania Safari Tours](/#safaris)
* [Namibia Safari Holidays](/#destinations)
* [Botswana Luxury Safari](/#safaris)
* [African Wildlife Safari](/#safaris)
* [Private Safari Tours](/#safaris)
* [Luxury Safari Holidays](/#safaris)
* [Family Safari Packages](/#safaris)
* [Custom Safari Itineraries](/#itinerary)
* [Wildlife Photography Safaris](/#destinations)

Instead of trying to reach everyone with one generic page, your website can target different **destinations, safari experiences and traveller requirements**.

This creates more opportunities to appear in search results and generate relevant enquiries.

---

## Step 1: Build a Professional Safari Website

Your website is often one of the first places an international traveller will evaluate your business.

A modern safari website should communicate your value within a few seconds.

Your homepage should clearly show:

* Who you are
* Where you operate
* What safari experiences you offer
* Why travellers should choose you
* How visitors can plan their safari

High-quality images and videos can showcase the actual safari experience, but visual content should be supported by clear information and strong calls to action.

The goal is not simply to make the website beautiful.

**The goal is to turn website visitors into genuine safari enquiries.**

---

## Step 2: Create Destination-Focused Content

International customers don't always search for a company name.

Many start with a destination or experience. For example:

* **"Best safari in Tanzania"**
* **"Namibia wildlife safari"**
* **"Luxury safari in Botswana"**
* **"Kenya private safari tours"**

Creating useful destination pages and articles can help your website target these searches. A safari operator could create pages such as:

* [Kenya Safari Tours](/#safaris)
* [Tanzania Safari Tours](/#safaris)
* [Namibia Safari Experiences](/#destinations)
* [Botswana Luxury Safaris](/#safaris)
* [South Africa Wildlife Safaris](/#safaris)

You can also create helpful articles about the best time to visit, wildlife seasons, safari costs, accommodation, travel tips and itinerary planning.

---

## Step 3: Make Your Safari Packages Easy to Explore

Travellers should not have to search through multiple pages to understand your safari packages.

Each package should clearly explain:

* Safari duration
* Destination
* Main attractions
* Accommodation
* Activities
* Transportation
* Best travel season
* Starting information
* Customisation options
* Enquiry option

Clear itineraries help potential customers understand the experience and make an informed decision. Check out our [Bespoke Safari Packages](/#safaris) to see how itineraries are presented.

---

## Step 4: Build Trust With Real Experiences

International customers may be booking a safari from thousands of kilometres away. Trust therefore becomes extremely important.

Your website can include:

* **Guest Reviews**: Show genuine feedback from previous travellers. Read our [Guest Reviews & Testimonials](/#reviews).
* **Real Safari Photography**: Use authentic photographs from your own trips wherever possible.
* **Guide Profiles**: Introduce your safari guides and their experience.
* **Company Story**: Learn more on our [About Discovery Safaris](/about) page.
* **Conservation & Community Work**: If your business supports wildlife conservation or local communities, explain it clearly.
* **FAQs**: Answer common questions about travel, accommodation, safety, payments and transportation. Read our [Frequently Asked Questions](/#faq).

---

## Step 5: Optimise Your Website for Search Engines

A beautiful website is not enough if potential customers cannot find it.

**Search Engine Optimisation (SEO)** can help safari operators improve their visibility for relevant searches around keywords like *safari tour operator*, *luxury safari*, *private safari*, and *custom safari tours*.

---

## Step 6: Make It Easy to Send an Enquiry

Getting visitors to your website is only the first step. The next step is converting them into enquiries.

Useful options include:

* **[Plan My Safari](/#contact)**
* **[Request a Custom Itinerary](/#contact)**
* **[Get a Safari Quote](/#contact)**
* **[Talk to a Safari Expert](/#contact)**

---

## Important Website Features for Safari Operators

| Feature                  | Why It Matters                                      |
| ------------------------ | --------------------------------------------------- |
| Destination Pages        | Helps travellers explore different safari locations |
| Safari Packages          | Clearly presents available experiences              |
| Custom Itinerary Enquiry | Captures personalised safari requirements           |
| WhatsApp Integration     | Makes communication faster                          |
| Mobile-Friendly Design   | Helps travellers browse from phones                 |
| SEO Structure            | Supports search engine visibility                   |
| Reviews & Testimonials   | Builds trust                                        |
| Photo & Video Gallery    | Shows the real safari experience                    |
| Blog                     | Helps attract informational searches                |
| FAQs                     | Answers common traveller questions                  |
| Google Maps              | Helps visitors understand your location             |

---

## Conclusion

International travellers are already researching their safari experiences online. The opportunity for safari operators is to make sure their business is visible, trustworthy and easy to contact.

Your safari experience may be unforgettable. **Your website should make travellers want to experience it.**

---

## Ready to Plan Your Dream Safari Expedition?

At **Discovery Safaris Namibia**, we specialize in **bespoke private safaris, luxury tented camps, and wildlife expeditions** engineered for international travellers across Namibia and Southern Africa.

* **Email Us**: [info@discoverysafaris.com](mailto:info@discoverysafaris.com)
* **WhatsApp Chat**: [+264 81 123 4567](https://wa.me/264811234567)
* **Head Office**: 77 Independence Avenue, Central Business District, Windhoek, Namibia

👉 **[Click Here to Get Your Custom Safari Quote](/#contact)** or **[Explore Our Signature Safari Packages](/#safaris)** today!`,
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85',
    author: 'Discovery Safaris Team',
    authorRole: 'Safari Expeditions & Digital Growth Specialist',
    category: 'Travel Guide',
    readTime: '8 min read',
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'blog-1',
    title: 'The Ultimate Guide to Planning a Private Namibia Safari in 2026',
    slug: 'ultimate-guide-planning-namibia-safari-2026',
    excerpt: 'Everything you need to know about weather windows, fly-in options vs custom 4x4 overland expeditions, and reserving luxury tented camps.',
    content: 'Namibia is unlike anywhere else on earth...',
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=85',
    author: 'Dr. Johan van Zyl',
    authorRole: 'Head Wildlife Ecologist',
    category: 'Travel Guide',
    readTime: '6 min read',
    published: true,
  },
];

export const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 555 019 2834',
    category: 'Private Safari',
    destination: 'Sossusvlei & Etosha',
    month: 'October 2026',
    duration: '10 Days',
    travelers: 2,
    message: 'Looking for a private luxury safari with fly-in options.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inq-2',
    name: 'David & Claire Miller',
    email: 'david.miller@example.com',
    phone: '+44 7700 900077',
    category: 'Honeymoon Safari',
    destination: 'Skeleton Coast & Damaraland',
    month: 'November 2026',
    duration: '12 Days',
    travelers: 2,
    message: 'Planning our honeymoon trip. Interested in high-end tented camps and stargazing.',
    status: 'Contacted',
    proposalAmount: 12500,
    crmNotes: 'Sent initial customized itinerary options via email.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const globalForStore = globalThis as unknown as {
  inMemoryReviews?: ReviewItem[];
  inMemorySafaris?: SafariItem[];
  inMemoryDestinations?: DestinationItem[];
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
if (!globalForStore.inMemoryBlogs) {
  globalForStore.inMemoryBlogs = [...DEFAULT_BLOGS];
}
if (!globalForStore.inMemoryInquiries) {
  globalForStore.inMemoryInquiries = [...DEFAULT_INQUIRIES];
}

// --- REVIEWS STORE HELPERS ---
export function getInMemoryReviews(): ReviewItem[] {
  return globalForStore.inMemoryReviews!;
}

export function setInMemoryReviews(items: ReviewItem[]) {
  globalForStore.inMemoryReviews = items;
}

export function addInMemoryReview(item: ReviewItem): ReviewItem {
  // Check if exists
  const existingIdx = globalForStore.inMemoryReviews!.findIndex((r) => r.id === item.id);
  if (existingIdx >= 0) {
    globalForStore.inMemoryReviews![existingIdx] = item;
  } else {
    globalForStore.inMemoryReviews!.unshift(item);
  }
  return item;
}

export function updateInMemoryReview(id: string, updates: Partial<ReviewItem>): ReviewItem | null {
  const idx = globalForStore.inMemoryReviews!.findIndex((r) => r.id === id);
  if (idx !== -1) {
    globalForStore.inMemoryReviews![idx] = {
      ...globalForStore.inMemoryReviews![idx],
      ...updates,
    };
    return globalForStore.inMemoryReviews![idx];
  }
  return null;
}

export function deleteInMemoryReview(id: string): boolean {
  const initialLength = globalForStore.inMemoryReviews!.length;
  globalForStore.inMemoryReviews = globalForStore.inMemoryReviews!.filter((r) => r.id !== id);
  return globalForStore.inMemoryReviews.length < initialLength;
}

// --- SAFARIS STORE HELPERS ---
export function getInMemorySafaris(): SafariItem[] {
  return globalForStore.inMemorySafaris!;
}

export function setInMemorySafaris(items: SafariItem[]) {
  globalForStore.inMemorySafaris = items;
}

export function addInMemorySafari(item: SafariItem): SafariItem {
  const idx = globalForStore.inMemorySafaris!.findIndex((s) => s.id === item.id);
  if (idx >= 0) {
    globalForStore.inMemorySafaris![idx] = item;
  } else {
    globalForStore.inMemorySafaris!.unshift(item);
  }
  return item;
}

export function updateInMemorySafari(id: string, updates: Partial<SafariItem>): SafariItem | null {
  const idx = globalForStore.inMemorySafaris!.findIndex((s) => s.id === id);
  if (idx !== -1) {
    globalForStore.inMemorySafaris![idx] = {
      ...globalForStore.inMemorySafaris![idx],
      ...updates,
    };
    return globalForStore.inMemorySafaris![idx];
  }
  return null;
}

export function deleteInMemorySafari(id: string): boolean {
  globalForStore.inMemorySafaris = globalForStore.inMemorySafaris!.filter((s) => s.id !== id);
  return true;
}

// --- DESTINATIONS STORE HELPERS ---
export function getInMemoryDestinations(): DestinationItem[] {
  return globalForStore.inMemoryDestinations!;
}

export function setInMemoryDestinations(items: DestinationItem[]) {
  globalForStore.inMemoryDestinations = items;
}

export function addInMemoryDestination(item: DestinationItem): DestinationItem {
  const idx = globalForStore.inMemoryDestinations!.findIndex((d) => d.id === item.id);
  if (idx >= 0) {
    globalForStore.inMemoryDestinations![idx] = item;
  } else {
    globalForStore.inMemoryDestinations!.push(item);
  }
  return item;
}

export function updateInMemoryDestination(id: string, updates: Partial<DestinationItem>): DestinationItem | null {
  const idx = globalForStore.inMemoryDestinations!.findIndex((d) => d.id === id);
  if (idx !== -1) {
    globalForStore.inMemoryDestinations![idx] = {
      ...globalForStore.inMemoryDestinations![idx],
      ...updates,
    };
    return globalForStore.inMemoryDestinations![idx];
  }
  return null;
}

export function deleteInMemoryDestination(id: string): boolean {
  globalForStore.inMemoryDestinations = globalForStore.inMemoryDestinations!.filter((d) => d.id !== id);
  return true;
}

// --- BLOGS STORE HELPERS ---
export function getInMemoryBlogs(): BlogItem[] {
  return globalForStore.inMemoryBlogs!;
}

export function setInMemoryBlogs(items: BlogItem[]) {
  globalForStore.inMemoryBlogs = items;
}

export function addInMemoryBlog(item: BlogItem): BlogItem {
  const idx = globalForStore.inMemoryBlogs!.findIndex((b) => b.id === item.id);
  if (idx >= 0) {
    globalForStore.inMemoryBlogs![idx] = item;
  } else {
    globalForStore.inMemoryBlogs!.unshift(item);
  }
  return item;
}

export function updateInMemoryBlog(id: string, updates: Partial<BlogItem>): BlogItem | null {
  const idx = globalForStore.inMemoryBlogs!.findIndex((b) => b.id === id);
  if (idx !== -1) {
    globalForStore.inMemoryBlogs![idx] = {
      ...globalForStore.inMemoryBlogs![idx],
      ...updates,
    };
    return globalForStore.inMemoryBlogs![idx];
  }
  return null;
}

export function deleteInMemoryBlog(id: string): boolean {
  globalForStore.inMemoryBlogs = globalForStore.inMemoryBlogs!.filter((b) => b.id !== id);
  return true;
}

// --- INQUIRIES STORE HELPERS ---
export function getInMemoryInquiries(): InquiryItem[] {
  return globalForStore.inMemoryInquiries!;
}

export function setInMemoryInquiries(items: InquiryItem[]) {
  globalForStore.inMemoryInquiries = items;
}

export function addInMemoryInquiry(item: InquiryItem): InquiryItem {
  const idx = globalForStore.inMemoryInquiries!.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    globalForStore.inMemoryInquiries![idx] = item;
  } else {
    globalForStore.inMemoryInquiries!.unshift(item);
  }
  return item;
}

export function updateInMemoryInquiry(id: string, updates: Partial<InquiryItem>): InquiryItem | null {
  const idx = globalForStore.inMemoryInquiries!.findIndex((i) => i.id === id);
  if (idx !== -1) {
    globalForStore.inMemoryInquiries![idx] = {
      ...globalForStore.inMemoryInquiries![idx],
      ...updates,
    };
    return globalForStore.inMemoryInquiries![idx];
  }
  return null;
}

export function deleteInMemoryInquiry(id: string): boolean {
  globalForStore.inMemoryInquiries = globalForStore.inMemoryInquiries!.filter((i) => i.id !== id);
  return true;
}
