'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Compass,
  DollarSign,
  MessageSquare,
  Star,
  Settings as SettingsIcon,
  MapPin,
  ArrowLeft,
  FileText,
  BookOpen,
  Bell,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Sliders,
  Share2,
  Cloud,
  Coins,
  Globe,
  Image as ImageIcon,
  ShieldCheck,
  Menu,
  PanelLeft,
  Layout,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  Target,
  XCircle,
  AlertCircle,
  CheckCircle2,
  X,
  Filter,
  Heart,
  Award,
  HelpCircle,
  Search,
  ChevronDown,
  Download,
  Upload,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { triggerPdfDownload } from '@/lib/downloadPdf';
import { safeParseList } from '@/lib/json';

export default function AdminPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [passcode, setPasscode] = useState('admin123');
  const [authError, setAuthError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [previewOtp, setPreviewOtp] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'safaris' | 'destinations' | 'inquiries' | 'reviews' | 'settings' | 'legal' | 'blogs' | 'reports' | 'about' | 'faqs' | 'itineraries' | 'experiences'>('overview');
  const [settingsSubTab, setSettingsSubTab] = useState<'basic' | 'social' | 'cloudinary' | 'seo' | 'banner'>('basic');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cmsExpanded, setCmsExpanded] = useState(false);

  // Experience Modal state
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    subtitle: '',
    desc: '',
    image: '',
  });

  // Auto-expand CMS accordion when a CMS child tab is selected
  useEffect(() => {
    if (['blogs', 'faqs', 'about', 'legal', 'itineraries'].includes(activeTab)) {
      setCmsExpanded(true);
    }
  }, [activeTab]);



  // Dashboard Date Filter States
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Helper to filter data list by date range
  const getFilteredItems = (items: any[]) => {
    if (!items || !Array.isArray(items)) return [];
    if (dateFilter === 'all') return items;

    const now = new Date();

    return items.filter((item) => {
      if (!item.createdAt) return true;
      const itemDate = new Date(item.createdAt);
      if (isNaN(itemDate.getTime())) return true;

      if (dateFilter === 'today') {
        return (
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      if (dateFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);
        return itemDate >= oneWeekAgo;
      }

      if (dateFilter === 'month') {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      if (dateFilter === 'custom') {
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        }
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          return itemDate >= start;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return itemDate <= end;
        }
        return true;
      }

      return true;
    });
  };

  // Data states
  const [safaris, setSafaris] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  // Home Signature Itineraries Memoized List
  const homeItineraryItemsList = useMemo(() => {
    try {
      if (settings?.homeItineraries) {
        const parsed = typeof settings.homeItineraries === 'string' ? JSON.parse(settings.homeItineraries) : settings.homeItineraries;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        dayNumber: '01',
        daysLabel: 'Day 01',
        title: 'Arrival in Chennai & Historic Shore Temples',
        description: 'Welcome to South India! Meet your private driver-companion at Chennai airport, travel to Mahabalipuram, and visit ancient UNESCO rock-cut shore temples.',
        duration: '1.5 hrs · 55 km',
        mealPlan: 'Dinner',
        accommodation: 'Radisson Blu Resort Temple Bay',
        accommodationSub: 'Beachfront resort · Mahabalipuram',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      },
      {
        dayNumber: '02',
        daysLabel: 'Days 02–03',
        title: 'Pondicherry French Quarter & Auroville',
        description: 'Drive along the Bay of Bengal coastline to Pondicherry. Wander through quiet mustard-yellow French Quarter lanes, visit Sri Aurobindo Ashram and experimental town Auroville.',
        duration: '2 hrs · 100 km',
        mealPlan: 'Breakfast & Dinner',
        accommodation: 'Palais de Mahe',
        accommodationSub: 'Heritage hotel · French Quarter',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        dayNumber: '03',
        daysLabel: 'Days 04–05',
        title: 'Thanjavur Great Living Chola Temples & Chettinad Mansions',
        description: 'Visit the grand Brihadeeswarar Temple in Thanjavur, then head into the heart of Chettinad to explore palatial heritage mansions and savor world-famous local cuisine.',
        duration: '4 hrs · 220 km',
        mealPlan: 'Full Board',
        accommodation: 'The Bangala',
        accommodationSub: 'Heritage mansion hotel · Chettinad',
        image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=85',
      },
      {
        dayNumber: '04',
        daysLabel: 'Days 06–08',
        title: 'Munnar Tea Plantations & Alleppey Houseboat Cruise',
        description: 'Ascend into the misty Western Ghats to Munnar tea estates. Descend to Alleppey backwaters for a tranquil private luxury houseboat cruise along palm-fringed canals.',
        duration: '4.5 hrs · 240 km',
        mealPlan: 'Full Board',
        accommodation: 'Private Luxury Houseboat & Windermere Estate',
        accommodationSub: 'Backwater luxury boat & tea estate bungalow',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
      },
      {
        dayNumber: '05',
        daysLabel: 'Days 09–10',
        title: 'Historic Fort Kochi & Departure',
        description: 'Discover Chinese fishing nets, spice markets, and Kathakali cultural performances in historic Fort Kochi before seamless airport drop-off.',
        duration: '1.5 hrs · 45 km',
        mealPlan: 'Breakfast',
        accommodation: 'Brunton Boatyard',
        accommodationSub: 'Harborfront heritage hotel · Fort Kochi',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=85',
      },
    ];
  }, [settings?.homeItineraries]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccessModal, setSaveSuccessModal] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Quote Inquiry', desc: 'Sarah Jenkins requested a custom quote for South India Private Tour', time: '10m ago', unread: true },
    { id: 2, title: 'Blog Post Draft Saved', desc: 'Tamil Nadu & Kerala Grand Circuit guide created', time: '1h ago', unread: true },
    { id: 3, title: 'CMS Data Synchronized', desc: 'Exchange rates & tour prices updated live', time: '3h ago', unread: false },
  ]);

  // Admin pagination states
  const [safariPage, setSafariPage] = useState(1);
  const [destPage, setDestPage] = useState(1);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [faqPage, setFaqPage] = useState(1);
  const [destSearchQuery, setDestSearchQuery] = useState('');
  const [inquirySearchQuery, setInquirySearchQuery] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');
  const [blogViewMode, setBlogViewMode] = useState<'list' | 'editor'>('list');
  const [safariViewMode, setSafariViewMode] = useState<'list' | 'editor'>('list');
  const [safariSearchQuery, setSafariSearchQuery] = useState('');

  // Form Modals / Edit states
  const [editingSafari, setEditingSafari] = useState<any>(null);
  const [safariForm, setSafariForm] = useState({
    title: '',
    priceUSD: '1800',
    days: '7',
    nights: '6',
    category: 'Customized Private',
    region: 'Tamil Nadu',
    badge: 'Bestseller',
    image: '',
    route: '',
    startingLocation: 'Chennai',
    endingLocation: 'Kochi',
    bestTimeToTravel: 'October to April',
    accommodation: '',
    description: '',
    inclusions: '["Private Air-Conditioned Vehicle","English Speaking Driver-Companion","Heritage Hotels"]',
    exclusions: '["Flights","Personal Expenses","Tips"]',
    itineraries: '[]',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  });

  const [destModal, setDestModal] = useState<boolean>(false);
  const [editingDest, setEditingDest] = useState<any>(null);
  const [destForm, setDestForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    region: 'Tamil Nadu',
    size: 'short',
    description: '',
  });

  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    country: 'United States',
    countryFlag: 'US',
    rating: '5',
    text: '',
  });

  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
    author: 'You & Me Travel Team',
    authorRole: 'South India Travel Specialist',
    category: 'Travel Guide',
    readTime: '5 min read',
    metaTitle: '',
    metaDescription: '',
    published: true,
  });

  const [faqModal, setFaqModal] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'Booking & Inclusions',
  });

  // Home Itinerary Modal & Form States
  const [itineraryModalOpen, setItineraryModalOpen] = useState<boolean>(false);
  const [editingItineraryIndex, setEditingItineraryIndex] = useState<number | null>(null);
  const [itineraryForm, setItineraryForm] = useState({
    dayNumber: '01',
    daysLabel: 'Day 01',
    title: '',
    description: '',
    duration: '',
    mealPlan: '',
    accommodation: '',
    accommodationSub: '',
    image: '',
  });

  const [inquiryViewMode, setInquiryViewMode] = useState<'list' | 'editor'>('list');
  const [editingLead, setEditingLead] = useState<any>(null);
  const [leadForm, setLeadForm] = useState({
    status: 'Pending',
    proposalAmount: '0',
    followupDate: '',
    crmNotes: '',
    lostReason: '',
  });

  // Dynamic Categories & Regions states
  const [categoriesList, setCategoriesList] = useState<string[]>(['Customized Private', 'Cultural & Heritage', 'Backwaters & Coastal', 'Hill Station & Nature', 'Temple & Architecture']);
  const [regionsList, setRegionsList] = useState<string[]>(['Tamil Nadu', 'Kerala', 'South India Circuit']);
  const [showAddCatInput, setShowAddCatInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddRegionInput, setShowAddRegionInput] = useState(false);
  const [newRegionName, setNewRegionName] = useState('');

  // Load custom categories and regions from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCats = localStorage.getItem('custom_safari_categories');
      if (savedCats) {
        try {
          const parsed = JSON.parse(savedCats);
          if (Array.isArray(parsed) && parsed.length > 0) setCategoriesList(parsed);
        } catch (e) {}
      }
      const savedRegs = localStorage.getItem('custom_safari_regions');
      if (savedRegs) {
        try {
          const parsed = JSON.parse(savedRegs);
          if (Array.isArray(parsed) && parsed.length > 0) setRegionsList(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const handleAddNewCategory = (customName?: string) => {
    const target = (customName !== undefined ? customName : newCategoryName).trim();
    if (!target) {
      setShowAddCatInput(false);
      return;
    }
    setCategoriesList((prev) => {
      const updated = Array.from(new Set([...prev, target]));
      if (typeof window !== 'undefined') {
        localStorage.setItem('custom_safari_categories', JSON.stringify(updated));
      }
      return updated;
    });
    setSafariForm((prev) => ({ ...prev, category: target }));
    setNewCategoryName('');
    setShowAddCatInput(false);
    showNotification(`New category "${target}" added!`);
  };

  const handleAddNewRegion = (customName?: string) => {
    const target = (customName !== undefined ? customName : newRegionName).trim();
    if (!target) {
      setShowAddRegionInput(false);
      return;
    }
    setRegionsList((prev) => {
      const updated = Array.from(new Set([...prev, target]));
      if (typeof window !== 'undefined') {
        localStorage.setItem('custom_safari_regions', JSON.stringify(updated));
      }
      return updated;
    });
    setSafariForm((prev) => ({ ...prev, region: target }));
    setDestForm((prev) => ({ ...prev, region: target }));
    setNewRegionName('');
    setShowAddRegionInput(false);
    showNotification(`New region "${target}" added!`);
  };

  // Check auth session & listen for inquiry updates
  useEffect(() => {
    const checkAuthSession = async () => {
      const hasLocalAuth =
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('admin_auth') === 'true' || localStorage.getItem('admin_auth') === 'true');

      if (hasLocalAuth) {
        setAuthenticated(true);
        setAuthChecking(false);
        fetchAllData();
      }

      try {
        const res = await fetch('/api/auth', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('admin_auth', 'true');
              localStorage.setItem('admin_auth', 'true');
            }
            setAuthenticated(true);
            setAuthChecking(false);
            if (!hasLocalAuth) {
              fetchAllData();
            }
            return;
          }
        }
      } catch (e) {}

      if (!hasLocalAuth) {
        setAuthenticated(false);
      }
      setAuthChecking(false);
    };

    checkAuthSession();


    const handleInquiriesUpdated = () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_inquiries_cache');
        if (cached) {
          try {
            setInquiries(JSON.parse(cached));
          } catch (e) {}
        }
      }
    };
    window.addEventListener('inquiries_updated', handleInquiriesUpdated);
    return () => window.removeEventListener('inquiries_updated', handleInquiriesUpdated);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const inputPass = (password || passcode || 'admin123').trim();
      const inputUser = (username || 'admin').trim();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'login', username: inputUser, password: inputPass, passcode: inputPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_auth', 'true');
          localStorage.setItem('admin_auth', 'true');
        }
        setAuthenticated(true);
        setAuthChecking(false);
        fetchAllData();
      } else {
        setAuthError(data.error || 'Invalid credentials. Default: admin / admin123');
      }
    } catch (err: any) {
      setAuthError('Server error during login');
    }
  };

  const handleSendForgotCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setForgotSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'forgot-password', email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg(data.message);
        setForgotStep(2);
      } else {
        setForgotError(data.error || 'Failed to send reset code.');
      }
    } catch (err) {
      setForgotError('Server error while sending reset code.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setForgotSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'reset-password',
          email: forgotEmail,
          code: otpCodeInput,
          newPassword: newPasswordInput,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg(data.message);
        setPassword(newPasswordInput);
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotError('');
          setForgotMsg('');
        }, 2200);
      } else {
        setForgotError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setForgotError('Server error while resetting password.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_auth');
      localStorage.removeItem('admin_auth');
    }
    setAuthenticated(false);
    setAuthChecking(false);
  };

  const adminFetch = (url: string, options: RequestInit = {}) => {
    const headers = (options.headers || {}) as Record<string, string>;
    return fetch(url, {
      credentials: 'include',
      cache: 'no-store',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-auth': 'true',
        ...headers,
      },
    });
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sRes, dRes, iRes, rRes, setRes, bRes, fRes] = await Promise.all([
        adminFetch('/api/safaris'),
        adminFetch('/api/destinations'),
        adminFetch('/api/inquiries'),
        adminFetch('/api/reviews'),
        adminFetch('/api/settings'),
        adminFetch('/api/blogs'),
        adminFetch('/api/faqs'),
      ]);

      if (sRes.ok) {
        const safData = await sRes.json();
        setSafaris(safData);
        if (Array.isArray(safData)) {
          safData.forEach((s: any) => {
            if (s.category) {
              setCategoriesList((prev) => {
                if (!prev.includes(s.category)) {
                  const updated = [...prev, s.category];
                  if (typeof window !== 'undefined') localStorage.setItem('custom_safari_categories', JSON.stringify(updated));
                  return updated;
                }
                return prev;
              });
            }
            if (s.region) {
              setRegionsList((prev) => {
                if (!prev.includes(s.region)) {
                  const updated = [...prev, s.region];
                  if (typeof window !== 'undefined') localStorage.setItem('custom_safari_regions', JSON.stringify(updated));
                  return updated;
                }
                return prev;
              });
            }
          });
        }
      }
      if (dRes.ok) {
        const dData = await dRes.json();
        setDestinations(dData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_destinations_cache', JSON.stringify(dData));
          window.dispatchEvent(new Event('destinations_updated'));
        }
      }
      if (iRes.ok) {
        const inqData = await iRes.json();
        if (Array.isArray(inqData)) {
          setInquiries(inqData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_inquiries_cache', JSON.stringify(inqData));
          }
        }
      } else if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_inquiries_cache');
        if (cached) setInquiries(JSON.parse(cached));
      }
      if (rRes.ok) {
        const revData = await rRes.json();
        if (Array.isArray(revData)) {
          setReviews(revData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_reviews_cache', JSON.stringify(revData));
            window.dispatchEvent(new Event('reviews_updated'));
          }
        }
      } else if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_reviews_cache');
        if (cached) setReviews(JSON.parse(cached));
      }
      if (setRes.ok) {
        const fetchedSet = await setRes.json();

        // Keep boolean false values - only strip null/undefined/empty-string (not false)
        const keepValue = (v: any) => {
          if (v === null || v === undefined) return false;
          if (typeof v !== 'boolean' && v === '') return false;
          return true;
        };

        let cachedSettings: any = {};
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem('site_settings_cache');
            if (cached) cachedSettings = JSON.parse(cached);
          } catch (e) {}
        }

        const cleanCachedSettings = Object.fromEntries(
          Object.entries(cachedSettings || {}).filter(([_, v]) => keepValue(v))
        );
        const cleanFetchedSet = Object.fromEntries(
          Object.entries(fetchedSet || {}).filter(([_, v]) => keepValue(v))
        );

        // API is authoritative - fetchedSet overrides localStorage cache
        const mergedSet: any = { ...cleanCachedSettings, ...cleanFetchedSet };

        // Always prefer API values for these special fields
        if (fetchedSet?.termsContent !== undefined && fetchedSet?.termsContent !== null) {
          mergedSet.termsContent = fetchedSet.termsContent;
        } else if (cachedSettings?.termsContent) {
          mergedSet.termsContent = cachedSettings.termsContent;
        }
        if (fetchedSet?.privacyContent !== undefined && fetchedSet?.privacyContent !== null) {
          mergedSet.privacyContent = fetchedSet.privacyContent;
        } else if (cachedSettings?.privacyContent) {
          mergedSet.privacyContent = cachedSettings.privacyContent;
        }
        if (fetchedSet?.siteExperiences !== undefined && fetchedSet?.siteExperiences !== null) {
          mergedSet.siteExperiences = fetchedSet.siteExperiences;
        } else if (cachedSettings?.siteExperiences !== undefined && cachedSettings?.siteExperiences !== null) {
          mergedSet.siteExperiences = cachedSettings.siteExperiences;
        }

        // Always prefer API value for boolean toggles (even if false)
        const boolFields = ['enableCloudinary','enableRobotsIndex','enableAnnouncementBanner','showGoogleMapInFooter'];
        for (const bf of boolFields) {
          if (fetchedSet?.[bf] !== undefined && fetchedSet?.[bf] !== null) {
            mergedSet[bf] = fetchedSet[bf];
          }
        }

        if (!mergedSet.siteLogo && cachedSettings?.siteLogo) mergedSet.siteLogo = cachedSettings.siteLogo;
        if (!mergedSet.siteLogo && settings?.siteLogo) mergedSet.siteLogo = settings.siteLogo;
        if (!mergedSet.siteFavicon && cachedSettings?.siteFavicon) mergedSet.siteFavicon = cachedSettings.siteFavicon;
        if (!mergedSet.siteFavicon && settings?.siteFavicon) mergedSet.siteFavicon = settings.siteFavicon;

        setSettings(mergedSet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_settings_cache', JSON.stringify(mergedSet));
        }
      }
      if (bRes && bRes.ok) {
        const blogData = await bRes.json();
        if (Array.isArray(blogData)) {
          setBlogs(blogData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_blogs_cache', JSON.stringify(blogData));
            window.dispatchEvent(new Event('blogs_updated'));
          }
        }
      } else if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_blogs_cache');
        if (cached) setBlogs(JSON.parse(cached));
      }
      if (fRes && fRes.ok) {
        const faqData = await fRes.json();
        if (Array.isArray(faqData)) {
          setFaqs(faqData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_faqs_cache', JSON.stringify(faqData));
            window.dispatchEvent(new Event('faqs_updated'));
          }
        }
      } else if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_faqs_cache');
        if (cached) setFaqs(JSON.parse(cached));
      }
    } catch (e) {
      console.error(e);
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('site_reviews_cache');
        if (cached) setReviews(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setMsg(message);
    setTimeout(() => setMsg(''), 3000);
  };

  // --- SAFARI CRUD ---
  const handleSaveSafari = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingSafari ? `/api/safaris/${editingSafari.id}` : '/api/safaris';
      const method = editingSafari ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(safariForm),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showNotification(`Error: ${errorData.error || 'Failed to save journey package'}`);
        alert(`Could not save package: ${errorData.error || 'Invalid input or server error'}`);
        setSaving(false);
        return;
      }

      const savedItem = await res.json();

      setSafaris((prev) => {
        let updated;
        if (editingSafari) {
          updated = prev.map((s) => (s.id === editingSafari.id ? { ...s, ...savedItem } : s));
        } else {
          updated = [savedItem, ...prev];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_safaris_cache', JSON.stringify(updated));
        }
        return updated;
      });

      showNotification(editingSafari ? 'Safari package updated!' : 'New Safari created!');
      setSaveSuccessModal(editingSafari ? 'Safari package updated successfully!' : 'New Safari tour package created successfully!');
      setSafariViewMode('list');
      setEditingSafari(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Network error while saving journey package.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSafari = async (id: string) => {
    if (!confirm('Are you sure you want to delete this safari package?')) return;
    try {
      await adminFetch(`/api/safaris/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setSafaris((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_safaris_cache', JSON.stringify(updated));
      }
      return updated;
    });
    showNotification('Safari deleted');
    fetchAllData();
    router.refresh();
  };

  const openSafariEdit = (safari: any) => {
    setEditingSafari(safari);
    setSafariForm({
      title: safari.title,
      priceUSD: safari.priceUSD.toString(),
      days: safari.days.toString(),
      nights: safari.nights.toString(),
      category: safari.category,
      region: safari.region,
      badge: safari.badge || '',
      image: safari.image,
      route: safari.route,
      startingLocation: safari.startingLocation || 'Chennai',
      endingLocation: safari.endingLocation || 'Kochi',
      bestTimeToTravel: safari.bestTimeToTravel || 'October to April',
      accommodation: safari.accommodation,
      description: safari.description,
      inclusions: safari.inclusions,
      exclusions: safari.exclusions,
      itineraries: safari.itineraries || '[]',
      metaTitle: safari.metaTitle || '',
      metaDescription: safari.metaDescription || '',
      keywords: safari.keywords || '',
    });
    setSafariViewMode('editor');
  };

  // --- DESTINATION CRUD ---
  const handleSaveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingDest ? `/api/destinations/${editingDest.id}` : '/api/destinations';
      const method = editingDest ? 'PUT' : 'POST';

      const payload = {
        ...destForm,
        size: (destForm.size || 'short').toLowerCase(),
      };

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showNotification(`Error: ${errData.error || 'Failed to save destination'}`);
        alert(`Could not save destination: ${errData.error || 'Invalid payload or server error'}`);
        setSaving(false);
        return;
      }

      const savedItem = await res.json();

      setDestinations((prev) => {
        let updated;
        if (editingDest) {
          updated = prev.map((d) => (d.id === editingDest.id ? { ...d, ...savedItem } : d));
        } else {
          updated = [savedItem, ...prev];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_destinations_cache', JSON.stringify(updated));
          window.dispatchEvent(new Event('destinations_updated'));
        }
        return updated;
      });

      showNotification('Destination saved!');
      setSaveSuccessModal('Destination details saved successfully!');
      setDestModal(false);
      setEditingDest(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Network error while saving destination.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDest = async (id: string) => {
    if (!confirm('Delete destination?')) return;
    await adminFetch(`/api/destinations/${id}`, { method: 'DELETE' });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('destinations_updated'));
    }
    showNotification('Destination deleted');
    fetchAllData();
    router.refresh();
  };

  // --- INQUIRIES CRM HANDLERS ---
  const updateInquiryStatus = async (id: string, status: string, customLostReason = '') => {
    let lostReason = customLostReason;
    if (status === 'Lost' && !lostReason) {
      lostReason = prompt('Please enter the reason for losing this lead (e.g. Budget too low, Chose competitor, Travel cancelled):') || 'Client did not proceed';
    }

    setInquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status, lostReason } : item));
      if (typeof window !== 'undefined') localStorage.setItem('site_inquiries_cache', JSON.stringify(updated));
      return updated;
    });

    try {
      await adminFetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, lostReason }),
      });
    } catch (e) {}

    showNotification(`Lead stage changed to ${status}`);
    fetchAllData();
    router.refresh();
  };

  const handleSaveLeadCrm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setSaving(true);
    try {
      const proposalNum = parseFloat(leadForm.proposalAmount) || 0;
      setInquiries((prev) => {
        const updated = prev.map((item) => (item.id === editingLead.id ? { ...item, ...leadForm, proposalAmount: proposalNum } : item));
        if (typeof window !== 'undefined') localStorage.setItem('site_inquiries_cache', JSON.stringify(updated));
        return updated;
      });

      await adminFetch(`/api/inquiries/${editingLead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...leadForm,
          proposalAmount: proposalNum,
        }),
      });

      showNotification('Lead CRM record updated successfully!');
      setSaveSuccessModal('Lead CRM record updated successfully!');
      setInquiryViewMode('list');
      setEditingLead(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete inquiry log?')) return;
    setInquiries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('site_inquiries_cache', JSON.stringify(updated));
      return updated;
    });

    try {
      await adminFetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (e) {}

    showNotification('Inquiry deleted');
    fetchAllData();
    router.refresh();
  };

  // --- REVIEWS CRUD ---
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(reviewForm),
      });

      let savedReview: any = null;
      if (res.ok) {
        savedReview = await res.json();
      } else {
        savedReview = {
          id: editingReview ? editingReview.id : `rev-${Date.now()}`,
          author: reviewForm.author,
          country: reviewForm.country,
          countryFlag: reviewForm.countryFlag || 'US',
          rating: parseInt(reviewForm.rating) || 5,
          text: reviewForm.text,
        };
      }

      setReviews((prev) => {
        let updated;
        if (editingReview) {
          updated = prev.map((r) => (r.id === editingReview.id ? savedReview : r));
        } else {
          updated = [savedReview, ...prev];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_reviews_cache', JSON.stringify(updated));
          window.dispatchEvent(new Event('reviews_updated'));
        }
        return updated;
      });

      showNotification('Review saved!');
      setSaveSuccessModal('Guest review testimonial saved successfully!');
      setReviewModal(false);
      setEditingReview(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete review?')) return;
    try {
      await adminFetch(`/api/reviews/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_reviews_cache', JSON.stringify(updated));
        window.dispatchEvent(new Event('reviews_updated'));
      }
      return updated;
    });
    showNotification('Review deleted');
    fetchAllData();
    router.refresh();
  };

  // --- BLOG POSTS CRUD ---
  const handleSaveBlog = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(blogForm),
      });

      let savedBlog: any = null;
      if (res.ok) {
        savedBlog = await res.json();
      } else {
        savedBlog = {
          id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
          ...blogForm,
          createdAt: new Date().toISOString(),
        };
      }

      setBlogs((prev) => {
        let updated;
        if (editingBlog) {
          updated = prev.map((b) => (b.id === editingBlog.id ? savedBlog : b));
        } else {
          updated = [savedBlog, ...prev];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_blogs_cache', JSON.stringify(updated));
          window.dispatchEvent(new Event('blogs_updated'));
        }
        return updated;
      });

      showNotification(editingBlog ? 'Blog article updated!' : 'New Blog article published!');
      setSaveSuccessModal(editingBlog ? 'Blog article updated successfully!' : 'New Blog article published successfully and is now live!');
      setBlogViewMode('list');
      setEditingBlog(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await adminFetch(`/api/blogs/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setBlogs((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_blogs_cache', JSON.stringify(updated));
        window.dispatchEvent(new Event('blogs_updated'));
      }
      return updated;
    });
    showNotification('Blog article deleted');
    fetchAllData();
    router.refresh();
  };

  // --- FAQ CRUD ---
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs';
      const method = editingFaq ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(faqForm),
      });

      let savedItem: any = null;
      if (res.ok) {
        savedItem = await res.json();
      } else {
        savedItem = {
          id: editingFaq ? editingFaq.id : `faq-${Date.now()}`,
          ...faqForm,
        };
      }

      setFaqs((prev) => {
        let updated;
        if (editingFaq) {
          updated = prev.map((f) => (f.id === editingFaq.id ? { ...f, ...savedItem } : f));
        } else {
          updated = [savedItem, ...prev];
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_faqs_cache', JSON.stringify(updated));
          window.dispatchEvent(new Event('faqs_updated'));
        }
        return updated;
      });

      showNotification(editingFaq ? 'FAQ question updated!' : 'New FAQ question added!');
      setSaveSuccessModal(editingFaq ? 'FAQ question updated successfully!' : 'New FAQ question added successfully and live-synced to the website!');
      setFaqModal(false);
      setEditingFaq(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ question?')) return;
    try {
      await adminFetch(`/api/faqs/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setFaqs((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_faqs_cache', JSON.stringify(updated));
        window.dispatchEvent(new Event('faqs_updated'));
      }
      return updated;
    });
    showNotification('FAQ question deleted');
    fetchAllData();
    router.refresh();
  };

  // --- SETTINGS CMS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      let updatedSettings = { ...settings };
      if (res.ok) {
        const resData = await res.json();
        // Keep boolean false — only strip null/undefined/empty-string
        const cleanResData = Object.fromEntries(
          Object.entries(resData || {}).filter(([_, v]) => {
            if (v === null || v === undefined) return false;
            if (typeof v !== 'boolean' && v === '') return false;
            return true;
          })
        );
        updatedSettings = { ...settings, ...cleanResData };
        // Force-apply boolean toggles from API (even if false)
        const boolFields = ['enableCloudinary','enableRobotsIndex','enableAnnouncementBanner','showGoogleMapInFooter'];
        for (const bf of boolFields) {
          if (resData?.[bf] !== undefined && resData?.[bf] !== null) {
            updatedSettings[bf] = resData[bf];
          }
        }
      }
      if (!updatedSettings.siteLogo && settings.siteLogo) {
        updatedSettings.siteLogo = settings.siteLogo;
      }
      if (!updatedSettings.siteFavicon && settings.siteFavicon) {
        updatedSettings.siteFavicon = settings.siteFavicon;
      }
      setSettings(updatedSettings);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_settings_cache', JSON.stringify(updatedSettings));
        window.dispatchEvent(new Event('site_settings_updated'));
      }
      const title = activeTab === 'legal' ? 'LEGAL CONTENT' : activeTab === 'about' ? 'ABOUT PAGE' : settingsSubTab.toUpperCase();
      showNotification(`${title} Settings updated!`);
      setSaveSuccessModal(`${title} Settings have been saved successfully and live-synced to the website!`);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
      if (typeof window !== 'undefined') {
        localStorage.setItem('site_settings_cache', JSON.stringify(settings));
        window.dispatchEvent(new Event('site_settings_updated'));
      }
      const title = activeTab === 'legal' ? 'LEGAL CONTENT' : activeTab === 'about' ? 'ABOUT PAGE' : settingsSubTab.toUpperCase();
    } finally {
      setSaving(false);
    }
  };

  // --- HOME ITINERARY DAY STEPS CRUD ---
  const handleSaveHomeItineraryStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let currentItems = [...homeItineraryItemsList];
      if (editingItineraryIndex !== null) {
        currentItems[editingItineraryIndex] = { ...itineraryForm };
      } else {
        currentItems.push({ ...itineraryForm });
      }

      const updatedSettings = {
        ...settings,
        homeItineraries: JSON.stringify(currentItems),
      };

      setSettings(updatedSettings);

      const res = await adminFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(updatedSettings),
      });

      if (res.ok) {
        const fresh = await res.json();
        setSettings(fresh);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('site_settings_cache', JSON.stringify(updatedSettings));
      }

      showNotification('Home itinerary day step saved!');
      setSaveSuccessModal('Home itinerary day step saved successfully and live-synced to the homepage!');
      setItineraryModalOpen(false);
      setEditingItineraryIndex(null);
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // --- EXPERIENCES POPUP MODAL CRUD ---
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const defaultExps: any[] = [];
      let list = safeParseList(settings?.siteExperiences, defaultExps);
      const newEntry = {
        title: experienceForm.title || 'Untitled Experience',
        subtitle: experienceForm.subtitle || 'South India Tour Highlight',
        desc: experienceForm.desc || '',
        description: experienceForm.desc || '',
        image: experienceForm.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      };

      if (editingExperienceIndex !== null && editingExperienceIndex >= 0 && editingExperienceIndex < list.length) {
        list[editingExperienceIndex] = newEntry;
      } else {
        list.push(newEntry);
      }

      const experiencesJson = JSON.stringify(list);
      const updatedSettings = { ...settings, siteExperiences: experiencesJson };
      setSettings(updatedSettings);

      const res = await adminFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({ siteExperiences: experiencesJson }),
      });

      let resData = updatedSettings;
      if (res.ok) {
        resData = await res.json();
      }
      const finalSettings = { ...updatedSettings, ...resData, siteExperiences: experiencesJson };
      setSettings(finalSettings);

      if (typeof window !== 'undefined') {
        localStorage.setItem('site_settings_cache', JSON.stringify(finalSettings));
        window.dispatchEvent(new Event('site_settings_updated'));
      }

      showNotification(editingExperienceIndex !== null ? 'Experience updated & live-synced!' : 'New experience added & published live!');
      setShowExperienceModal(false);
      setEditingExperienceIndex(null);
      fetchAllData();
      router.refresh();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHomeItineraryStep = async (indexToDelete: number) => {
    if (!confirm('Are you sure you want to delete this itinerary day step?')) return;
    setSaving(true);
    try {
      const currentItems = homeItineraryItemsList.filter((_: any, idx: number) => idx !== indexToDelete);
      const updatedSettings = {
        ...settings,
        homeItineraries: JSON.stringify(currentItems),
      };

      setSettings(updatedSettings);

      await adminFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(updatedSettings),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('site_settings_cache', JSON.stringify(updatedSettings));
      }

      showNotification('Itinerary day step deleted');
      setSaveSuccessModal('Itinerary day step deleted successfully!');
      fetchAllData();
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // ADMIN LOADING & LOGIN SCREENS
  // ----------------------------------------------------
  if (authChecking) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center space-y-4 p-4 relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center shadow-lg">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <span className="text-xs font-semibold text-stone-400 tracking-widest uppercase font-mono">
          Loading Control Panel...
        </span>
      </div>
    );
  }

  if (!authenticated) {

    return (
      <div className="min-h-screen text-stone-100 flex items-center justify-center p-4 relative overflow-hidden bg-stone-950">
        {/* Safari Tour Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=90')`,
          }}
        />
        {/* Dark Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/80 to-stone-950/90 backdrop-blur-sm" />

        {/* Ambient Background Gold Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#141210]/90 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10 hover:border-orange-500/50 transition-all">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-orange-900/30 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
              CMS Control Portal
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">You & Me Independent Voyage Admin</h1>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">Enter your admin credentials to manage website content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-stone-400 font-semibold block mb-1">Username / Email</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@youandmevoyage.com"
                  className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg pl-9 pr-4 py-3 text-sm outline-none focus:border-primary font-sans"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-stone-400 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(username || 'youandmevoyage@gmail.com');
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasscode(e.target.value);
                  }}
                  placeholder="Default: admin123"
                  className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg pl-9 pr-12 py-3 text-sm outline-none focus:border-primary font-sans"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-orange-400 p-1.5 rounded-lg z-20 cursor-pointer transition-colors"
                  aria-label="Toggle password visibility"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-orange-400" /> : <Eye className="w-4 h-4 text-stone-400" />}
                </button>
              </div>
            </div>

            {authError && <p className="text-xs text-rose-400 text-center font-medium bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/60">{authError}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-gold-gradient py-3 text-sm font-semibold text-stone-950 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Authenticate Admin
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-stone-500 hover:text-primary flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Front-End Site
              </Link>
            </div>
          </form>
        </div>

        {/* FORGOT PASSWORD RESET MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#141210] border border-orange-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 relative animate-in zoom-in-95">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep(1);
                  setForgotError('');
                  setForgotMsg('');
                }}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-100">Reset Admin Password</h3>
                <p className="text-xs text-stone-400 mt-1">
                  {forgotStep === 1
                    ? 'Enter your registered Admin Email address to receive a 6-digit confirmation code.'
                    : `Enter the 6-digit code sent to ${forgotEmail} and set your new password.`}
                </p>
              </div>

              {forgotError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl text-center">
                  {forgotError}
                </div>
              )}

              {forgotMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl text-center space-y-1">
                  <p>{forgotMsg}</p>
                  {previewOtp && (
                    <div className="mt-2 p-2 bg-stone-900 border border-orange-500/40 rounded-lg text-center">
                      <span className="text-[10px] text-orange-400 uppercase tracking-widest block font-semibold">Dev Verification Code:</span>
                      <strong className="font-mono text-lg text-orange-300 tracking-widest">{previewOtp}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: ENTER ADMIN EMAIL */}
              {forgotStep === 1 ? (
                <form onSubmit={handleSendForgotCode} className="space-y-4">
                  <div>
                    <label className="text-xs text-stone-400 font-semibold block mb-1">Admin Email Address</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="info@discoverysafaris.com"
                      className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="w-full rounded-lg bg-gold-gradient py-3 text-sm font-semibold text-stone-950 shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {forgotSubmitting ? 'Sending Security Code...' : 'Send Confirmation Code'}
                  </button>
                </form>
              ) : (
                /* STEP 2: ENTER 6-DIGIT OTP & NEW PASSWORD */
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-stone-400 font-semibold block mb-1">6-Digit Verification Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCodeInput}
                      onChange={(e) => setOtpCodeInput(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full bg-stone-900 border border-orange-500/50 text-orange-300 font-mono tracking-widest text-center text-lg rounded-lg py-2.5 outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-400 font-semibold block mb-1">New Admin Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="w-1/3 rounded-lg bg-stone-900 border border-stone-800 py-3 text-xs font-semibold text-stone-400 hover:text-stone-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgotSubmitting}
                      className="w-2/3 rounded-lg bg-gold-gradient py-3 text-xs font-semibold text-stone-950 shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {forgotSubmitting ? 'Updating...' : 'Update Password & Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#141210] border-b border-stone-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Icon Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-primary hover:border-stone-700 transition-all flex items-center gap-2"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-4.5 h-4.5 text-[#F97316]" />
            <span className="text-xs font-semibold hidden sm:inline text-stone-300">
              {sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </span>
          </button>

          <span className="text-stone-700">|</span>

          <Link href="/" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" /> View Site
          </Link>
          <span className="text-stone-700">|</span>
          <h1 className="font-serif font-bold text-lg text-stone-100">
            You & Me Independent Voyage <span className="text-primary text-xs uppercase font-sans">CMS Control Panel</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {msg && (
            <span className="text-xs bg-emerald-950 border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded-full font-medium animate-pulse">
              {msg}
            </span>
          )}

          {/* Interactive Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-primary hover:border-stone-700 transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-black font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {notifications.filter((n) => n.unread).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Box */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-[#141210] border border-stone-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="font-serif text-xs font-bold text-stone-100 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#F97316]" /> System Notifications
                  </span>
                  <button
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                    }}
                    className="text-[10px] text-[#F97316] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-stone-500 text-center py-4">No notifications.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                          notif.unread
                            ? 'bg-[#181614] border-[#F97316]/40 text-stone-100'
                            : 'bg-stone-900/40 border-stone-800 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-stone-200">{notif.title}</span>
                          <span className="text-[9px] text-stone-500">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed">{notif.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button next to Notification Bell */}
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_auth');
              setAuthenticated(false);
              setPasscode('');
            }}
            title="Logout Admin Session"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:bg-rose-900/80 hover:text-rose-200 transition-all text-xs font-bold shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={fetchAllData}
            title="Refresh Data"
            className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-primary transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <nav
          className={`bg-[#0e0c0a] border-r border-stone-800/80 p-4 flex flex-col justify-between shrink-0 transition-all duration-300 ${
            sidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-64'
          }`}
        >
          <div className="space-y-1">
            {/* 1. Overview Dashboard */}
            <button
              onClick={() => setActiveTab('overview')}
              title="Overview Dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Overview Dashboard</span>}
            </button>

            {/* 2. Journeys Collection */}
            <button
              onClick={() => setActiveTab('safaris')}
              title="Journeys Collection"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'safaris' ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Journeys Collection</span>}
              </span>
              {!sidebarCollapsed && (
                <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[10px]">{safaris.length}</span>
              )}
            </button>

            {/* 3. Destinations */}
            <button
              onClick={() => setActiveTab('destinations')}
              title="Destinations"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'destinations' ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Compass className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Destinations</span>}
              </span>
              {!sidebarCollapsed && (
                <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[10px]">{destinations.length}</span>
              )}
            </button>

            {/* 4. Quote Requests */}
            <button
              onClick={() => setActiveTab('inquiries')}
              title="Quote Requests"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inquiries' ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Quote Requests</span>}
              </span>
              {!sidebarCollapsed && (
                <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold">
                  {inquiries.filter((i) => i.status === 'Pending').length} new
                </span>
              )}
            </button>

            {/* 5. Guest Reviews */}
            <button
              onClick={() => setActiveTab('reviews')}
              title="Guest Reviews"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reviews' ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Star className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Guest Reviews</span>}
              </span>
              {!sidebarCollapsed && (
                <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[10px]">{reviews.length}</span>
              )}
            </button>

            {/* 6. CMS Accordion (Parent Module) */}
            <div className="space-y-1">
              <button
                onClick={() => setCmsExpanded(!cmsExpanded)}
                title="CMS Content Modules"
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  ['blogs', 'faqs', 'about', 'legal', 'itineraries'].includes(activeTab)
                    ? 'bg-stone-800 text-stone-100 font-bold border-l-2 border-[#F97316]'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Layout className="w-4 h-4 shrink-0 text-[#F97316]" />
                  {!sidebarCollapsed && <span>CMS</span>}
                </span>
                {!sidebarCollapsed && (
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${cmsExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Collapsible Sub-modules Menu */}
              {cmsExpanded && (
                <div className={`space-y-1 ${sidebarCollapsed ? '' : 'pl-3 ml-3 border-l border-stone-800/80'}`}>
                  {/* Sub 1: Blog Posts */}
                  <button
                    onClick={() => setActiveTab('blogs')}
                    title="Blog Posts"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'blogs'
                        ? 'bg-primary text-black font-bold'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      {!sidebarCollapsed && <span>Blog Posts</span>}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded text-[10px]">{blogs.length}</span>
                    )}
                  </button>

                  {/* Sub 2: FAQ */}
                  <button
                    onClick={() => setActiveTab('faqs')}
                    title="FAQ"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'faqs'
                        ? 'bg-primary text-black font-bold'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#F97316]" />
                      {!sidebarCollapsed && <span>FAQ</span>}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded text-[10px]">{faqs.length}</span>
                    )}
                  </button>

                  {/* Sub 3: Legal & Terms */}
                  <button
                    onClick={() => setActiveTab('legal')}
                    title="Legal & Terms"
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'legal'
                        ? 'bg-primary text-black font-bold'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0 text-[#F97316]" />
                    {!sidebarCollapsed && <span>Legal & Terms</span>}
                  </button>

                  {/* Sub 5: Experiences CMS */}
                  <button
                    onClick={() => setActiveTab('experiences')}
                    title="Experiences Page"
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === 'experiences'
                        ? 'bg-primary text-black font-bold'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#F97316]" />
                    {!sidebarCollapsed && <span>Experiences CMS</span>}
                  </button>
                </div>
              )}
            </div>



            {/* 8. Site Settings & CMS */}
            <button
              onClick={() => setActiveTab('settings')}
              title="Site Settings & CMS"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings' ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Site Settings & CMS</span>}
            </button>
          </div>

          {/* SIDEBAR BOTTOM LOGOUT SECTION */}
          <div className="pt-6 border-t border-stone-800/80 space-y-3 mt-8">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 px-3 py-2 bg-[#141210] border border-stone-800 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  DS
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-xs font-bold text-stone-200 block truncate">Discovery Admin</strong>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Session
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold text-xs">
                DS
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Logout Account"
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 hover:text-rose-200 transition-all shadow-md ${
                sidebarCollapsed ? 'px-2' : ''
              }`}
            >
              <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
              {!sidebarCollapsed && <span>Logout Account</span>}
            </button>
          </div>
        </nav>

        {/* Workspace Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (() => {
            const filteredInquiries = getFilteredItems(inquiries);
            const filteredReviews = getFilteredItems(reviews);

            return (
              <div className="space-y-8">
                {/* Header & Date Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                      <Compass className="w-6 h-6 text-[#F97316]" /> Dashboard Overview
                    </h2>
                    <p className="text-xs text-stone-400 mt-1">Real-time status, booking analytics, and filtered website activities</p>
                  </div>

                  {/* Filter Toolbar: Today | Week | Month | Custom | All */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#141210] border border-stone-800 p-1.5 rounded-xl shadow-lg">
                    <span className="text-[11px] text-stone-400 font-semibold px-2 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-[#F97316]" /> Date Filter:
                    </span>

                    <button
                      onClick={() => setDateFilter('today')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        dateFilter === 'today'
                          ? 'bg-[#F97316] text-stone-950 font-bold shadow-md'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      Today
                    </button>

                    <button
                      onClick={() => setDateFilter('week')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        dateFilter === 'week'
                          ? 'bg-[#F97316] text-stone-950 font-bold shadow-md'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      This Week
                    </button>

                    <button
                      onClick={() => setDateFilter('month')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        dateFilter === 'month'
                          ? 'bg-[#F97316] text-stone-950 font-bold shadow-md'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      This Month
                    </button>

                    <button
                      onClick={() => setDateFilter('custom')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                        dateFilter === 'custom'
                          ? 'bg-[#F97316] text-stone-950 font-bold shadow-md'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" /> Custom
                    </button>

                    <button
                      onClick={() => setDateFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        dateFilter === 'all'
                          ? 'bg-[#F97316] text-stone-950 font-bold shadow-md'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      All Time
                    </button>
                  </div>
                </div>

                {/* Custom Date Range Picker when Custom filter selected */}
                {dateFilter === 'custom' && (
                  <div className="flex flex-wrap items-center gap-4 bg-[#141210] border border-stone-800 p-4 rounded-xl shadow-xl text-xs animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <label className="text-stone-400 font-semibold">Start Date:</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="bg-stone-900 border border-stone-700 text-stone-100 px-3 py-1.5 rounded-lg outline-none focus:border-[#F97316]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-stone-400 font-semibold">End Date:</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="bg-stone-900 border border-stone-700 text-stone-100 px-3 py-1.5 rounded-lg outline-none focus:border-[#F97316]"
                      />
                    </div>
                    {(customStartDate || customEndDate) && (
                      <button
                        onClick={() => {
                          setCustomStartDate('');
                          setCustomEndDate('');
                        }}
                        className="text-[11px] text-rose-400 hover:underline font-semibold ml-auto"
                      >
                        Clear Date Range
                      </button>
                    )}
                  </div>
                )}

                {/* Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 1. TOTAL SAFARIS CARD */}
                  <div className="bg-[#141210] border border-stone-800 p-6 rounded-2xl space-y-3 shadow-xl relative overflow-hidden group hover:border-[#F97316]/60 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Total Journeys</span>
                      <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-[#F97316] group-hover:text-stone-950 transition-all duration-300">
                        <Compass className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <strong className="text-3xl font-serif font-bold text-stone-100 block">{safaris.length}</strong>
                      <span className="text-[11px] text-stone-500 mt-1 block">Active tours on front-end</span>
                    </div>
                  </div>

                  {/* 2. QUOTE INQUIRIES CARD */}
                  <div className="bg-[#141210] border border-stone-800 p-6 rounded-2xl space-y-3 shadow-xl relative overflow-hidden group hover:border-orange-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Quote Inquiries</span>
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-orange-400 group-hover:text-stone-950 transition-all duration-300">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <strong className="text-3xl font-serif font-bold text-orange-400 block">{filteredInquiries.length}</strong>
                      <span className="text-[11px] text-orange-500/90 font-medium mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                        {filteredInquiries.filter((i) => i.status === 'Pending').length} pending action
                      </span>
                    </div>
                  </div>

                  {/* 3. DESTINATIONS CARD */}
                  <div className="bg-[#141210] border border-stone-800 p-6 rounded-2xl space-y-3 shadow-xl relative overflow-hidden group hover:border-sky-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Destinations</span>
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-stone-950 transition-all duration-300">
                        <Globe className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <strong className="text-3xl font-serif font-bold text-stone-100 block">{destinations.length}</strong>
                      <span className="text-[11px] text-stone-500 mt-1 block">Featured travel regions</span>
                    </div>
                  </div>

                  {/* 4. GUEST REVIEWS CARD */}
                  <div className="bg-[#141210] border border-stone-800 p-6 rounded-2xl space-y-3 shadow-xl relative overflow-hidden group hover:border-yellow-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Guest Reviews</span>
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-stone-950 transition-all duration-300">
                        <Star className="w-5 h-5 fill-yellow-400/20" />
                      </div>
                    </div>
                    <div>
                      <strong className="text-3xl font-serif font-bold text-stone-100 block">{filteredReviews.length}</strong>
                      <span className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                        <span className="text-yellow-400 font-bold">★ 4.9/5</span> Average Rating
                      </span>
                    </div>
                  </div>
                </div>                {/* DASHBOARD GRAPH / ANALYTICS SECTION */}
                {(() => {
                  // Determine Chart X-Axis Labels & EXACT Inquiry Counts based on active dateFilter mode
                  const getChartConfig = () => {
                    const totalLeads = filteredInquiries.length;

                    if (dateFilter === 'today') {
                      const slots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
                      const counts = new Array(8).fill(0);

                      if (totalLeads > 0) {
                        filteredInquiries.forEach((inq, idx) => {
                          if (inq.createdAt) {
                            const d = new Date(inq.createdAt);
                            if (!isNaN(d.getTime())) {
                              const hr = d.getHours();
                              const slotIdx = Math.min(7, Math.max(0, Math.floor(hr / 3)));
                              counts[slotIdx] += 1;
                            } else {
                              counts[idx % 8] += 1;
                            }
                          } else {
                            counts[idx % 8] += 1;
                          }
                        });
                      }

                      const maxC = Math.max(...counts, 1);
                      return slots.map((label, i) => ({
                        label,
                        count: counts[i],
                        percentage: counts[i] > 0 ? Math.max(18, Math.round((counts[i] / maxC) * 100)) : 0,
                      }));
                    }

                    if (dateFilter === 'week') {
                      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                      const counts = new Array(7).fill(0);

                      if (totalLeads > 0) {
                        filteredInquiries.forEach((inq, idx) => {
                          if (inq.createdAt) {
                            const d = new Date(inq.createdAt);
                            if (!isNaN(d.getTime())) {
                              let dayIdx = d.getDay() - 1;
                              if (dayIdx < 0) dayIdx = 6;
                              counts[dayIdx] += 1;
                            } else {
                              counts[idx % 7] += 1;
                            }
                          } else {
                            counts[idx % 7] += 1;
                          }
                        });
                      }

                      const maxC = Math.max(...counts, 1);
                      return days.map((label, i) => ({
                        label,
                        count: counts[i],
                        percentage: counts[i] > 0 ? Math.max(18, Math.round((counts[i] / maxC) * 100)) : 0,
                      }));
                    }

                    if (dateFilter === 'month') {
                      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                      const counts = new Array(4).fill(0);

                      if (totalLeads > 0) {
                        filteredInquiries.forEach((inq, idx) => {
                          if (inq.createdAt) {
                            const d = new Date(inq.createdAt);
                            if (!isNaN(d.getTime())) {
                              const wIdx = Math.min(3, Math.floor((d.getDate() - 1) / 7));
                              counts[wIdx] += 1;
                            } else {
                              counts[idx % 4] += 1;
                            }
                          } else {
                            counts[idx % 4] += 1;
                          }
                        });
                      }

                      const maxC = Math.max(...counts, 1);
                      return weeks.map((label, i) => ({
                        label,
                        count: counts[i],
                        percentage: counts[i] > 0 ? Math.max(18, Math.round((counts[i] / maxC) * 100)) : 0,
                      }));
                    }

                    if (dateFilter === 'custom') {
                      const intervals = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];
                      const counts = new Array(6).fill(0);

                      if (totalLeads > 0) {
                        filteredInquiries.forEach((_, idx) => {
                          counts[idx % 6] += 1;
                        });
                      }

                      const maxC = Math.max(...counts, 1);
                      return intervals.map((label, i) => ({
                        label,
                        count: counts[i],
                        percentage: counts[i] > 0 ? Math.max(18, Math.round((counts[i] / maxC) * 100)) : 0,
                      }));
                    }

                    // All Time (by Month Jan-Aug)
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
                    const counts = new Array(8).fill(0);

                    const allLeads = inquiries;
                    if (allLeads.length > 0) {
                      allLeads.forEach((inq, idx) => {
                        if (inq.createdAt) {
                          const d = new Date(inq.createdAt);
                          if (!isNaN(d.getTime())) {
                            const mIdx = Math.min(7, d.getMonth());
                            counts[mIdx] += 1;
                          } else {
                            counts[idx % 8] += 1;
                          }
                        } else {
                          counts[idx % 8] += 1;
                        }
                      });
                    }

                    const maxC = Math.max(...counts, 1);
                    return months.map((label, i) => ({
                      label,
                      count: counts[i],
                      percentage: counts[i] > 0 ? Math.max(18, Math.round((counts[i] / maxC) * 100)) : 0,
                    }));
                  };

                  const displayGraph = getChartConfig();

                  // Dynamic Safari Category Share calculation
                  const catCounts: { [key: string]: number } = {};
                  safaris.forEach((s) => {
                    const cat = s.category || 'Private Safaris';
                    catCounts[cat] = (catCounts[cat] || 0) + 1;
                  });

                  const safariTotal = safaris.length || 1;
                  const categoryKeys = Object.keys(catCounts);
                  
                  const categoryShareList = categoryKeys.length > 0
                    ? categoryKeys.map((cat, idx) => {
                        const count = catCounts[cat];
                        const pct = Math.round((count / safariTotal) * 100);
                        const colors = [
                          { bg: 'bg-[#F97316]', text: 'text-[#F97316]' },
                          { bg: 'bg-orange-500', text: 'text-orange-400' },
                          { bg: 'bg-emerald-500', text: 'text-emerald-400' },
                          { bg: 'bg-sky-500', text: 'text-sky-400' },
                        ];
                        const colorObj = colors[idx % colors.length];
                        return { name: cat, percentage: pct, bg: colorObj.bg, text: colorObj.text, count };
                      })
                    : [
                        { name: 'Private Custom Journeys', percentage: 55, bg: 'bg-[#F97316]', text: 'text-[#F97316]', count: 3 },
                        { name: 'Heritage Temple Journeys', percentage: 30, bg: 'bg-orange-500', text: 'text-orange-400', count: 2 },
                        { name: 'Kerala Backwater Expeditions', percentage: 15, bg: 'bg-emerald-500', text: 'text-emerald-400', count: 1 },
                      ];


                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Monthly Booking & Inquiry Graph */}
                      <div className="lg:col-span-8 bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-[#F97316]" /> Inquiries & Visitor Analytics
                            </h3>
                            <p className="text-[11px] text-stone-400 font-sans">
                              Active Filter: <strong className="text-[#F97316] font-mono">{dateFilter.toUpperCase()}</strong> ({filteredInquiries.length} total leads)
                            </p>
                          </div>
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded font-bold flex items-center gap-1 font-mono">
                            <TrendingUp className="w-3 h-3" /> Exact Analytics Match
                          </span>
                        </div>

                        {/* Interactive Dynamic Bar Chart Graph with Fixed Track Heights */}
                        <div className="space-y-4 pt-2">
                          <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-stone-800">
                            {displayGraph.map((item, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group relative h-full">
                                {/* Hover Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 bg-stone-900 border border-[#F97316]/60 text-[10px] text-orange-300 px-2.5 py-1 rounded-md font-bold font-mono pointer-events-none z-30 shadow-2xl whitespace-nowrap">
                                  {item.count} leads ({item.percentage}%)
                                </div>

                                {/* Bar Value Badge on top of bar */}
                                <span className={`text-[10px] font-mono font-bold ${item.count > 0 ? 'text-[#F97316]' : 'text-stone-600'}`}>
                                  {item.count}
                                </span>
                                
                                {/* Visible Bar Track & Gradient Bar */}
                                <div className="w-full h-44 bg-stone-900/80 rounded-t-lg overflow-hidden flex items-end p-0.5 border border-stone-800/80 shadow-inner">
                                  <div
                                    style={{ height: `${item.percentage}%` }}
                                    className={`w-full ${
                                      item.count > 0
                                        ? 'bg-gradient-to-t from-[#8a6d3b] via-[#F97316] to-[#f3d999] group-hover:brightness-125'
                                        : 'bg-stone-800/40'
                                    } transition-all duration-500 rounded-t-md shadow-lg`}
                                  />
                                </div>

                                {/* X-Axis Label */}
                                <span className="text-[10px] text-stone-400 font-mono group-hover:text-orange-400 font-semibold transition-colors">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tour Category Share Breakdown */}
                      <div className="lg:col-span-4 bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
                        <div className="border-b border-stone-800 pb-3">
                          <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-[#F97316]" /> Journey Category Share
                          </h3>
                          <p className="text-[11px] text-stone-400">Live tour style demand distribution</p>
                        </div>

                        <div className="space-y-5 pt-2">
                          {categoryShareList.map((cat, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-stone-300">{cat.name}</span>
                                <span className={`${cat.text} font-bold font-mono`}>{cat.percentage}%</span>
                              </div>
                              <div className="h-3 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800 p-0.5 shadow-inner">
                                <div className={`h-full ${cat.bg} rounded-full transition-all duration-700 shadow-md`} style={{ width: `${cat.percentage}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* RECENT ACTIVITIES FEED SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-6 bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#F97316]" /> Recent Activities Stream
                      </h3>
                      <span className="text-[10px] text-stone-500 font-mono">Live Activity Logs</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: MessageSquare, color: 'text-orange-400 bg-orange-950/40 border-orange-800', title: 'New Quote Request', detail: 'Sarah Jenkins submitted an itinerary inquiry', time: '12 mins ago' },
                        { icon: MapPin, color: 'text-primary bg-stone-900 border-stone-700', title: 'Safari Updated', detail: 'Classic South India Tour SEO and pricing saved', time: '45 mins ago' },
                        { icon: BookOpen, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800', title: 'Blog Post Published', detail: 'Ultimate Guide to Etosha Waterholes live on front-end', time: '2 hours ago' },
                        { icon: Star, color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800', title: 'Guest Review Verified', detail: '5-star review from Mark Mueller (Germany) approved', time: '4 hours ago' },
                        { icon: SettingsIcon, color: 'text-stone-300 bg-stone-900 border-stone-800', title: 'CMS Sync Complete', detail: 'Currency exchange rates updated to match market', time: '6 hours ago' },
                      ].map((act, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/40 border border-stone-800/80 text-xs">
                          <div className={`p-2 rounded-lg border ${act.color} shrink-0`}>
                            <act.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <strong className="text-stone-200 font-semibold">{act.title}</strong>
                              <span className="text-[10px] text-stone-500 font-mono">{act.time}</span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 truncate">{act.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Quote Requests Box */}
                  <div className="lg:col-span-6 bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#F97316]" /> Recent Quote Inquiries
                      </h3>
                      <button onClick={() => setActiveTab('inquiries')} className="text-xs text-[#F97316] font-bold hover:underline">
                        View All →
                      </button>
                    </div>

                    {filteredInquiries.length === 0 ? (
                      <p className="text-xs text-stone-500 py-6 text-center">No quote requests found for selected period.</p>
                    ) : (
                      <div className="space-y-3">
                        {filteredInquiries.slice(0, 4).map((inq) => (
                          <div key={inq.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-900/40 border border-stone-800 text-xs">
                            <div>
                              <strong className="text-stone-200 font-bold block">{inq.name}</strong>
                              <span className="text-stone-400 text-[11px]">{inq.email} · {inq.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-stone-400 text-[11px]">{inq.category}</span>
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                  inq.status === 'Pending'
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-800'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-800'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 2: SAFARIS COLLECTION */}
          {activeTab === 'safaris' && (
            <div>
              {safariViewMode === 'list' ? (
                <div className="space-y-6">
                  {(() => {
                    const filteredAdminSafaris = safaris.filter((safari) => {
                      if (!safariSearchQuery.trim()) return true;
                      const q = safariSearchQuery.trim().toLowerCase();
                      return (
                        safari.title?.toLowerCase().includes(q) ||
                        safari.category?.toLowerCase().includes(q) ||
                        safari.region?.toLowerCase().includes(q) ||
                        safari.route?.toLowerCase().includes(q) ||
                        safari.startingLocation?.toLowerCase().includes(q) ||
                        safari.endingLocation?.toLowerCase().includes(q)
                      );
                    });

                    const totalPages = Math.max(1, Math.ceil(filteredAdminSafaris.length / 5));
                    const paginatedSafaris = filteredAdminSafaris.slice((safariPage - 1) * 5, safariPage * 5);

                    return (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h2 className="font-serif text-2xl font-bold">Journeys Collection Manager</h2>
                            <p className="text-xs text-stone-400">Add, update prices, manage itineraries, or set SEO settings for custom journeys</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Search Box Input */}
                            <div className="relative">
                              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                value={safariSearchQuery}
                                onChange={(e) => {
                                  setSafariSearchQuery(e.target.value);
                                  setSafariPage(1);
                                }}
                                placeholder="Search journey package title, category..."
                                className="bg-stone-900 border border-stone-800 text-stone-100 rounded-lg pl-9 pr-8 py-2 text-xs outline-none focus:border-[#F97316] w-64 sm:w-72 shadow-inner"
                              />
                              {safariSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSafariSearchQuery('');
                                    setSafariPage(1);
                                  }}
                                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingSafari(null);
                                setSafariForm({
                                  title: '',
                                  priceUSD: '1800',
                                  days: '7',
                                  nights: '6',
                                  category: 'Customized Private',
                                  region: 'Tamil Nadu',
                                  badge: 'Bestseller',
                                  image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
                                  route: 'Chennai → Mahabalipuram → Pondicherry → Thanjavur → Madurai → Munnar → Alleppey → Kochi',
                                  startingLocation: 'Chennai',
                                  endingLocation: 'Kochi',
                                  bestTimeToTravel: 'October to April',
                                  accommodation: 'Heritage Mansions & Backwater Resorts',
                                  description: 'Custom private trip through South India with dedicated driver-companion.',
                                  inclusions: '["Private AC vehicle & dedicated driver-companion","Heritage lodging & luxury resort stays","Daily breakfast"]',
                                  exclusions: '["International flights","Personal expenses & tips"]',
                                  itineraries: '[]',
                                  metaTitle: '',
                                  metaDescription: '',
                                  keywords: '',
                                });
                                setSafariViewMode('editor');
                              }}
                              className="flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2 text-xs font-semibold text-stone-950 shadow-md hover:brightness-110 shrink-0"
                            >
                              <Plus className="w-4 h-4" /> Add New Journey Package
                            </button>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="bg-[#141210] border border-stone-800 rounded-xl overflow-hidden shadow-lg">
                          <table className="w-full text-left text-xs text-stone-300">
                            <thead className="bg-stone-900 border-b border-stone-800 uppercase tracking-wider text-[10px] text-stone-400">
                              <tr>
                                <th className="p-4">Journey Title</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Region</th>
                                <th className="p-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/60">
                              {filteredAdminSafaris.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-stone-500">
                                    {safariSearchQuery ? `No journeys found matching "${safariSearchQuery}".` : 'No safaris available.'}
                                  </td>
                                </tr>
                              ) : (
                                paginatedSafaris.map((safari) => (
                                  <tr key={safari.id} className="hover:bg-stone-900/40 transition-colors">
                                    <td className="p-4 font-semibold text-stone-100 flex items-center gap-3">
                                      <img src={safari.image} alt={safari.title} className="w-10 h-10 object-cover rounded" />
                                      <div>
                                        <div className="font-bold text-stone-200">{safari.title}</div>
                                        <span className="text-[10px] text-primary">{safari.badge}</span>
                                      </div>
                                    </td>
                                    <td className="p-4">{safari.days}D / {safari.nights}N</td>
                                    <td className="p-4">{safari.category}</td>
                                    <td className="p-4">{safari.region}</td>
                                    <td className="p-4 text-right space-x-2">
                                      <Link href={`/safari/${safari.id}`} target="_blank" className="p-1.5 text-stone-400 hover:text-primary inline-block">
                                        <Eye className="w-4 h-4" />
                                      </Link>
                                      <button
                                        onClick={() => openSafariEdit(safari)}
                                        className="p-1.5 text-stone-300 hover:text-primary"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSafari(safari.id)}
                                        className="p-1.5 text-rose-400 hover:text-rose-300"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Safaris Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between bg-[#141210] border border-stone-800 p-4 rounded-xl text-xs">
                            <span className="text-stone-400">
                              Page <strong className="text-stone-200">{safariPage}</strong> of{' '}
                              <strong className="text-stone-200">{totalPages}</strong> ({filteredAdminSafaris.length} total)
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSafariPage((p) => Math.max(1, p - 1))}
                                disabled={safariPage === 1}
                                className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                              >
                                ← Prev
                              </button>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setSafariPage(p)}
                                  className={`w-7 h-7 rounded font-bold ${safariPage === p ? 'bg-primary text-black' : 'bg-stone-900 border border-stone-800 text-stone-300'}`}
                                >
                                  {p}
                                </button>
                              ))}
                              <button
                                onClick={() => setSafariPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safariPage === totalPages}
                                className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                /* DEDICATED FULL-PAGE SAFARI EDITOR WORKSPACE & SEO STUDIO (NO POPUP MODAL!) */
                /* DEDICATED FULL-PAGE EDITOR WORKSPACE & SEO STUDIO (NO POPUP MODAL!) */
                <div className="space-y-6">
                  {/* Editor Header Navigation */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSafariViewMode('list')}
                        className="flex items-center gap-2 text-xs text-[#F97316] font-bold bg-stone-900 border border-stone-800 px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Journeys Collection
                      </button>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#F97316]" />
                          {editingSafari ? 'Journey Package Workspace' : 'Create New Journey Workspace'}
                        </h2>
                        <p className="text-xs text-stone-400">Full itinerary customization, pricing & dedicated SEO configuration studio</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSafariViewMode('list')}
                        className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSafari}
                        className="flex items-center gap-2 px-5 py-2 bg-gold-gradient text-stone-950 text-xs font-bold rounded-lg shadow-md hover:brightness-110"
                      >
                        <Save className="w-4 h-4" /> {editingSafari ? 'Save & Update Journey' : 'Create Journey Package'}
                      </button>
                    </div>
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handleSaveSafari} className="space-y-6 text-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Column: Itinerary Specifications */}
                      <div className="lg:col-span-7 space-y-6 bg-[#141210] border border-stone-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-serif text-lg font-bold text-stone-200 border-b border-stone-800 pb-3">Itinerary Specifications & Media</h3>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Journey Title *</label>
                          <input
                            type="text"
                            required
                            value={safariForm.title}
                            onChange={(e) => setSafariForm({ ...safariForm, title: e.target.value })}
                            placeholder="e.g. 10-Day Classic South India Heritage & Backwater Private Journey"
                            className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-primary text-sm font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Days</label>
                            <input
                              type="number"
                              required
                              value={safariForm.days}
                              onChange={(e) => setSafariForm({ ...safariForm, days: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Nights</label>
                            <input
                              type="number"
                              required
                              value={safariForm.nights}
                              onChange={(e) => setSafariForm({ ...safariForm, nights: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {/* CATEGORY SELECT & ADD NEW */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-400 font-semibold">Category</label>
                              <button
                                type="button"
                                onClick={() => setShowAddCatInput(true)}
                                className="text-[10px] text-[#F97316] font-bold hover:underline flex items-center gap-0.5"
                              >
                                <Plus className="w-3 h-3" /> Add Custom
                              </button>
                            </div>

                            {!showAddCatInput && safariForm.category !== '__ADD_NEW__' ? (
                              <select
                                value={safariForm.category}
                                onChange={(e) => {
                                  if (e.target.value === '__ADD_NEW__') {
                                    setShowAddCatInput(true);
                                  } else {
                                    setSafariForm({ ...safariForm, category: e.target.value });
                                  }
                                }}
                                className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                              >
                                {categoriesList.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                                <option value="__ADD_NEW__" className="text-[#F97316] font-bold">
                                  + Add New Category...
                                </option>
                              </select>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddNewCategory();
                                    } else if (e.key === 'Escape') {
                                      setShowAddCatInput(false);
                                      if (safariForm.category === '__ADD_NEW__') setSafariForm({ ...safariForm, category: categoriesList[0] || 'Private' });
                                    }
                                  }}
                                  placeholder="e.g. Private Driver Companion"
                                  className="w-full bg-stone-900 border border-[#F97316] p-2 rounded text-xs text-stone-100 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddNewCategory()}
                                  className="px-2.5 py-2 bg-[#F97316] text-stone-950 font-bold rounded text-xs shrink-0 hover:brightness-110"
                                >
                                  Add
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowAddCatInput(false);
                                    if (safariForm.category === '__ADD_NEW__') setSafariForm({ ...safariForm, category: categoriesList[0] || 'Private' });
                                  }}
                                  className="px-2 py-2 bg-stone-800 text-stone-400 rounded text-xs shrink-0 hover:bg-stone-700"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* REGION SELECT & ADD NEW */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-400 font-semibold">Region</label>
                              <button
                                type="button"
                                onClick={() => setShowAddRegionInput(true)}
                                className="text-[10px] text-[#F97316] font-bold hover:underline flex items-center gap-0.5"
                              >
                                <Plus className="w-3 h-3" /> Add Custom
                              </button>
                            </div>

                            {!showAddRegionInput && safariForm.region !== '__ADD_NEW__' ? (
                              <select
                                value={safariForm.region}
                                onChange={(e) => {
                                  if (e.target.value === '__ADD_NEW__') {
                                    setShowAddRegionInput(true);
                                  } else {
                                    setSafariForm({ ...safariForm, region: e.target.value });
                                  }
                                }}
                                className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                              >
                                {regionsList.map((reg) => (
                                  <option key={reg} value={reg}>
                                    {reg}
                                  </option>
                                ))}
                                <option value="__ADD_NEW__" className="text-[#F97316] font-bold">
                                  + Add New Region...
                                </option>
                              </select>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={newRegionName}
                                  onChange={(e) => setNewRegionName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddNewRegion();
                                    } else if (e.key === 'Escape') {
                                      setShowAddRegionInput(false);
                                      if (safariForm.region === '__ADD_NEW__') setSafariForm({ ...safariForm, region: regionsList[0] || 'Central' });
                                    }
                                  }}
                                  placeholder="e.g. Caprivi Strip"
                                  className="w-full bg-stone-900 border border-[#F97316] p-2 rounded text-xs text-stone-100 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddNewRegion()}
                                  className="px-2.5 py-2 bg-[#F97316] text-stone-950 font-bold rounded text-xs shrink-0 hover:brightness-110"
                                >
                                  Add
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowAddRegionInput(false);
                                    if (safariForm.region === '__ADD_NEW__') setSafariForm({ ...safariForm, region: regionsList[0] || 'Central' });
                                  }}
                                  className="px-2 py-2 bg-stone-800 text-stone-400 rounded text-xs shrink-0 hover:bg-stone-700"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={safariForm.badge}
                              onChange={(e) => setSafariForm({ ...safariForm, badge: e.target.value })}
                              placeholder="e.g. Bestseller, Luxury"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                        </div>

                        <ImageUploader
                          label="Journey Cover Image"
                          value={safariForm.image}
                          onChange={(val) => setSafariForm({ ...safariForm, image: val })}
                          recommendedSize="1200 × 800 px (3:2 Ratio)"
                        />

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Route Overview *</label>
                          <input
                            type="text"
                            required
                            value={safariForm.route}
                            onChange={(e) => setSafariForm({ ...safariForm, route: e.target.value })}
                            placeholder="Chennai → Mahabalipuram → Pondicherry → Thanjavur → Madurai → Munnar → Alleppey"
                            className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Starting Location</label>
                            <input
                              type="text"
                              value={safariForm.startingLocation}
                              onChange={(e) => setSafariForm({ ...safariForm, startingLocation: e.target.value })}
                              placeholder="e.g. Chennai"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Ending Location</label>
                            <input
                              type="text"
                              value={safariForm.endingLocation}
                              onChange={(e) => setSafariForm({ ...safariForm, endingLocation: e.target.value })}
                              placeholder="e.g. Kochi"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Best Season</label>
                            <input
                              type="text"
                              value={safariForm.bestTimeToTravel}
                              onChange={(e) => setSafariForm({ ...safariForm, bestTimeToTravel: e.target.value })}
                              placeholder="e.g. October to April"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Accommodation Tier *</label>
                          <input
                            type="text"
                            required
                            value={safariForm.accommodation}
                            onChange={(e) => setSafariForm({ ...safariForm, accommodation: e.target.value })}
                            placeholder="e.g. Heritage Stays, Boutique Resorts & Luxury Houseboats"
                            className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                          />
                          <p className="text-[11px] text-stone-500 mt-1">Short summary stay title. Cards automatically limit long text to 2 clean lines.</p>
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Overview Description *</label>
                          <textarea
                            rows={4}
                            required
                            value={safariForm.description}
                            onChange={(e) => setSafariForm({ ...safariForm, description: e.target.value })}
                            placeholder="Detailed overview describing the private journey experience across Tamil Nadu and Kerala..."
                            className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none resize-none leading-relaxed"
                          />
                        </div>

                        {/* Day-by-Day Daily Itineraries Builder */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                            <div>
                              <h3 className="font-serif text-lg font-bold text-[#F97316] flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#F97316]" /> Package Daily Itineraries ({(() => {
                                  try {
                                    const parsed = typeof safariForm.itineraries === 'string' ? JSON.parse(safariForm.itineraries) : safariForm.itineraries;
                                    return Array.isArray(parsed) ? parsed.length : 0;
                                  } catch (e) { return 0; }
                                })()} Days)
                              </h3>
                              <p className="text-xs text-stone-400 mt-0.5">
                                Add & edit day-by-day stops for this {safariForm.days || '0'}-Day tour package.
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const count = parseInt(safariForm.days || '1', 10) || 1;
                                  const generated = Array.from({ length: count }, (_, i) => {
                                    const dayNum = String(i + 1).padStart(2, '0');
                                    return {
                                      dayNumber: dayNum,
                                      daysLabel: `Day ${dayNum}`,
                                      title: i === 0 ? 'Arrival & Orientation' : `Day ${dayNum} Exploration`,
                                      description: `Detailed itinerary for Day ${dayNum} of this private journey...`,
                                      duration: '3 hrs · 100 km',
                                      mealPlan: 'Breakfast & Dinner',
                                      accommodation: safariForm.accommodation || 'Heritage Stay / Hotel',
                                      image: safariForm.image || '',
                                    };
                                  });
                                  setSafariForm({ ...safariForm, itineraries: JSON.stringify(generated) });
                                  showNotification(`Generated ${count}-Day itinerary template!`);
                                }}
                                className="px-3 py-1.5 bg-stone-800 border border-stone-700 hover:border-[#F97316] text-[#F97316] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" /> Auto-Generate {safariForm.days || 'N'} Days Template
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  let current: any[] = [];
                                  try {
                                    current = typeof safariForm.itineraries === 'string' ? JSON.parse(safariForm.itineraries) : safariForm.itineraries || [];
                                  } catch (e) {}
                                  const nextDayNum = String(current.length + 1).padStart(2, '0');
                                  const newItem = {
                                    dayNumber: nextDayNum,
                                    daysLabel: `Day ${nextDayNum}`,
                                    title: '',
                                    description: '',
                                    duration: '',
                                    mealPlan: '',
                                    accommodation: '',
                                    image: '',
                                  };
                                  setSafariForm({ ...safariForm, itineraries: JSON.stringify([...current, newItem]) });
                                }}
                                className="px-3.5 py-1.5 bg-[#F97316] hover:brightness-110 text-stone-950 text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Day Step
                              </button>
                            </div>
                          </div>

                          {/* Itinerary Day Cards */}
                          <div className="space-y-4">
                            {(() => {
                              let list: any[] = [];
                              try {
                                list = typeof safariForm.itineraries === 'string' ? JSON.parse(safariForm.itineraries) : safariForm.itineraries || [];
                              } catch (e) {}

                              if (!Array.isArray(list) || list.length === 0) {
                                return (
                                  <div className="p-8 text-center bg-stone-900/60 border border-dashed border-stone-800 rounded-xl space-y-2">
                                    <Clock className="w-8 h-8 text-stone-600 mx-auto" />
                                    <p className="text-xs text-stone-400 font-medium">No daily itinerary items added yet for this journey.</p>
                                    <p className="text-[11px] text-stone-500">Click <strong>"Auto-Generate {safariForm.days || 'N'} Days Template"</strong> above to auto-create slots based on package days count ({safariForm.days || 1} Days).</p>
                                  </div>
                                );
                              }

                              return list.map((item: any, idx: number) => (
                                <div key={idx} className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-4 relative">
                                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-orange-500/20 text-[#F97316] font-mono text-xs font-bold flex items-center justify-center">
                                        {idx + 1}
                                      </span>
                                      <input
                                        type="text"
                                        value={item.daysLabel || `Day ${String(idx + 1).padStart(2, '0')}`}
                                        onChange={(e) => {
                                          const updated = [...list];
                                          updated[idx] = { ...updated[idx], daysLabel: e.target.value };
                                          setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                        }}
                                        placeholder="Day 01 / Days 01–02"
                                        className="bg-stone-950 border border-stone-700 px-2 py-1 rounded text-xs text-orange-400 font-bold w-32 outline-none"
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = list.filter((_, i) => i !== idx);
                                        setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                      }}
                                      className="text-stone-500 hover:text-rose-400 text-xs flex items-center gap-1 font-semibold"
                                      title="Delete Day"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete Day
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <label className="block text-stone-400 font-semibold mb-1">Day Title *</label>
                                      <input
                                        type="text"
                                        value={item.title || ''}
                                        onChange={(e) => {
                                          const updated = [...list];
                                          updated[idx] = { ...updated[idx], title: e.target.value };
                                          setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                        }}
                                        placeholder="e.g. Arrival in Chennai & Historic Shore Temples"
                                        className="w-full bg-stone-950 border border-stone-700 p-2 rounded text-stone-100 outline-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-stone-400 font-semibold mb-1">Duration & Distance</label>
                                      <input
                                        type="text"
                                        value={item.duration || ''}
                                        onChange={(e) => {
                                          const updated = [...list];
                                          updated[idx] = { ...updated[idx], duration: e.target.value };
                                          setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                        }}
                                        placeholder="e.g. 2 hrs · 100 km"
                                        className="w-full bg-stone-950 border border-stone-700 p-2 rounded text-stone-100 outline-none"
                                      />
                                    </div>

                                    <div className="md:col-span-2">
                                      <label className="block text-stone-400 font-semibold mb-1">Day Activity Description</label>
                                      <textarea
                                        rows={2}
                                        value={item.description || ''}
                                        onChange={(e) => {
                                          const updated = [...list];
                                          updated[idx] = { ...updated[idx], description: e.target.value };
                                          setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                        }}
                                        placeholder="Describe daily sightseeing, drive routes, activities..."
                                        className="w-full bg-stone-950 border border-stone-700 p-2 rounded text-stone-100 outline-none resize-y"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-stone-400 font-semibold mb-1">Meal Plan</label>
                                      <input
                                        type="text"
                                        value={item.mealPlan || ''}
                                        onChange={(e) => {
                                          const updated = [...list];
                                          updated[idx] = { ...updated[idx], mealPlan: e.target.value };
                                          setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                        }}
                                        placeholder="e.g. Breakfast & Dinner"
                                        className="w-full bg-stone-950 border border-stone-700 p-2 rounded text-stone-100 outline-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-stone-400 font-semibold mb-1">Accommodation Stay</label>
                                      <input
                                        type="text"
                                        value={item.accommodation || ''}
                                        onChange={(e) => {
                                          const updated = [...list];
                                          updated[idx] = { ...updated[idx], accommodation: e.target.value };
                                          setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                        }}
                                        placeholder="e.g. Palais de Mahe · French Quarter"
                                        className="w-full bg-stone-950 border border-stone-700 p-2 rounded text-stone-100 outline-none"
                                      />
                                    </div>
                                  </div>

                                  <ImageUploader
                                    label="Day Featured Image URL"
                                    value={item.image || ''}
                                    onChange={(val) => {
                                      const updated = [...list];
                                      updated[idx] = { ...updated[idx], image: val };
                                      setSafariForm({ ...safariForm, itineraries: JSON.stringify(updated) });
                                    }}
                                  />
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: SEO Studio & Inclusions */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* SEO Studio Box */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                          <h3 className="font-serif text-lg font-bold text-[#F97316] border-b border-stone-800 pb-3">SEO & Search Engine Snippet</h3>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-400 font-semibold">SEO Meta Title</label>
                              {(() => {
                                const titleLen = (safariForm.metaTitle || '').length;
                                let color = 'text-orange-400 bg-orange-950/40 border-orange-800/60';
                                if (titleLen >= 50 && titleLen <= 60) color = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
                                if (titleLen > 60) color = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
                                return (
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
                                    {titleLen} / 60 Chars {titleLen >= 50 && titleLen <= 60 ? '✓ Optimal' : titleLen > 60 ? '⚠️ Exceeds 60' : '(Rec: 50-60)'}
                                  </span>
                                );
                              })()}
                            </div>
                            <input
                              type="text"
                              value={safariForm.metaTitle}
                              onChange={(e) => setSafariForm({ ...safariForm, metaTitle: e.target.value })}
                              placeholder={`Defaults to ${safariForm.title || 'Journey Title'} | You & Me – Independent Voyage`}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none font-semibold text-xs"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-400 font-semibold">SEO Meta Description</label>
                              {(() => {
                                const descLen = (safariForm.metaDescription || '').length;
                                let color = 'text-orange-400 bg-orange-950/40 border-orange-800/60';
                                if (descLen >= 140 && descLen <= 160) color = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
                                if (descLen > 160) color = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
                                return (
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
                                    {descLen} / 160 Chars {descLen >= 140 && descLen <= 160 ? '✓ Optimal' : descLen > 160 ? '⚠️ Exceeds 160' : '(Rec: 150-160)'}
                                  </span>
                                );
                              })()}
                            </div>
                            <textarea
                              rows={3}
                              value={safariForm.metaDescription}
                              onChange={(e) => setSafariForm({ ...safariForm, metaDescription: e.target.value })}
                              placeholder="Defaults to Journey Description copy"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none resize-none text-xs leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">SEO Search Keywords / Tags</label>
                            <input
                              type="text"
                              value={safariForm.keywords}
                              onChange={(e) => setSafariForm({ ...safariForm, keywords: e.target.value })}
                              placeholder="e.g. South India Tour, Tamil Nadu Temples, Kerala Backwaters, Private Driver Companion"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>

                          {/* Live Google Search Result Preview Box */}
                          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-1">
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mb-1">Google Search Result Preview</span>
                            <div className="text-xs text-blue-400 font-semibold truncate hover:underline cursor-pointer">
                              {safariForm.metaTitle || safariForm.title || 'Journey Title | You & Me – Independent Voyage'}
                            </div>
                            <div className="text-[11px] text-emerald-500 truncate font-mono">
                              https://youandmevoyage.com/journeys/{editingSafari?.id || 'journey-id'}
                            </div>
                            <div className="text-[11px] text-stone-400 line-clamp-2">
                              {safariForm.metaDescription || safariForm.description || 'Journey tour description will appear here in search engine results.'}
                            </div>
                          </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                          <h3 className="font-serif text-lg font-bold text-stone-200 border-b border-stone-800 pb-3">Inclusions & Exclusions (JSON Format)</h3>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Inclusions</label>
                            <textarea
                              rows={3}
                              value={safariForm.inclusions}
                              onChange={(e) => setSafariForm({ ...safariForm, inclusions: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none font-mono text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Exclusions</label>
                            <textarea
                              rows={3}
                              value={safariForm.exclusions}
                              onChange={(e) => setSafariForm({ ...safariForm, exclusions: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none font-mono text-xs"
                            />
                          </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => setSafariViewMode('list')}
                            className="px-4 py-2.5 bg-stone-800 text-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-gold-gradient text-stone-950 text-xs font-bold rounded-lg shadow-lg hover:brightness-110"
                          >
                            {editingSafari ? 'Save & Update Safari' : 'Create Safari Package'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DESTINATIONS */}
          {activeTab === 'destinations' && (() => {
            const filteredDestinations = destinations.filter((dest) => {
              if (!destSearchQuery.trim()) return true;
              const q = destSearchQuery.toLowerCase();
              return (
                (dest.title || '').toLowerCase().includes(q) ||
                (dest.subtitle || '').toLowerCase().includes(q) ||
                (dest.region || '').toLowerCase().includes(q) ||
                (dest.description || '').toLowerCase().includes(q)
              );
            });

            const DEST_PER_PAGE = 6;
            const totalDestPages = Math.max(1, Math.ceil(filteredDestinations.length / DEST_PER_PAGE));
            const safeDestPage = Math.min(destPage, totalDestPages);
            const paginatedDestinations = filteredDestinations.slice((safeDestPage - 1) * DEST_PER_PAGE, safeDestPage * DEST_PER_PAGE);

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-[#F97316]" /> Destinations Manager
                    </h2>
                    <p className="text-xs text-stone-400">Manage regional destinations displayed across your website ({filteredDestinations.length} total)</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingDest(null);
                      setDestForm({
                        title: '',
                        subtitle: '',
                        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
                        region: 'Tamil Nadu',
                        size: 'short',
                        description: '',
                      });
                      setDestModal(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 text-xs font-bold text-stone-950 hover:brightness-110 transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Destination
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141210] p-4 border border-stone-800 rounded-xl shadow-md">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search destinations by title, region, or description..."
                      value={destSearchQuery}
                      onChange={(e) => {
                        setDestSearchQuery(e.target.value);
                        setDestPage(1);
                      }}
                      className="w-full bg-stone-900 border border-stone-700/80 rounded-lg pl-10 pr-4 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                  {destSearchQuery && (
                    <button
                      onClick={() => {
                        setDestSearchQuery('');
                        setDestPage(1);
                      }}
                      className="text-xs text-[#F97316] hover:underline font-semibold shrink-0 cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                {/* Grid View (6 per page) */}
                {paginatedDestinations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paginatedDestinations.map((dest) => (
                      <div key={dest.id} className="bg-[#141210] border border-stone-800 rounded-xl overflow-hidden shadow-lg group hover:border-stone-700 transition-all">
                        <div className="h-44 w-full overflow-hidden relative">
                          <img src={dest.image} alt={dest.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-2.5 right-2.5 text-[10px] uppercase font-bold bg-black/70 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                            {dest.region || 'South India'}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <strong className="font-serif font-bold text-stone-100 text-base">{dest.title}</strong>
                            <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded font-mono uppercase">{dest.size || 'short'}</span>
                          </div>
                          <p className="text-xs text-stone-400 line-clamp-2">{dest.subtitle}</p>
                          <div className="flex justify-end gap-3 pt-3 border-t border-stone-800/80">
                            <button
                              onClick={() => {
                                setEditingDest(dest);
                                setDestForm({
                                  title: dest.title,
                                  subtitle: dest.subtitle,
                                  image: dest.image,
                                  region: dest.region,
                                  size: dest.size,
                                  description: dest.description || '',
                                });
                                setDestModal(true);
                              }}
                              className="inline-flex items-center gap-1 text-xs text-[#F97316] hover:underline font-bold cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDeleteDest(dest.id)} className="inline-flex items-center gap-1 text-xs text-rose-400 hover:underline font-bold cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#141210] border border-stone-800 rounded-xl p-12 text-center text-stone-400 space-y-3">
                    <MapPin className="w-8 h-8 text-stone-600 mx-auto" />
                    <p className="text-sm font-semibold">No destinations found matching &quot;{destSearchQuery}&quot;</p>
                    <button
                      onClick={() => setDestSearchQuery('')}
                      className="text-xs text-[#F97316] hover:underline font-bold"
                    >
                      Clear search filter
                    </button>
                  </div>
                )}

                {/* Pagination Controls (Max 6 per page) */}
                {totalDestPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
                    <span className="text-xs text-stone-400">
                      Showing <strong className="text-stone-200">{(safeDestPage - 1) * DEST_PER_PAGE + 1}</strong> to{' '}
                      <strong className="text-stone-200">{Math.min(safeDestPage * DEST_PER_PAGE, filteredDestinations.length)}</strong> of{' '}
                      <strong className="text-stone-200">{filteredDestinations.length}</strong> destinations
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={safeDestPage === 1}
                        onClick={() => setDestPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs font-semibold text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalDestPages }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => setDestPage(pg)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            safeDestPage === pg
                              ? 'bg-[#F97316] text-black font-extrabold shadow-md'
                              : 'bg-stone-900 border border-stone-700 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                      <button
                        disabled={safeDestPage === totalDestPages}
                        onClick={() => setDestPage((p) => Math.min(totalDestPages, p + 1))}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs font-semibold text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 4: INQUIRIES & LEAD CRM MANAGER */}
          {activeTab === 'inquiries' && (
            inquiryViewMode === 'list' ? (
              /* LIST VIEW WITH CRM TABLE & KPI METRICS */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-[#F97316]" /> Quote Requests & Lead CRM Studio
                    </h2>
                    <p className="text-xs text-stone-400">Track lead pipelines, stage transitions, scheduled follow-ups, and proposal revenue values</p>
                  </div>
                </div>

                {/* CRM Pipeline KPI Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-[#141210] border border-stone-800 p-4 rounded-xl space-y-2 shadow group hover:border-[#F97316]/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Leads</span>
                      <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-700 text-[#F97316] flex items-center justify-center">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-100">{inquiries.length}</div>
                    <span className="text-[10px] text-stone-500 block">All Website Enquiries</span>
                  </div>

                  <div className="bg-[#141210] border border-orange-900/40 p-4 rounded-xl space-y-2 shadow group hover:border-orange-500/60 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">New Pending</span>
                      <div className="w-7 h-7 rounded-lg bg-orange-950/60 border border-orange-800 text-orange-400 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl font-serif font-bold text-orange-400">
                      {inquiries.filter((i) => i.status === 'Pending').length}
                    </div>
                    <span className="text-[10px] text-stone-500 block">Awaiting First Response</span>
                  </div>

                  <div className="bg-[#141210] border border-sky-900/40 p-4 rounded-xl space-y-2 shadow group hover:border-sky-500/60 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">In Discussion</span>
                      <div className="w-7 h-7 rounded-lg bg-sky-950/60 border border-sky-800 text-sky-400 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl font-serif font-bold text-sky-400">
                      {inquiries.filter((i) => ['Contacted', 'Follow Up', 'Proposal Sent'].includes(i.status)).length}
                    </div>
                    <span className="text-[10px] text-stone-500 block">Contacted / Proposals</span>
                  </div>

                  <div className="bg-[#141210] border border-emerald-900/40 p-4 rounded-xl space-y-2 shadow group hover:border-emerald-500/60 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Converted (Won)</span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl font-serif font-bold text-emerald-400">
                      {inquiries.filter((i) => i.status === 'Converted').length}
                    </div>
                    <span className="text-[10px] text-emerald-500/80 block">
                      ${inquiries.filter((i) => i.status === 'Converted').reduce((sum, i) => sum + (i.proposalAmount || 0), 0).toLocaleString()} Revenue
                    </span>
                  </div>

                  <div className="bg-[#141210] border border-rose-900/40 p-4 rounded-xl space-y-2 shadow group hover:border-rose-500/60 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Lost Deals</span>
                      <div className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl font-serif font-bold text-rose-400">
                      {inquiries.filter((i) => i.status === 'Lost').length}
                    </div>
                    <span className="text-[10px] text-stone-500 block">With Reason Tracked</span>
                  </div>
                </div>

                {/* Search & Filter Controls Toolbar */}
                {(() => {
                  const filteredInquiries = inquiries.filter((inq) => {
                    const q = inquirySearchQuery.trim().toLowerCase();
                    const matchesSearch =
                      !q ||
                      (inq.name || '').toLowerCase().includes(q) ||
                      (inq.email || '').toLowerCase().includes(q) ||
                      (inq.phone || '').toLowerCase().includes(q) ||
                      (inq.category || '').toLowerCase().includes(q) ||
                      (inq.destination || '').toLowerCase().includes(q);

                    const matchesStatus =
                      inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;

                    return matchesSearch && matchesStatus;
                  });

                  const totalPages = Math.ceil(filteredInquiries.length / 5);

                  return (
                    <div className="space-y-4">
                      <div className="bg-[#141210] border border-stone-800 p-4 rounded-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Search Input Box (Name, Email, Mobile No.) */}
                        <div className="relative w-full md:w-96">
                          <input
                            type="text"
                            value={inquirySearchQuery}
                            onChange={(e) => {
                              setInquirySearchQuery(e.target.value);
                              setInquiryPage(1);
                            }}
                            placeholder="Search by Name, Email, Mobile No., or Location..."
                            className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#F97316] shadow-inner"
                          />
                          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                          {inquirySearchQuery && (
                            <button
                              onClick={() => setInquirySearchQuery('')}
                              className="absolute right-3 top-3 text-stone-500 hover:text-stone-300 text-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* CRM Stage Status Filter Pills & Dropdown */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                          <span className="text-xs text-stone-400 font-semibold flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5 text-[#F97316]" /> Stage:
                          </span>

                          <select
                            value={inquiryStatusFilter}
                            onChange={(e) => {
                              setInquiryStatusFilter(e.target.value);
                              setInquiryPage(1);
                            }}
                            className="bg-stone-900 border border-stone-700 text-stone-100 px-3 py-2 rounded-xl text-xs outline-none focus:border-[#F97316] font-semibold cursor-pointer"
                          >
                            <option value="All">All Lead Stages ({inquiries.length})</option>
                            <option value="Pending">🟡 Pending ({inquiries.filter((i) => i.status === 'Pending').length})</option>
                            <option value="Contacted">🔵 Contacted ({inquiries.filter((i) => i.status === 'Contacted').length})</option>
                            <option value="Follow Up">🟣 Follow Up ({inquiries.filter((i) => i.status === 'Follow Up').length})</option>
                            <option value="Proposal Sent">🟧 Proposal Sent ({inquiries.filter((i) => i.status === 'Proposal Sent').length})</option>
                            <option value="Converted">🟢 Converted / Won ({inquiries.filter((i) => i.status === 'Converted').length})</option>
                            <option value="Lost">🔴 Lost Deals ({inquiries.filter((i) => i.status === 'Lost').length})</option>
                          </select>

                          {(inquirySearchQuery || inquiryStatusFilter !== 'All') && (
                            <button
                              onClick={() => {
                                setInquirySearchQuery('');
                                setInquiryStatusFilter('All');
                                setInquiryPage(1);
                              }}
                              className="text-xs text-rose-400 hover:underline font-bold px-2 py-1 bg-rose-950/40 border border-rose-800 rounded-lg"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Lead CRM Pipeline Table */}
                      <div className="bg-[#141210] border border-stone-800 rounded-xl overflow-hidden shadow-lg">
                        <table className="w-full text-left text-xs text-stone-300">
                          <thead className="bg-stone-900 border-b border-stone-800 uppercase tracking-wider text-[10px] text-stone-400">
                            <tr>
                              <th className="px-4 py-2.5">Visitor Lead</th>
                              <th className="px-4 py-2.5">Contact Info</th>
                              <th className="px-4 py-2.5">Travel Preferences</th>
                              <th className="px-4 py-2.5">Quoted Proposal ($)</th>
                              <th className="px-4 py-2.5">CRM Stage</th>
                              <th className="px-4 py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/60">
                            {filteredInquiries.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                                  {inquiries.length === 0
                                    ? 'No quote inquiries received yet.'
                                    : 'No leads matched your search query or status filter.'}
                                </td>
                              </tr>
                            ) : (
                              filteredInquiries
                                .slice((inquiryPage - 1) * 5, inquiryPage * 5)
                                .map((inq) => (
                                  <tr key={inq.id} className="hover:bg-stone-900/50 transition-colors">
                                    {/* 1. Visitor Lead Column */}
                                    <td className="px-4 py-3">
                                      <button
                                        onClick={() => {
                                          setEditingLead(inq);
                                          setLeadForm({
                                            status: inq.status || 'Pending',
                                            proposalAmount: (inq.proposalAmount || 0).toString(),
                                            followupDate: inq.followupDate || '',
                                            crmNotes: inq.crmNotes || '',
                                            lostReason: inq.lostReason || '',
                                          });
                                          setInquiryViewMode('editor');
                                        }}
                                        className="font-bold text-stone-100 hover:text-[#F97316] text-xs transition-colors flex items-center gap-1.5 group text-left"
                                        title="Click to open Lead Studio Workspace"
                                      >
                                        <User className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                                        <span className="group-hover:underline underline-offset-2 font-semibold">{inq.name}</span>
                                        <Eye className="w-3 h-3 text-stone-500 group-hover:text-[#F97316] shrink-0 transition-colors opacity-70 group-hover:opacity-100" />
                                      </button>
                                    </td>

                                    {/* 2. Contact Info Column */}
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-1.5 text-stone-300 text-xs truncate max-w-[190px]" title={inq.email}>
                                        <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                                        <span className="truncate">{inq.email}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                                        <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <a
                                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)}%2C%20thank%20you%20for%20your%20inquiry%20with%20You%20%26%20Me%20Independent%20Voyage.`}
                                          target="_blank"
                                          className="text-emerald-400 hover:underline font-medium flex items-center gap-1"
                                          title="Chat on WhatsApp"
                                        >
                                          <span>{inq.phone}</span>
                                          <span className="text-[10px] text-emerald-500/80 font-mono">(WhatsApp)</span>
                                        </a>
                                      </div>
                                    </td>

                                    {/* 3. Travel Preferences Column */}
                                    <td className="px-4 py-3 max-w-[230px]">
                                      <div className="font-semibold text-stone-200 text-xs truncate" title={`${inq.category || 'Private Tour'} · ${inq.destination || 'Tamil Nadu & Kerala'}`}>
                                        {inq.category || 'Private Tour'} · {inq.destination || 'Tamil Nadu & Kerala'}
                                      </div>
                                      <div className="text-stone-400 text-[11px] mt-1 flex items-center gap-2 font-mono">
                                        <span>📅 {inq.month || 'Flexible'}</span>
                                        <span className="text-stone-600">·</span>
                                        <span>👥 {inq.travelers || 2} Guests</span>
                                      </div>
                                    </td>

                                    {/* 4. Quoted Proposal ($) Column */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-stone-100 font-serif font-bold text-sm">
                                        ${(inq.proposalAmount || 0).toLocaleString()} USD
                                      </div>
                                      {inq.followupDate ? (
                                        <span className="inline-flex items-center gap-1 bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1">
                                          <Calendar className="w-2.5 h-2.5" /> {inq.followupDate}
                                        </span>
                                      ) : null}
                                    </td>

                                    {/* 5. CRM Stage Column */}
                                    <td className="px-4 py-3">
                                      <select
                                        value={inq.status}
                                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                                        className={`text-xs font-semibold rounded px-2.5 py-1 outline-none border cursor-pointer ${
                                          inq.status === 'Pending'
                                            ? 'bg-orange-950/80 text-orange-300 border-orange-800'
                                            : inq.status === 'Contacted'
                                            ? 'bg-sky-950/80 text-sky-300 border-sky-800'
                                            : inq.status === 'Follow Up'
                                            ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                                            : inq.status === 'Proposal Sent'
                                            ? 'bg-orange-950/80 text-orange-300 border-orange-800'
                                            : inq.status === 'Converted'
                                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 font-bold'
                                            : 'bg-rose-950/80 text-rose-300 border-rose-800'
                                        }`}
                                      >
                                        <option value="Pending">🟡 Pending (New Inquiry)</option>
                                        <option value="Contacted">🔵 Contacted</option>
                                        <option value="Follow Up">🟣 Follow Up Scheduled</option>
                                        <option value="Proposal Sent">🟧 Proposal Sent</option>
                                        <option value="Converted">🟢 Converted (Won)</option>
                                        <option value="Lost">🔴 Lost (Select Reason)</option>
                                      </select>

                                      {inq.status === 'Lost' && inq.lostReason && (
                                        <div className="text-[10px] text-rose-400 font-mono mt-1 max-w-xs truncate" title={inq.lostReason}>
                                          ⚠️ Reason: {inq.lostReason}
                                        </div>
                                      )}
                                    </td>

                                    {/* 6. Actions Column */}
                                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                                      <button
                                        onClick={() => {
                                          setEditingLead(inq);
                                          setLeadForm({
                                            status: inq.status || 'Pending',
                                            proposalAmount: (inq.proposalAmount || 0).toString(),
                                            followupDate: inq.followupDate || '',
                                            crmNotes: inq.crmNotes || '',
                                            lostReason: inq.lostReason || '',
                                          });
                                          setInquiryViewMode('editor');
                                        }}
                                        className="text-stone-300 hover:text-primary p-1.5 rounded-lg hover:bg-stone-800 inline-flex items-center"
                                        title="View Lead CRM Studio Workspace"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => deleteInquiry(inq.id)}
                                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/50 inline-flex items-center"
                                        title="Delete Inquiry"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Inquiries Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-[#141210] border border-stone-800 p-4 rounded-xl text-xs">
                          <span className="text-stone-400">
                            Page <strong className="text-stone-200">{inquiryPage}</strong> of{' '}
                            <strong className="text-stone-200">{totalPages}</strong> ({filteredInquiries.length} total)
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setInquiryPage((p) => Math.max(1, p - 1))}
                              disabled={inquiryPage === 1}
                              className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                            >
                              ← Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                              <button
                                key={p}
                                onClick={() => setInquiryPage(p)}
                                className={`w-7 h-7 rounded font-bold ${
                                  inquiryPage === p ? 'bg-primary text-black' : 'bg-stone-900 border border-stone-800 text-stone-300'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                            <button
                              onClick={() => setInquiryPage((p) => Math.min(totalPages, p + 1))}
                              disabled={inquiryPage === totalPages}
                              className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* DEDICATED FULL-PAGE LEAD CRM STUDIO WORKSPACE (NO POPUP MODAL!) */
              <div className="space-y-6">
                {/* Top Back & Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setInquiryViewMode('list')}
                      className="flex items-center gap-2 text-xs text-[#F97316] font-bold bg-stone-900 border border-stone-800 px-3.5 py-2 rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Quote Requests List
                    </button>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                        <User className="w-6 h-6 text-[#F97316]" /> Lead CRM Workspace: {editingLead?.name}
                      </h2>
                      <p className="text-xs text-stone-400">Full-width dedicated CRM pipeline manager & quote proposal studio</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingLead && (
                      <>
                        <a
                          href={`https://wa.me/${editingLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(editingLead.name)}%2C%20thank%20you%20for%20your%20inquiry%20with%20You%20%26%20Me%20Independent%20Voyage.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#00e676] text-slate-950 font-bold rounded-lg text-xs hover:bg-[#00c853] transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                        </a>
                        <a
                          href={`mailto:${editingLead.email}?subject=You%20%26%20Me%20Independent%20Voyage%20-%20Your%20Custom%20Tour%20Proposal`}
                          className="flex items-center gap-2 px-4 py-2 bg-sky-950/80 border border-sky-700 text-sky-400 rounded-lg text-xs font-bold hover:bg-sky-900 transition-colors"
                        >
                          <Mail className="w-4 h-4" /> Send Email
                        </a>
                      </>
                    )}
                    <button
                      onClick={handleSaveLeadCrm}
                      className="flex items-center gap-2 px-5 py-2 bg-gold-gradient text-stone-950 text-xs font-bold rounded-lg shadow-md hover:brightness-110"
                    >
                      <Save className="w-4 h-4" /> Save Lead CRM Record
                    </button>
                  </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSaveLeadCrm} className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Customer Profile & Details (Spans 2 columns) */}
                    <div className="lg:col-span-2 space-y-6 bg-[#141210] border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-4">
                        <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-[#F97316]" /> Visitor Inquiry Profile
                        </h3>
                        <span className="text-[11px] font-mono bg-stone-900 border border-stone-800 text-stone-400 px-3 py-1 rounded-full font-semibold">
                          ID: {editingLead?.id}
                        </span>
                      </div>

                      <div className="space-y-5 text-stone-300">
                        {/* Full Name Banner */}
                        <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-xl space-y-1">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Full Name</span>
                          <strong className="text-xl font-serif font-bold text-stone-50 block leading-snug">{editingLead?.name}</strong>
                        </div>

                        {/* Contact Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-900/40 border border-stone-800/80 rounded-xl">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Email Address</span>
                            <span className="text-sm text-stone-200 font-mono font-medium block truncate" title={editingLead?.email}>{editingLead?.email}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Phone / WhatsApp</span>
                            <span className="text-sm text-emerald-400 font-bold font-mono block">{editingLead?.phone}</span>
                          </div>
                        </div>

                        {/* Safari Request Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-900/40 border border-stone-800/80 rounded-xl">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Requested Safari Category</span>
                            <span className="text-sm text-stone-100 font-bold block">{editingLead?.category || 'Private Safari'}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Destination</span>
                            <span className="text-sm text-stone-100 font-bold block">{editingLead?.destination || 'Tamil Nadu & Kerala'}</span>
                          </div>
                        </div>

                        {/* Travel Dates & Guests Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-900/40 border border-stone-800/80 rounded-xl">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Preferred Travel Month</span>
                            <span className="text-sm text-orange-400 font-bold block">{editingLead?.month || 'Flexible'}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Number of Guests</span>
                            <span className="text-sm text-stone-200 font-bold block">{editingLead?.travelers || 2} Travelers</span>
                          </div>
                        </div>

                        {/* Customer Message Block */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Customer Message & Requirements</span>
                          <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-stone-200 leading-relaxed italic whitespace-pre-line text-xs">
                            "{editingLead?.message || 'No initial message submitted.'}"
                          </div>
                        </div>

                        {/* Timestamp Footer */}
                        <div className="text-[11px] text-stone-500 font-mono border-t border-stone-800/80 pt-3">
                          Submitted: {new Date(editingLead?.createdAt || Date.now()).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: CRM Pipeline Stage & Financial Quote Studio (Spans 1 column) */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* 1. Stage Pipeline Manager */}
                      <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                          <h3 className="font-serif text-base font-bold text-stone-200 flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#F97316]" /> Select Deal Stage *
                          </h3>
                          <span className="text-[10px] bg-stone-800 text-[#F97316] px-2 py-0.5 rounded font-mono font-bold">
                            {leadForm.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'Pending', label: '🟡 Pending', color: 'border-orange-700 bg-orange-950/40 text-orange-300' },
                            { id: 'Contacted', label: '🔵 Contacted', color: 'border-sky-700 bg-sky-950/40 text-sky-300' },
                            { id: 'Follow Up', label: '🟣 Follow Up', color: 'border-purple-700 bg-purple-950/40 text-purple-300' },
                            { id: 'Proposal Sent', label: '🟧 Proposal Sent', color: 'border-orange-700 bg-orange-950/40 text-orange-300' },
                            { id: 'Converted', label: '🟢 Converted', color: 'border-emerald-700 bg-emerald-950/40 text-emerald-300' },
                            { id: 'Lost', label: '🔴 Lost Deal', color: 'border-rose-700 bg-rose-950/40 text-rose-300' },
                          ].map((stage) => (
                            <button
                              type="button"
                              key={stage.id}
                              onClick={() => setLeadForm({ ...leadForm, status: stage.id })}
                              className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition-all text-center leading-tight ${
                                leadForm.status === stage.id
                                  ? `${stage.color} ring-2 ring-[#F97316]`
                                  : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              {stage.label}
                            </button>
                          ))}
                        </div>

                        {/* Quoted Deal Amount ($ USD) Field */}
                        <div className="pt-3 border-t border-stone-800 space-y-2">
                          <label className="text-stone-300 font-bold flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-emerald-400" /> Quoted Amount ($ USD)
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono font-normal">Optional</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">$</span>
                            <input
                              type="number"
                              step="50"
                              value={leadForm.proposalAmount}
                              onChange={(e) => setLeadForm({ ...leadForm, proposalAmount: e.target.value })}
                              placeholder="e.g. 2500"
                              className="w-full bg-stone-900 border border-stone-700 text-stone-100 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:border-[#F97316] font-mono font-bold"
                            />
                          </div>
                        </div>

                        {/* Lost Reason Input Field (Visible when Lost is selected) */}
                        {leadForm.status === 'Lost' && (
                          <div className="pt-2 space-y-1.5">
                            <label className="text-rose-400 font-bold block flex items-center gap-1.5 text-xs">
                              <AlertCircle className="w-3.5 h-3.5" /> Reason for Losing Deal *
                            </label>
                            <input
                              type="text"
                              required
                              value={leadForm.lostReason}
                              onChange={(e) => setLeadForm({ ...leadForm, lostReason: e.target.value })}
                              placeholder="e.g. Budget limitation, Chose competitor"
                              className="w-full bg-stone-900 border border-rose-800 text-stone-100 rounded-xl p-2.5 outline-none focus:border-rose-500 text-xs font-medium"
                            />
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setInquiryViewMode('list')}
                          className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="gold-button text-xs px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Save className="w-4 h-4" /> Save Record
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )
          )}



          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Guest Testimonials Manager</h2>
                  <p className="text-xs text-stone-400">Add or edit guest reviews displayed on front-end</p>
                </div>
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setReviewForm({
                      author: '',
                      country: 'United States',
                      countryFlag: 'US',
                      rating: '5',
                      text: '',
                    });
                    setReviewModal(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2 text-xs font-semibold text-stone-950"
                >
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews
                  .slice((reviewPage - 1) * 4, reviewPage * 4)
                  .map((rev) => (
                    <div key={rev.id} className="bg-[#141210] border border-stone-800 p-5 rounded-xl space-y-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <strong className="font-serif font-bold text-stone-100">{rev.author} ({rev.countryFlag})</strong>
                        <span className="text-orange-400 text-xs font-bold">★ {rev.rating}/5</span>
                      </div>
                      <p className="text-xs text-stone-300 italic">“{rev.text}”</p>
                      <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                        <button
                          onClick={() => {
                            setEditingReview(rev);
                            setReviewForm({
                              author: rev.author,
                              country: rev.country,
                              countryFlag: rev.countryFlag,
                              rating: rev.rating.toString(),
                              text: rev.text,
                            });
                            setReviewModal(true);
                          }}
                          className="text-xs text-primary underline"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteReview(rev.id)} className="text-xs text-rose-400 underline">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Reviews Pagination */}
              {Math.ceil(reviews.length / 4) > 1 && (
                <div className="flex items-center justify-between bg-[#141210] border border-stone-800 p-4 rounded-xl text-xs">
                  <span className="text-stone-400">
                    Page <strong className="text-stone-200">{reviewPage}</strong> of{' '}
                    <strong className="text-stone-200">{Math.ceil(reviews.length / 4)}</strong> ({reviews.length} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                      disabled={reviewPage === 1}
                      className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.ceil(reviews.length / 4) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setReviewPage(p)}
                        className={`w-7 h-7 rounded font-bold ${reviewPage === p ? 'bg-primary text-black' : 'bg-stone-900 border border-stone-800 text-stone-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setReviewPage((p) => Math.min(Math.ceil(reviews.length / 4), p + 1))}
                      disabled={reviewPage === Math.ceil(reviews.length / 4)}
                      className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: BLOG POSTS CMS */}
          {activeTab === 'blogs' && (
            <div>
              {blogViewMode === 'list' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">SEO Blog Posts CMS Manager</h2>
                      <p className="text-xs text-stone-400">Create, edit, or publish SEO-optimized blog articles & guides</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogForm({
                          title: '',
                          slug: '',
                          excerpt: '',
                          content: '',
                          coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85',
                          author: 'Discovery Safaris Team',
                          authorRole: 'Safari Specialist',
                          category: 'Travel Guide',
                          readTime: '5 min read',
                          metaTitle: '',
                          metaDescription: '',
                          published: true,
                        });
                        setBlogViewMode('editor');
                      }}
                      className="flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2 text-xs font-semibold text-stone-950 shadow-md hover:brightness-110"
                    >
                      <Plus className="w-4 h-4" /> Create Blog Article
                    </button>
                  </div>

                  {/* Blog Posts Table */}
                  <div className="bg-[#141210] border border-stone-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs text-stone-300">
                      <thead className="bg-stone-900 border-b border-stone-800 uppercase tracking-wider text-[10px] text-stone-400">
                        <tr>
                          <th className="p-4">Article Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Author</th>
                          <th className="p-4">Read Time</th>
                          <th className="p-4">Published</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60">
                        {blogs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-stone-500">No blog posts created yet.</td>
                          </tr>
                        ) : (
                          blogs
                            .slice((blogPage - 1) * 5, blogPage * 5)
                            .map((post) => (
                              <tr key={post.id} className="hover:bg-stone-900/40 transition-colors">
                                <td className="p-4 font-semibold text-stone-100 flex items-center gap-3">
                                  <img src={post.coverImage} alt={post.title} className="w-12 h-10 object-cover rounded" />
                                  <div>
                                    <div className="font-bold text-stone-200 line-clamp-1">{post.title}</div>
                                    <span className="text-[10px] text-stone-500 font-mono">/blog/{post.slug}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="bg-stone-800 text-[#F97316] px-2 py-0.5 rounded text-[10px] font-bold">
                                    {post.category}
                                  </span>
                                </td>
                                <td className="p-4">{post.author}</td>
                                <td className="p-4 text-stone-400">{post.readTime}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${post.published ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-stone-800 text-stone-400'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-stone-400 hover:text-primary inline-block">
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => {
                                      setEditingBlog(post);
                                      setBlogForm({
                                        title: post.title,
                                        slug: post.slug,
                                        excerpt: post.excerpt,
                                        content: post.content,
                                        coverImage: post.coverImage,
                                        author: post.author,
                                        authorRole: post.authorRole,
                                        category: post.category,
                                        readTime: post.readTime,
                                        metaTitle: post.metaTitle || '',
                                        metaDescription: post.metaDescription || '',
                                        published: post.published,
                                      });
                                      setBlogViewMode('editor');
                                    }}
                                    className="p-1.5 text-stone-300 hover:text-primary"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlog(post.id)}
                                    className="p-1.5 text-rose-400 hover:text-rose-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Blogs Pagination */}
                  {Math.ceil(blogs.length / 5) > 1 && (
                    <div className="flex items-center justify-between bg-[#141210] border border-stone-800 p-4 rounded-xl text-xs">
                      <span className="text-stone-400">
                        Page <strong className="text-stone-200">{blogPage}</strong> of{' '}
                        <strong className="text-stone-200">{Math.ceil(blogs.length / 5)}</strong> ({blogs.length} total)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBlogPage((p) => Math.max(1, p - 1))}
                          disabled={blogPage === 1}
                          className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                        >
                          ← Prev
                        </button>
                        {Array.from({ length: Math.ceil(blogs.length / 5) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setBlogPage(p)}
                            className={`w-7 h-7 rounded font-bold ${blogPage === p ? 'bg-primary text-black' : 'bg-stone-900 border border-stone-800 text-stone-300'}`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => setBlogPage((p) => Math.min(Math.ceil(blogs.length / 5), p + 1))}
                          disabled={blogPage === Math.ceil(blogs.length / 5)}
                          className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* DEDICATED FULL-PAGE BLOG EDITOR VIEW (NO POPUP MODAL!) */
                <div className="space-y-6">
                  {/* Editor Header Navigation */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setBlogViewMode('list')}
                        className="flex items-center gap-2 text-xs text-[#F97316] font-bold bg-stone-900 border border-stone-800 px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Articles List
                      </button>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#F97316]" />
                          {editingBlog ? 'Editing Article Workspace' : 'Create New Article Workspace'}
                        </h2>
                        <p className="text-xs text-stone-400">Full-width dedicated article creation and SEO optimization studio</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBlogViewMode('list')}
                        className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBlog}
                        className="flex items-center gap-2 px-5 py-2 bg-gold-gradient text-stone-950 text-xs font-bold rounded-lg shadow-md hover:brightness-110"
                      >
                        <Save className="w-4 h-4" /> {editingBlog ? 'Save & Update Article' : 'Publish Article Now'}
                      </button>
                    </div>
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handleSaveBlog} className="space-y-6 text-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Column: Article Metadata & Visuals */}
                      <div className="lg:col-span-7 space-y-6 bg-[#141210] border border-stone-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-serif text-lg font-bold text-stone-200 border-b border-stone-800 pb-3">Article Metadata</h3>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Article Title *</label>
                          <input
                            type="text"
                            required
                            value={blogForm.title}
                            onChange={(e) => {
                              const titleVal = e.target.value;
                              const autoSlug = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                              setBlogForm({ ...blogForm, title: titleVal, slug: editingBlog ? blogForm.slug : autoSlug });
                            }}
                            placeholder="e.g. The Ultimate Guide to South India Temple & Backwater Tour"
                            className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-primary text-sm font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">URL Slug</label>
                            <input
                              type="text"
                              required
                              value={blogForm.slug}
                              onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                              placeholder="ultimate-guide-namibia-safari"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none font-mono"
                            />
                            <span className="text-[10px] text-stone-500 mt-1 block">Preview: /blog/{blogForm.slug || 'slug-here'}</span>
                          </div>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Category</label>
                            <select
                              value={blogForm.category}
                              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            >
                              <option value="Travel Guide">Travel Guide</option>
                              <option value="Wildlife">Wildlife</option>
                              <option value="Photography">Photography</option>
                              <option value="Tips">Tips & Hacks</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Author Name</label>
                            <input
                              type="text"
                              required
                              value={blogForm.author}
                              onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Author Role</label>
                            <input
                              type="text"
                              required
                              value={blogForm.authorRole}
                              onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })}
                              placeholder="Safari Specialist"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 font-semibold mb-1">Estimated Read Time</label>
                            <input
                              type="text"
                              required
                              value={blogForm.readTime}
                              onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                              placeholder="5 min read"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none"
                            />
                          </div>
                        </div>

                        <ImageUploader
                          label="Article Cover Image"
                          value={blogForm.coverImage}
                          onChange={(val) => setBlogForm({ ...blogForm, coverImage: val })}
                          recommendedSize="1200 × 630 px (1.91:1 Ratio)"
                        />

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Excerpt (Short Summary) *</label>
                          <textarea
                            rows={3}
                            required
                            value={blogForm.excerpt}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            placeholder="A brief 1-2 sentence preview for search results and cards..."
                            className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Right Column: Content Studio & SEO */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* Article Content Box */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                            <h3 className="font-serif text-lg font-bold text-stone-200">Article Main Body</h3>
                            <span className="text-[10px] bg-stone-800 text-[#F97316] px-2 py-0.5 rounded font-mono font-bold">Markdown Supported</span>
                          </div>

                          <div>
                            <textarea
                              rows={14}
                              required
                              value={blogForm.content}
                              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                              placeholder="Write your article content here... (Supports Markdown headers #, bold **, lists -, images ![], etc.)"
                              className="w-full bg-stone-900 border border-stone-700 p-4 rounded-xl text-stone-100 outline-none font-sans leading-relaxed text-sm focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* SEO Box & Search Preview */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                          <h3 className="font-serif text-lg font-bold text-[#F97316] border-b border-stone-800 pb-3">SEO & Search Engine Snippet</h3>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-400 font-semibold">SEO Meta Title</label>
                              {(() => {
                                const titleLen = (blogForm.metaTitle || '').length;
                                let color = 'text-orange-400 bg-orange-950/40 border-orange-800/60';
                                if (titleLen >= 50 && titleLen <= 60) color = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
                                if (titleLen > 60) color = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
                                return (
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
                                    {titleLen} / 60 Chars {titleLen >= 50 && titleLen <= 60 ? '✓ Optimal' : titleLen > 60 ? '⚠️ Exceeds 60' : '(Rec: 50-60)'}
                                  </span>
                                );
                              })()}
                            </div>
                            <input
                              type="text"
                              value={blogForm.metaTitle}
                              onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                              placeholder="Defaults to Title | You & Me – Independent Voyage"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none font-semibold text-xs"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-400 font-semibold">SEO Meta Description</label>
                              {(() => {
                                const descLen = (blogForm.metaDescription || '').length;
                                let color = 'text-orange-400 bg-orange-950/40 border-orange-800/60';
                                if (descLen >= 140 && descLen <= 160) color = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
                                if (descLen > 160) color = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
                                return (
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
                                    {descLen} / 160 Chars {descLen >= 140 && descLen <= 160 ? '✓ Optimal' : descLen > 160 ? '⚠️ Exceeds 160' : '(Rec: 150-160)'}
                                  </span>
                                );
                              })()}
                            </div>
                            <textarea
                              rows={3}
                              value={blogForm.metaDescription}
                              onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })}
                              placeholder="Defaults to Article excerpt copy"
                              className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none resize-none text-xs leading-relaxed"
                            />
                          </div>

                          {/* Live Google Search Result Preview Box */}
                          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-1">
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mb-1">Google Search Result Preview</span>
                            <div className="text-xs text-blue-400 font-semibold truncate hover:underline cursor-pointer">
                              {blogForm.metaTitle || blogForm.title || 'Article Title | You & Me – Independent Voyage'}
                            </div>
                            <div className="text-[11px] text-emerald-500 truncate font-mono">
                              https://youandmevoyage.com/blog/{blogForm.slug || 'article-slug'}
                            </div>
                            <div className="text-[11px] text-stone-400 line-clamp-2">
                              {blogForm.metaDescription || blogForm.excerpt || 'Article summary preview will appear here in search engine results.'}
                            </div>
                          </div>
                        </div>

                        {/* Publish Status & Actions */}
                        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                          <label className="flex items-center gap-3 cursor-pointer text-stone-200 font-semibold">
                            <input
                              type="checkbox"
                              checked={blogForm.published}
                              onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                              className="accent-primary w-5 h-5 rounded cursor-pointer"
                            />
                            <span>Publish Article Immediately</span>
                          </label>

                          <div className="flex gap-3 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setBlogViewMode('list')}
                              className="flex-1 sm:flex-initial px-4 py-2.5 bg-stone-800 text-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gold-gradient text-stone-950 text-xs font-bold rounded-lg shadow-lg hover:brightness-110"
                            >
                              {editingBlog ? 'Save & Update' : 'Publish Article'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB: FAQ CMS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#F97316]" /> Frequently Asked Questions (FAQ) CMS
                  </h2>
                  <p className="text-xs text-stone-400">Add, edit, or delete dynamic FAQ items live-synced across the website</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq(null);
                    setFaqForm({
                      question: '',
                      answer: '',
                      category: 'Booking & Inclusions',
                    });
                    setFaqModal(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2 text-xs font-semibold text-stone-950 shadow-md hover:brightness-110"
                >
                  <Plus className="w-4 h-4" /> Add New FAQ Question
                </button>
              </div>

              {/* FAQs Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.length === 0 ? (
                  <div className="col-span-2 p-8 text-center bg-[#141210] border border-stone-800 rounded-xl text-stone-500 text-xs">
                    No FAQ questions found. Click "Add New FAQ Question" to create one.
                  </div>
                ) : (
                  faqs
                    .slice((faqPage - 1) * 6, faqPage * 6)
                    .map((faq) => (
                      <div key={faq.id} className="bg-[#141210] border border-stone-800 p-5 rounded-xl space-y-3 shadow-lg flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] px-2.5 py-0.5 rounded font-mono font-bold">
                              {faq.category || 'General'}
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">ID: {faq.id}</span>
                          </div>
                          <h3 className="font-serif font-bold text-stone-100 text-sm">{faq.question}</h3>
                          <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">{faq.answer}</p>
                        </div>
                        <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                          <button
                            onClick={() => {
                              setEditingFaq(faq);
                              setFaqForm({
                                question: faq.question,
                                answer: faq.answer,
                                category: faq.category || 'Booking & Inclusions',
                              });
                              setFaqModal(true);
                            }}
                            className="p-1.5 text-stone-300 hover:text-primary flex items-center gap-1 text-xs"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 flex items-center gap-1 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* FAQs Pagination */}
              {Math.ceil(faqs.length / 6) > 1 && (
                <div className="flex items-center justify-between bg-[#141210] border border-stone-800 p-4 rounded-xl text-xs">
                  <span className="text-stone-400">
                    Page <strong className="text-stone-200">{faqPage}</strong> of{' '}
                    <strong className="text-stone-200">{Math.ceil(faqs.length / 6)}</strong> ({faqs.length} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFaqPage((p) => Math.max(1, p - 1))}
                      disabled={faqPage === 1}
                      className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.ceil(faqs.length / 6) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFaqPage(p)}
                        className={`w-7 h-7 rounded font-bold ${faqPage === p ? 'bg-[#F97316] text-black' : 'bg-stone-900 border border-stone-800 text-stone-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setFaqPage((p) => Math.min(Math.ceil(faqs.length / 6), p + 1))}
                      disabled={faqPage === Math.ceil(faqs.length / 6)}
                      className="px-3 py-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: LEGAL & TERMS CMS */}
          {activeTab === 'legal' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="font-serif text-2xl font-bold">Legal Pages Dynamic Content CMS</h2>
                <p className="text-xs text-stone-400">Edit and update Terms & Conditions and Privacy Policy page content dynamically</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#141210] border border-stone-800 rounded-xl p-6 space-y-6">
                <div>
                  <label className="text-xs text-primary font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Terms & Conditions Content
                  </label>
                  <textarea
                    rows={8}
                    value={settings.termsContent || ''}
                    onChange={(e) => setSettings({ ...settings, termsContent: e.target.value })}
                    placeholder="Enter terms and conditions text..."
                    className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg p-3.5 text-sm outline-none focus:border-primary leading-relaxed"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">Live on: http://localhost:3001/terms</span>
                </div>

                <div className="border-t border-stone-800 pt-5">
                  <label className="text-xs text-primary font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Privacy Policy Content
                  </label>
                  <textarea
                    rows={8}
                    value={settings.privacyContent || ''}
                    onChange={(e) => setSettings({ ...settings, privacyContent: e.target.value })}
                    placeholder="Enter privacy policy text..."
                    className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg p-3.5 text-sm outline-none focus:border-primary leading-relaxed"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">Live on: http://localhost:3001/privacy</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold text-stone-950 shadow-md hover:brightness-110 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Legal Content & Sync Front-End
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: SITE SETTINGS & CMS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 w-full">
              <div>
                <h2 className="font-serif text-2xl font-bold">Site Settings & CMS Configuration</h2>
                <p className="text-xs text-stone-400">Switch between sub-categories to configure your site's parameters</p>
              </div>

              {/* Sub-tab Pills Navigation Bar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-3 w-full">
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('basic')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    settingsSubTab === 'basic'
                      ? 'bg-[#F97316] text-black font-bold shadow'
                      : 'bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <Sliders className="w-4 h-4" /> Basic Settings
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('social')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    settingsSubTab === 'social'
                      ? 'bg-[#F97316] text-black font-bold shadow'
                      : 'bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <Share2 className="w-4 h-4" /> Social Media Settings
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('cloudinary')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    settingsSubTab === 'cloudinary'
                      ? 'bg-[#F97316] text-black font-bold shadow'
                      : 'bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <Cloud className="w-4 h-4" /> Cloudinary Settings
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('seo')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    settingsSubTab === 'seo'
                      ? 'bg-[#F97316] text-black font-bold shadow'
                      : 'bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <Globe className="w-4 h-4" /> Site SEO Settings
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('banner')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    settingsSubTab === 'banner'
                      ? 'bg-[#F97316] text-black font-bold shadow'
                      : 'bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Banner Settings
                </button>
              </div>

              {/* Form Container */}
              <form onSubmit={handleSaveSettings} className="bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
                {/* 1. BASIC SETTINGS */}
                {settingsSubTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="border-b border-stone-800 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[#F97316]" /> Basic Site Configuration
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <div className="w-full">
                        <ImageUploader
                          label="Website Brand Logo Image"
                          value={settings.siteLogo || ''}
                          onChange={(val) => setSettings({ ...settings, siteLogo: val })}
                          recommendedSize="240 × 60 px (PNG/SVG Transparent)"
                          maxDimension={600}
                        />
                      </div>

                      <div className="w-full">
                        <ImageUploader
                          label="Website Favicon Icon (.ico / .png / .svg)"
                          value={settings.siteFavicon || ''}
                          onChange={(val) => setSettings({ ...settings, siteFavicon: val })}
                          recommendedSize="64 × 64 px or 32 × 32 px (.png, .ico, .svg)"
                          maxDimension={200}
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Website Brand / Title</label>
                        <input
                          type="text"
                          value={settings.siteTitle || ''}
                          onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Contact Email Address</label>
                        <input
                          type="email"
                          value={settings.contactEmail || ''}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">WhatsApp Hotline Number</label>
                        <input
                          type="text"
                          value={settings.whatsappNumber || ''}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>


                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Admin Passcode</label>
                        <input
                          type="text"
                          value={settings.adminPasscode || 'admin123'}
                          onChange={(e) => setSettings({ ...settings, adminPasscode: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      {/* Google Maps Location Configuration */}
                      <div className="w-full space-y-4 pt-4 border-t border-stone-800">
                        <h4 className="text-xs font-bold text-[#F97316] uppercase tracking-wider flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#F97316]" /> Google Map Location & Office Contact Settings
                        </h4>

                        <div className="flex flex-col gap-4 w-full">
                          <div className="w-full">
                            <label className="text-xs text-stone-400 font-semibold block mb-1">
                              Google Maps Embed URL (Iframe src or Share Embed URL)
                            </label>
                            <input
                              type="text"
                              value={settings.googleMapEmbedUrl || ''}
                              onChange={(e) => setSettings({ ...settings, googleMapEmbedUrl: e.target.value })}
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary font-mono text-xs truncate text-ellipsis overflow-hidden whitespace-nowrap"
                            />
                            <span className="text-[10px] text-stone-500 mt-1 block">
                              Tip: Paste your Google Maps embed URL (e.g. from Google Maps share iframe code)
                            </span>
                          </div>

                          <div className="w-full">
                            <label className="text-xs text-stone-400 font-semibold block mb-1">Office Physical Address</label>
                            <input
                              type="text"
                              value={settings.officeAddress || ''}
                              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                              placeholder="Dispatch Hub: Airport Road, Madurai / Chennai, Tamil Nadu, India"
                              className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>

                          <div className="w-full">
                            <label className="text-xs text-stone-400 font-semibold block mb-1">Office Telephone / Hotline</label>
                            <input
                              type="text"
                              value={settings.officePhone || ''}
                              onChange={(e) => setSettings({ ...settings, officePhone: e.target.value })}
                              placeholder="+91 98400 00000 / +91 44 2345 6789"
                              className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>

                          <div className="w-full">
                            <label className="text-xs text-stone-400 font-semibold block mb-1">Business Operation Hours</label>
                            <input
                              type="text"
                              value={settings.operationHours || ''}
                              onChange={(e) => setSettings({ ...settings, operationHours: e.target.value })}
                              placeholder="Mon – Sat: 08:00 – 18:00 (CAT) · 24/7 Dispatch"
                              className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                            />
                            <span className="text-[10px] text-stone-500 mt-1 block">Displayed live in website footer and contact cards</span>
                          </div>

                          <div className="flex items-center gap-3 pt-2 w-full">
                            <input
                              type="checkbox"
                              id="showGoogleMapInFooter"
                              checked={settings.showGoogleMapInFooter !== false}
                              onChange={(e) => setSettings({ ...settings, showGoogleMapInFooter: e.target.checked })}
                              className="w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
                            />
                            <label htmlFor="showGoogleMapInFooter" className="text-xs text-stone-300 font-medium cursor-pointer">
                              Show interactive Google Map card in website Footer
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SOCIAL MEDIA SETTINGS */}
                {settingsSubTab === 'social' && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-800 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-[#F97316]" /> Social Media & TripAdvisor Profile Links
                      </h3>
                      <p className="text-xs text-stone-400">Configure official social channel URLs & TripAdvisor link. These links update live in header, footer & site badges.</p>
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Enter your official profile links below. Any link provided will automatically be displayed across the website header, footer, and trip rating badges.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">TripAdvisor Profile / Review URL</label>
                        <input
                          type="text"
                          value={settings.tripadvisorUrl || settings.tripAdvisorUrl || ''}
                          onChange={(e) => setSettings({ ...settings, tripadvisorUrl: e.target.value, tripAdvisorUrl: e.target.value })}
                          placeholder="https://www.tripadvisor.in/Attraction_Review-g304556-d21279654-Reviews..."
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Instagram Profile URL</label>
                        <input
                          type="text"
                          value={settings.instagramUrl || ''}
                          onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                          placeholder="https://www.instagram.com/youandmevoyage/"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Facebook Page URL</label>
                        <input
                          type="text"
                          value={settings.facebookUrl || ''}
                          onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                          placeholder="https://www.facebook.com/p/Youme-independent-voyage-100064363920653/"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CLOUDINARY SETTINGS */}
                {settingsSubTab === 'cloudinary' && (
                  <div className="space-y-4 w-full">
                    <div className="border-b border-stone-800 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-[#F97316]" /> Cloudinary Image CDN Configuration
                      </h3>
                      <p className="text-xs text-stone-400">Configure Cloudinary for cloud media storage & automated image optimization</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Cloud Name</label>
                        <input
                          type="text"
                          value={settings.cloudinaryCloudName || ''}
                          onChange={(e) => setSettings({ ...settings, cloudinaryCloudName: e.target.value })}
                          placeholder="e.g. discovery-safaris"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Upload Preset Name</label>
                        <input
                          type="text"
                          value={settings.cloudinaryUploadPreset || ''}
                          onChange={(e) => setSettings({ ...settings, cloudinaryUploadPreset: e.target.value })}
                          placeholder="e.g. safari_uploads"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">API Key</label>
                        <input
                          type="password"
                          value={settings.cloudinaryApiKey || ''}
                          onChange={(e) => setSettings({ ...settings, cloudinaryApiKey: e.target.value })}
                          placeholder="••••••••••••••••"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">API Secret</label>
                        <input
                          type="password"
                          value={settings.cloudinaryApiSecret || ''}
                          onChange={(e) => setSettings({ ...settings, cloudinaryApiSecret: e.target.value })}
                          placeholder="••••••••••••••••"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full pt-2 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="enableCloudinary"
                          checked={settings.enableCloudinary || false}
                          onChange={(e) => setSettings({ ...settings, enableCloudinary: e.target.checked })}
                          className="w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
                        />
                        <label htmlFor="enableCloudinary" className="text-xs text-stone-300 font-medium cursor-pointer">
                          Enable automatic Cloudinary image CDN optimization on upload
                        </label>
                      </div>
                    </div>
                  </div>
                )}



                {/* 5. SITE SEO SETTINGS */}
                {settingsSubTab === 'seo' && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-[#F97316]" /> Global Site SEO Configuration
                        </h3>
                        <p className="text-xs text-stone-400">Master search engine optimization metadata & tracking pixels</p>
                      </div>

                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full font-mono font-bold">
                        🔍 Search Engine Compliant
                      </span>
                    </div>

                    {/* SEO Best Practice Rules & Character Limits Guidance Notice */}
                    <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl space-y-2 w-full">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <Globe className="w-4 h-4 text-[#F97316]" /> Standard Search Engine Character Length Guidance
                      </div>
                      <div className="flex flex-col gap-3 text-[11px] text-stone-300 pt-1 w-full">
                        <div className="bg-[#141210] p-3 rounded-xl border border-stone-800 space-y-1 w-full">
                          <strong className="text-stone-100 block font-semibold">Meta Title Length</strong>
                          <span className="text-orange-400 font-mono font-bold block">50 – 60 Characters</span>
                          <p className="text-[10px] text-stone-400 leading-tight">Titles longer than 60 letters will be cut off by Google with "..."</p>
                        </div>

                        <div className="bg-[#141210] p-3 rounded-xl border border-stone-800 space-y-1 w-full">
                          <strong className="text-stone-100 block font-semibold">Meta Description Length</strong>
                          <span className="text-orange-400 font-mono font-bold block">150 – 160 Characters</span>
                          <p className="text-[10px] text-stone-400 leading-tight">Descriptions above 160 letters get truncated in search result snippets.</p>
                        </div>

                        <div className="bg-[#141210] p-3 rounded-xl border border-stone-800 space-y-1 w-full">
                          <strong className="text-stone-100 block font-semibold">Target Keywords</strong>
                          <span className="text-orange-400 font-mono font-bold block">5 – 10 Key Phrases</span>
                          <p className="text-[10px] text-stone-400 leading-tight">Use relevant comma-separated safari and destination terms.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 w-full">
                      {/* Meta Title Field with Live Character Counter */}
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-stone-300 font-semibold">Global Meta Title</label>
                          {(() => {
                            const titleLen = (settings.siteMetaTitle || '').length;
                            let color = 'text-orange-400 border-orange-800/60 bg-orange-950/40';
                            if (titleLen >= 50 && titleLen <= 60) color = 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
                            if (titleLen > 60) color = 'text-rose-400 border-rose-800/60 bg-rose-950/40';
                            return (
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
                                {titleLen} / 60 Chars {titleLen >= 50 && titleLen <= 60 ? '✓ Optimal' : titleLen > 60 ? '⚠️ Exceeds 60' : '(Rec: 50-60)'}
                              </span>
                            );
                          })()}
                        </div>
                        <input
                          type="text"
                          value={settings.siteMetaTitle || ''}
                          onChange={(e) => setSettings({ ...settings, siteMetaTitle: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary font-mono"
                          placeholder="You & Me – Independent Voyage | Custom South India Private Tours"
                        />
                      </div>

                      {/* Meta Description Field with Live Character Counter */}
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-stone-300 font-semibold">Global Meta Description</label>
                          {(() => {
                            const descLen = (settings.siteMetaDescription || '').length;
                            let color = 'text-orange-400 border-orange-800/60 bg-orange-950/40';
                            if (descLen >= 140 && descLen <= 160) color = 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
                            if (descLen > 160) color = 'text-rose-400 border-rose-800/60 bg-rose-950/40';
                            return (
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
                                {descLen} / 160 Chars {descLen >= 140 && descLen <= 160 ? '✓ Optimal' : descLen > 160 ? '⚠️ Exceeds 160' : '(Rec: 150-160)'}
                              </span>
                            );
                          })()}
                        </div>
                        <textarea
                          rows={2}
                          value={settings.siteMetaDescription || ''}
                          onChange={(e) => setSettings({ ...settings, siteMetaDescription: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary font-mono"
                          placeholder="Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India."
                        />
                      </div>

                      {/* Live Google Search Preview Card */}
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1 font-sans">
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mb-1">Google Search Preview</span>
                        <div className="text-blue-400 text-sm font-semibold hover:underline cursor-pointer truncate">
                          {settings.siteMetaTitle || 'You & Me – Independent Voyage | Custom South India Private Tours'}
                        </div>
                        <div className="text-emerald-500 text-xs truncate">
                          https://youandmevoyage.com
                        </div>
                        <div className="text-stone-400 text-xs line-clamp-2">
                          {settings.siteMetaDescription || 'Bespoke private journeys, authentic local experiences, and custom driver-assisted road trips across Tamil Nadu, Kerala, and South India.'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 pt-2 w-full">
                        <div className="w-full">
                          <label className="text-xs text-stone-400 font-semibold block mb-1">Target Keywords (Comma Separated)</label>
                          <input
                            type="text"
                            value={settings.siteKeywords || ''}
                            onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                            placeholder="namibia safari, luxury travel, etosha wildlife, sossusvlei dunes"
                            className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>

                        <div className="w-full">
                          <label className="text-xs text-stone-400 font-semibold block mb-1">Google Analytics Measurement ID</label>
                          <input
                            type="text"
                            value={settings.googleAnalyticsId || ''}
                            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                            placeholder="G-DS12345678"
                            className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-3 border-t border-stone-800/80 w-full">
                        <input
                          type="checkbox"
                          id="enableRobotsIndex"
                          checked={settings.enableRobotsIndex ?? true}
                          onChange={(e) => setSettings({ ...settings, enableRobotsIndex: e.target.checked })}
                          className="w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
                        />
                        <label htmlFor="enableRobotsIndex" className="text-xs text-stone-300 font-medium cursor-pointer">
                          Allow Search Engines to Index the Website (Robots Indexing Enabled)
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. BANNER SETTINGS */}
                {settingsSubTab === 'banner' && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-[#F97316]" /> Hero Multi-Banner Slider (Up to 5 Banners)
                        </h3>
                        <p className="text-xs text-stone-400">Configure homepage carousel hero slides and top promotional announcement banner</p>
                      </div>

                      <span className="text-[10px] text-orange-400 bg-orange-950/60 border border-orange-800/80 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5">
                        📐 Spec: 1920 × 1080 px (Max 2MB)
                      </span>
                    </div>

                    {/* Multi Hero Banner Cards List */}
                    <div className="space-y-6 w-full">
                      {(() => {
                        let bannerList: any[] = [];
                        try {
                          if (settings.heroBanners) {
                            bannerList = typeof settings.heroBanners === 'string' ? JSON.parse(settings.heroBanners) : settings.heroBanners;
                          }
                        } catch (e) {
                          bannerList = [];
                        }

                        if (!Array.isArray(bannerList) && !settings.heroBanners) {
                          bannerList = [
                            {
                              id: 1,
                              headline: settings.heroHeadline || 'Discover Authentic South India Travel',
                              subheadline: settings.heroSubheadline || 'Private Journeys · Heritage Temples · Serene Backwaters',
                              copy: settings.heroCopy || 'Bespoke private tours, architectural wonders, tranquil backwater cruises, and hill station escapes across Tamil Nadu, Kerala, and South India.',
                              image: settings.heroImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2200&q=90',
                            },
                            {
                              id: 2,
                              headline: 'Serene Backwaters & Houseboat Cruises of Kerala',
                              subheadline: 'KERALA BACKWATERS · HOUSEBOATS · PRIVATE CRUISES',
                              copy: 'Drift along palm-fringed canal waters, enjoy freshly cooked Kerala delicacies, and wake up to emerald lagoons.',
                              image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90',
                            },
                            {
                              id: 3,
                              headline: 'Mist-Covered Hills of Munnar & Nilgiri Trails',
                              subheadline: 'HILL STATIONS · TEA ESTATES · NATURE EXPEDITIONS',
                              copy: 'Breathe crisp mountain air amidst sprawling tea gardens, spice plantations, and scenic Western Ghats private routes.',
                              image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2200&q=90',
                            },
                          ];
                        }

                        const updateBannerItem = (index: number, key: string, val: string) => {
                          const updated = [...bannerList];
                          updated[index] = { ...updated[index], [key]: val };
                          setSettings({ ...settings, heroBanners: JSON.stringify(updated) });
                        };

                        const addBannerSlot = () => {
                          if (bannerList.length >= 5) {
                            alert('Maximum 5 Hero Banners allowed.');
                            return;
                          }
                          const newBanner = {
                            id: Date.now(),
                            headline: 'Serene Backwaters & Houseboat Cruises of Kerala',
                            subheadline: 'Palm-Fringed Canals · Authentic Culture · Tropical Escapes',
                            copy: 'Relax on private luxury houseboats drifting through peaceful palm-lined waters.',
                            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2200&q=90',
                          };

                          const updated = [...bannerList, newBanner];
                          setSettings({ ...settings, heroBanners: JSON.stringify(updated) });
                        };

                        const removeBannerSlot = (index: number) => {
                          if (bannerList.length <= 1) {
                            alert('At least 1 Hero Banner is required.');
                            return;
                          }
                          const updated = bannerList.filter((_, idx) => idx !== index);
                          setSettings({ ...settings, heroBanners: JSON.stringify(updated) });
                        };

                        return (
                          <div className="space-y-8 w-full">
                            <div className="flex items-center justify-between w-full">
                              <h4 className="font-serif text-sm font-bold text-stone-200">
                                Active Hero Slider Banners ({bannerList.length}/5 Slots)
                              </h4>
                              {bannerList.length < 5 && (
                                <button
                                  type="button"
                                  onClick={addBannerSlot}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/40 text-xs font-bold hover:bg-[#F97316]/20 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Hero Banner Slot ({5 - bannerList.length} Left)
                                </button>
                              )}
                            </div>

                            {bannerList.map((banner: any, index: number) => (
                              <div key={banner.id || index} className="bg-[#181614] border border-stone-800 rounded-2xl p-6 space-y-5 relative group shadow-xl mb-6 w-full">
                                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 w-full">
                                  <span className="text-xs font-bold text-[#F97316] font-mono flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> Hero Banner Slot #{index + 1}
                                  </span>

                                  {bannerList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeBannerSlot(index)}
                                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/50 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:border-red-400 text-xs font-semibold shadow-sm transition-all"
                                      title="Remove this banner slot"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-400" /> Remove Slot
                                    </button>
                                  )}
                                </div>

                                <div className="flex flex-col gap-4 text-xs w-full">
                                  <div className="w-full">
                                    <label className="text-stone-400 font-semibold block mb-1">Banner Headline</label>
                                    <input
                                      type="text"
                                      value={banner.headline || ''}
                                      onChange={(e) => updateBannerItem(index, 'headline', e.target.value)}
                                      placeholder="Experience authentic South India with custom private driver tours"
                                      className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                                    />
                                  </div>

                                  <div className="w-full">
                                    <label className="text-stone-400 font-semibold block mb-1">Subheadline / Eyebrow</label>
                                    <input
                                      type="text"
                                      value={banner.subheadline || ''}
                                      onChange={(e) => updateBannerItem(index, 'subheadline', e.target.value)}
                                      placeholder="Private journeys · Wild places"
                                      className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                  </div>

                                  <div className="w-full">
                                    <ImageUploader
                                      label="Hero Slide Background Image"
                                      value={banner.image || ''}
                                      onChange={(val) => updateBannerItem(index, 'image', val)}
                                      recommendedSize="1920 × 1080 px (16:9 Ratio)"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Top Announcement Banner Section */}
                    <div className="border-t border-stone-800 pt-6 space-y-4 w-full">
                      <div className="flex items-center justify-between w-full">
                        <h4 className="font-serif text-sm font-bold text-stone-200">Promotional Top Announcement Banner</h4>
                        <span className="text-[10px] text-stone-400 font-mono">Applies to all site headers</span>
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Banner Announcement Text</label>
                        <input
                          type="text"
                          value={settings.announcementBannerText || ''}
                          onChange={(e) => setSettings({ ...settings, announcementBannerText: e.target.value })}
                          placeholder="🔥 Special Offer: Save 15% on 2026 Private Fly-in Safaris!"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="w-full">
                        <label className="text-xs text-stone-400 font-semibold block mb-1">Banner Redirect Target Link</label>
                        <input
                          type="text"
                          value={settings.announcementBannerLink || ''}
                          onChange={(e) => setSettings({ ...settings, announcementBannerLink: e.target.value })}
                          placeholder="/safari/classic-namibia-expedition"
                          className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="pt-2 flex items-center gap-3 w-full">
                        <input
                          type="checkbox"
                          id="enableAnnouncementBanner"
                          checked={settings.enableAnnouncementBanner ?? true}
                          onChange={(e) => setSettings({ ...settings, enableAnnouncementBanner: e.target.checked })}
                          className="w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
                        />
                        <label htmlFor="enableAnnouncementBanner" className="text-xs text-stone-300 font-medium cursor-pointer">
                          Display Top Promotional Banner across all site pages
                        </label>
                      </div>
                    </div>
                  </div>
                )}



                {/* Save Button Bar */}
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-mono">
                    Changes apply immediately to live front-end
                  </span>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-stone-950 shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Saving Settings...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save {settingsSubTab.toUpperCase()} Settings & Sync
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}





          {/* 12. EXPERIENCES CMS TAB */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] border border-stone-800 p-6 rounded-2xl shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" /> Experiences Page Studio
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">Authentic Experiences CMS</h2>
                  <p className="text-xs text-stone-400 mt-1">Manage the experiences cards displayed live on the /experiences page</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingExperienceIndex(null);
                    setExperienceForm({ title: '', subtitle: '', desc: '', image: '' });
                    setShowExperienceModal(true);
                  }}
                  className="gold-button text-xs px-5 py-3 rounded-xl shadow-lg shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Experience
                </button>
              </div>

              {/* Experiences Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const defaultExps: any[] = [];
                  const list = safeParseList(settings?.siteExperiences, defaultExps);
                  return list.map((exp: any, idx: number) => (
                    <div key={idx} className="bg-[#141210] border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-stone-700 transition-all">
                      <div className="relative h-44 overflow-hidden bg-stone-900">
                        <img
                          src={exp.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85'}
                          alt={exp.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-black/70 backdrop-blur-md border border-orange-500/30 px-2.5 py-1 rounded-full shadow">
                            Experience #{idx + 1}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingExperienceIndex(idx);
                              setExperienceForm({
                                title: exp.title || '',
                                subtitle: exp.subtitle || '',
                                desc: exp.desc || exp.description || '',
                                image: exp.image || '',
                              });
                              setShowExperienceModal(true);
                            }}
                            className="bg-stone-900/90 text-orange-400 hover:text-orange-300 p-2 rounded-xl border border-stone-700 hover:border-orange-500 transition-all cursor-pointer shadow"
                            title="Edit Experience"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm(`Delete "${exp.title || 'this experience'}"?`)) return;
                              const updated = list.filter((_: any, i: number) => i !== idx);
                              const experiencesJson = JSON.stringify(updated);
                              const updatedSettings = { ...settings, siteExperiences: experiencesJson };
                              setSettings(updatedSettings);
                              try {
                                const res = await adminFetch('/api/settings', {
                                  method: 'PUT',
                                  body: JSON.stringify({ siteExperiences: experiencesJson }),
                                });
                                let resData = updatedSettings;
                                if (res.ok) {
                                  resData = await res.json();
                                }
                                const finalSettings = { ...updatedSettings, ...resData, siteExperiences: experiencesJson };
                                setSettings(finalSettings);
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('site_settings_cache', JSON.stringify(finalSettings));
                                  window.dispatchEvent(new Event('site_settings_updated'));
                                }
                                showNotification('Experience deleted successfully!');
                                fetchAllData();
                              } catch (e) {
                                showNotification('Failed to delete experience');
                              }
                            }}
                            className="bg-stone-900/90 text-rose-400 hover:text-rose-300 p-2 rounded-xl border border-stone-700 hover:border-rose-500 transition-all cursor-pointer shadow"
                            title="Delete Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="font-serif text-lg font-bold text-stone-100 line-clamp-1">{exp.title}</h4>
                          <p className="text-xs text-orange-400 font-semibold line-clamp-1">{exp.subtitle}</p>
                          <p className="text-xs text-stone-400 font-sans line-clamp-3 leading-relaxed pt-1">
                            {exp.desc || exp.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                          <span className="text-[10px] text-stone-500 font-mono">Live Sync Ready</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingExperienceIndex(idx);
                              setExperienceForm({
                                title: exp.title || '',
                                subtitle: exp.subtitle || '',
                                desc: exp.desc || exp.description || '',
                                image: exp.image || '',
                              });
                              setShowExperienceModal(true);
                            }}
                            className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Save Bar */}
              <div className="flex items-center justify-between bg-[#141210] border border-stone-800 p-4 rounded-2xl shadow-xl">
                <span className="text-[11px] text-stone-500 font-mono">Changes live-sync to /experiences page</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setSaving(true);
                      const list = safeParseList(settings?.siteExperiences, []);
                      const experiencesJson = JSON.stringify(list);
                      const res = await adminFetch('/api/settings', {
                        method: 'PUT',
                        body: JSON.stringify({ siteExperiences: experiencesJson }),
                      });
                      let resData = settings;
                      if (res.ok) {
                        resData = await res.json();
                      }
                      const finalSettings = { ...settings, ...resData, siteExperiences: experiencesJson };
                      setSettings(finalSettings);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('site_settings_cache', JSON.stringify(finalSettings));
                        window.dispatchEvent(new Event('site_settings_updated'));
                      }
                      showNotification('Experiences updated & published live successfully!');
                      fetchAllData();
                    } catch (err) {
                      showNotification('Failed to save experiences');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-stone-950 shadow-md hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Experiences & Live Sync
                </button>
              </div>

              {/* EXPERIENCE POPUP FORM MODAL */}
              {showExperienceModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#141210] border border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#F97316]" />
                          {editingExperienceIndex !== null ? 'Edit Experience' : 'Add New Experience'}
                        </h3>
                        <p className="text-xs text-stone-400 mt-0.5">Fill in details below to publish live to /experiences page</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowExperienceModal(false)}
                        className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveExperience} className="space-y-4 text-xs">
                      <div>
                        <label className="text-stone-300 font-bold block mb-1">Experience Title *</label>
                        <input
                          type="text"
                          required
                          value={experienceForm.title}
                          onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                          placeholder="e.g. Temple & Heritage Architecture"
                          className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-lg text-stone-100 text-xs outline-none focus:border-[#F97316]"
                        />
                      </div>

                      <div>
                        <label className="text-stone-300 font-bold block mb-1">Subtitle / Tagline</label>
                        <input
                          type="text"
                          value={experienceForm.subtitle}
                          onChange={(e) => setExperienceForm({ ...experienceForm, subtitle: e.target.value })}
                          placeholder="e.g. Soaring Dravidian Gopurams & 1000-Year UNESCO Temples"
                          className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-lg text-stone-100 text-xs outline-none focus:border-[#F97316]"
                        />
                      </div>

                      <div>
                        <ImageUploader
                          label="Experience Image URL"
                          value={experienceForm.image}
                          onChange={(val) => setExperienceForm({ ...experienceForm, image: val })}
                          recommendedSize="1200 × 800 px landscape"
                        />
                      </div>

                      <div>
                        <label className="text-stone-300 font-bold block mb-1">Description / Details</label>
                        <textarea
                          rows={4}
                          value={experienceForm.desc}
                          onChange={(e) => setExperienceForm({ ...experienceForm, desc: e.target.value })}
                          placeholder="Describe the experience highlights, activities, and local interactions..."
                          className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-lg text-stone-100 text-xs outline-none focus:border-[#F97316] resize-none"
                        />
                      </div>

                      <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-800">
                        <button
                          type="button"
                          onClick={() => setShowExperienceModal(false)}
                          className="px-4 py-2.5 rounded-xl text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-stone-950 shadow-md hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          {saving ? 'Saving...' : editingExperienceIndex !== null ? 'Update & Sync Live' : 'Add Experience & Sync Live'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DESTINATION FORM MODAL */}
      {destModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold">{editingDest ? 'Edit Destination' : 'Add Destination'}</h3>
            <form onSubmit={handleSaveDest} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={destForm.title}
                  onChange={(e) => setDestForm({ ...destForm, title: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Subtitle</label>
                <input
                  type="text"
                  required
                  value={destForm.subtitle}
                  onChange={(e) => setDestForm({ ...destForm, subtitle: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                />
              </div>
              <ImageUploader
                label="Destination Image"
                value={destForm.image}
                onChange={(val) => setDestForm({ ...destForm, image: val })}
                recommendedSize="800 × 600 px"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-400">Region</label>
                    <button
                      type="button"
                      onClick={() => setShowAddRegionInput(true)}
                      className="text-[10px] text-[#F97316] font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Add Custom
                    </button>
                  </div>

                  {!showAddRegionInput && destForm.region !== '__ADD_NEW__' ? (
                    <select
                      value={destForm.region}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setShowAddRegionInput(true);
                        } else {
                          setDestForm({ ...destForm, region: e.target.value });
                        }
                      }}
                      className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none focus:border-[#F97316]"
                    >
                      {regionsList.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="text-[#F97316] font-bold">
                        + Add New Region...
                      </option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        autoFocus
                        value={newRegionName}
                        onChange={(e) => setNewRegionName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewRegion();
                          } else if (e.key === 'Escape') {
                            setShowAddRegionInput(false);
                            if (destForm.region === '__ADD_NEW__') setDestForm({ ...destForm, region: regionsList[0] || 'Tamil Nadu' });
                          }
                        }}
                        placeholder="e.g. Tamil Nadu"
                        className="w-full bg-stone-900 border border-[#F97316] p-2 rounded text-xs text-stone-100 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewRegion()}
                        className="px-2.5 py-2 bg-[#F97316] text-stone-950 font-bold rounded text-xs shrink-0 hover:brightness-110"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddRegionInput(false);
                          if (destForm.region === '__ADD_NEW__') setDestForm({ ...destForm, region: regionsList[0] || 'Tamil Nadu' });
                        }}
                        className="px-2 py-2 bg-stone-800 text-stone-400 rounded text-xs shrink-0 hover:bg-stone-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Grid Size</label>
                  <select
                    value={destForm.size}
                    onChange={(e) => setDestForm({ ...destForm, size: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                  >
                    <option value="large">Large</option>
                    <option value="tall">Tall</option>
                    <option value="short">Short</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setDestModal(false)} className="px-4 py-2 bg-stone-800 rounded">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gold-gradient text-stone-950 font-bold rounded flex items-center gap-2">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW FORM MODAL */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold">{editingReview ? 'Edit Review' : 'Add Review'}</h3>
            <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Author Name</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.country}
                    onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Flag Code (e.g. US, DE)</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.countryFlag}
                    onChange={(e) => setReviewForm({ ...reviewForm, countryFlag: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Review Text</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded text-stone-100 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setReviewModal(false)} className="px-4 py-2 bg-stone-800 rounded">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gold-gradient text-stone-950 font-bold rounded flex items-center gap-2">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ FORM MODAL */}
      {faqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#141210] border border-stone-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#F97316]" /> {editingFaq ? 'Edit FAQ Question' : 'Add New FAQ Question'}
              </h3>
              <button onClick={() => setFaqModal(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 font-semibold mb-1">Question Category *</label>
                <input
                  type="text"
                  required
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  placeholder="e.g. Booking & Inclusions, Safari Planning, Safety & Health"
                  className="w-full bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. What is included in a You & Me private journey?"
                  className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316] font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Detailed Answer *</label>
                <textarea
                  rows={5}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide comprehensive details for guests..."
                  className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none resize-none leading-relaxed focus:border-[#F97316]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setFaqModal(false)}
                  className="px-4 py-2.5 bg-stone-800 text-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gold-gradient text-stone-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-md hover:brightness-110"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingFaq ? 'Save & Update FAQ' : 'Create FAQ Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOME ITINERARY DAY STEP MODAL */}
      {itineraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#141210] border border-stone-800 rounded-2xl shadow-2xl relative max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-800 shrink-0 bg-[#141210]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                  {itineraryForm.dayNumber || '01'}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                    {editingItineraryIndex !== null ? 'Edit Home Itinerary Day Step' : 'Add New Itinerary Day Step'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-400">Configure day details for the homepage signature explorer section</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setItineraryModalOpen(false)}
                className="text-stone-400 hover:text-stone-100 p-2 rounded-xl hover:bg-stone-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveHomeItineraryStep} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Day Index (e.g. 01, 02)</label>
                    <input
                      type="text"
                      required
                      value={itineraryForm.dayNumber}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, dayNumber: e.target.value })}
                      placeholder="01"
                      className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Days Label (e.g. Day 01, Days 02–03)</label>
                    <input
                      type="text"
                      required
                      value={itineraryForm.daysLabel}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, daysLabel: e.target.value })}
                      placeholder="Days 02–03"
                      className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Step Title</label>
                  <input
                    type="text"
                    required
                    value={itineraryForm.title}
                    onChange={(e) => setItineraryForm({ ...itineraryForm, title: e.target.value })}
                    placeholder="e.g. Sossusvlei Dunes & Deadvlei 4x4 Excursion"
                    className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316] font-serif text-sm font-bold text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Description Copy</label>
                  <textarea
                    rows={3}
                    required
                    value={itineraryForm.description}
                    onChange={(e) => setItineraryForm({ ...itineraryForm, description: e.target.value })}
                    placeholder="Describe the day's safari activities, scenery, wildlife sightings..."
                    className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Duration & Distance</label>
                    <input
                      type="text"
                      value={itineraryForm.duration}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, duration: e.target.value })}
                      placeholder="4.5 hrs · 350 km"
                      className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Meal Plan</label>
                    <input
                      type="text"
                      value={itineraryForm.mealPlan}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, mealPlan: e.target.value })}
                      placeholder="Full Board / Breakfast & Dinner"
                      className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Lodge / Accommodation Name</label>
                    <input
                      type="text"
                      value={itineraryForm.accommodation}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, accommodation: e.target.value })}
                      placeholder="Little Kulala Villa"
                      className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Lodge Subtitle / Region</label>
                    <input
                      type="text"
                      value={itineraryForm.accommodationSub}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, accommodationSub: e.target.value })}
                      placeholder="Luxury desert villa · Sossusvlei"
                      className="w-full bg-stone-900 border border-stone-700 p-3 rounded-lg text-stone-100 outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Day Step Feature Image"
                  value={itineraryForm.image}
                  onChange={(val) => setItineraryForm({ ...itineraryForm, image: val })}
                  recommendedSize="1200 × 800 px"
                />
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-stone-800 shrink-0 bg-[#141210]">
                <button
                  type="button"
                  onClick={() => setItineraryModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 text-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gold-gradient text-stone-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Day Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS NOTIFICATION POPUP MODAL */}
      {saveSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#141210] border border-orange-500/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">Saved Successfully!</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">{saveSuccessModal}</p>
            </div>
            <button
              onClick={() => setSaveSuccessModal(null)}
              className="w-full rounded-xl bg-gold-gradient py-3 text-xs font-bold text-stone-950 shadow-md hover:brightness-110 transition-all"
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
