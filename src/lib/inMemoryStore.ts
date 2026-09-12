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

export const DEFAULT_REVIEWS: ReviewItem[] = [];

export const DEFAULT_SAFARIS: SafariItem[] = [];

export const DEFAULT_DESTINATIONS: DestinationItem[] = [];

export const DEFAULT_EXPERIENCES: ExperienceItem[] = [];

export const DEFAULT_GALLERY: GalleryItemType[] = [];

export const DEFAULT_BLOGS: BlogItem[] = [];

export const DEFAULT_INQUIRIES: InquiryItem[] = [];

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
