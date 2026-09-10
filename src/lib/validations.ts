import { z } from 'zod';

export const LoginSchema = z.object({
  action: z.literal('login').optional(),
  username: z.string().max(100).optional(),
  email: z.string().email('Invalid email address').max(100).optional(),
  password: z.string().min(1, 'Password is required').max(100).optional(),
  passcode: z.string().max(100).optional(),
});

export const ForgotPasswordSchema = z.object({
  action: z.literal('forgot-password'),
  email: z.string().email('Invalid admin email address').max(100),
});

export const ResetPasswordSchema = z.object({
  action: z.literal('reset-password'),
  email: z.string().email('Invalid admin email address').max(100),
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100),
});

export const InquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(100),
  phone: z.string().max(30).optional().default(''),
  category: z.string().max(100).optional().default('General Safari Inquiry'),
  destination: z.string().max(150).nullable().optional(),
  month: z.string().max(50).nullable().optional(),
  duration: z.string().max(50).nullable().optional(),
  travelers: z.union([z.number(), z.string()]).transform((val) => {
    const num = parseInt(val.toString(), 10);
    return isNaN(num) || num < 1 ? 1 : Math.min(num, 50);
  }).default(2),
  message: z.string().max(2000, 'Message cannot exceed 2000 characters').optional().default(''),
});

export const InquiryUpdateSchema = z.object({
  status: z.enum(['Pending', 'Contacted', 'Quoted', 'Confirmed', 'Completed', 'Lost', 'Archived']).optional(),
  proposalAmount: z.number().optional(),
  followupDate: z.string().max(50).optional(),
  crmNotes: z.string().max(2000).optional(),
  lostReason: z.string().max(500).optional(),
});

export const SafariSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  priceUSD: z.union([z.number(), z.string()]).transform((val) => Math.max(0, parseFloat(val.toString()) || 0)),
  days: z.union([z.number(), z.string()]).transform((val) => Math.max(1, parseInt(val.toString(), 10) || 1)),
  nights: z.union([z.number(), z.string()]).transform((val) => Math.max(0, parseInt(val.toString(), 10) || 0)),
  category: z.string().max(200).optional().default('Customized Private'),
  region: z.string().max(200).optional().default('Tamil Nadu'),
  badge: z.string().max(100).nullable().optional().default('Bestseller'),
  image: z.string().optional().default(''),
  route: z.string().nullable().optional().default(''),
  startingLocation: z.string().nullable().optional().default('Chennai'),
  endingLocation: z.string().nullable().optional().default('Kochi'),
  bestTimeToTravel: z.string().nullable().optional().default('October to April'),
  accommodation: z.string().nullable().optional().default(''),
  description: z.string().nullable().optional().default(''),
  inclusions: z.union([z.string(), z.array(z.any())]).transform((val) => (typeof val === 'string' ? val : JSON.stringify(val || []))).optional().default('[]'),
  exclusions: z.union([z.string(), z.array(z.any())]).transform((val) => (typeof val === 'string' ? val : JSON.stringify(val || []))).optional().default('[]'),
  metaTitle: z.string().nullable().optional().default(''),
  metaDescription: z.string().nullable().optional().default(''),
  keywords: z.string().nullable().optional().default(''),
});

export const DestinationSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().default(''),
  image: z.string().max(5000000).optional().default(''),
  region: z.string().max(100).default('Central'),
  size: z.enum(['large', 'tall', 'short']).default('short'),
  description: z.string().max(3000).optional().default(''),
});

export const BlogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().max(200).optional().default(''),
  excerpt: z.string().max(1000).optional().default(''),
  content: z.string().max(20000).optional().default(''),
  coverImage: z.string().max(5000000).optional().default(''),
  author: z.string().max(100).default('You & Me Travel Team'),
  authorRole: z.string().max(100).default('South India Travel Specialist'),
  category: z.string().max(100).default('Travel Guide'),
  readTime: z.string().max(50).default('5 min read'),
  metaTitle: z.string().max(200).optional().default(''),
  metaDescription: z.string().max(500).optional().default(''),
  published: z.boolean().default(true),
});

export const FaqSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(3000),
  category: z.string().max(100).default('Booking & Inclusions'),
});

export const ReviewSchema = z.object({
  author: z.string().min(1).max(100),
  country: z.string().max(100).default('United States'),
  countryFlag: z.string().max(10).default('US'),
  rating: z.union([z.number(), z.string()]).transform((val) => Math.min(5, Math.max(1, parseInt(val.toString(), 10) || 5))),
  text: z.string().min(1).max(2000),
});
