// Onboarding Types
export interface OnboardingStep {
  key: string;
  label: string;
  completed: boolean;
  required: boolean;
  meta?: any;
}

export interface OnboardingFlow {
  userType: 'normal' | 'business';
  steps: OnboardingStep[];
  progress: number;
  completed: boolean;
}

export interface OnboardingStatus {
  userId: string;
  progress: number;
  steps: OnboardingStep[];
}

// Business Profile Types
export interface BusinessProfile {
  id: string;
  userId: string;
  companyName: string;
  businessType: string;
  industry: string;
  description: string;
  logo?: string;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  taxInfo?: {
    gstin?: string;
    panNumber?: string;
    taxId?: string;
    taxExempt?: boolean;
    taxExemptionReason?: string;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branchName?: string;
    swiftCode?: string;
  };
  verification?: {
    isVerified: boolean;
    verificationLevel: string;
    documents?: any[];
  };
  settings?: {
    allowPublicProfile: boolean;
    showContactInfo: boolean;
    autoAcceptOrders: boolean;
    notificationPreferences: {
      orderUpdates: boolean;
      paymentUpdates: boolean;
      reviewUpdates: boolean;
      marketingEmails: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Document Types
export interface UserDocument {
  id: string;
  userId: string;
  documentType: 'gst_certificate' | 'pan_card' | 'aadhar_card' | 'business_license' | 'address_proof' | 'bank_statement' | 'other';
  documentUrl: string;
  documentNumber?: string;
  digilockerUri?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// DigiLocker Types
export interface DigiLockerDocument {
  id: string;
  userId: string;
  docId: string;
  docType: string;
  docName: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  documentData?: any;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Onboarding Form Types
export interface BasicProfileForm {
  userType: 'buyer' | 'seller' | 'business' | 'both';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessName?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessBasicForm {
  companyName: string;
  businessType: 'sole_proprietorship' | 'partnership' | 'private_limited' | 'public_limited' | 'llp' | 'other';
  industry: string;
  description: string;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface BusinessTaxForm {
  gstin?: string;
  panNumber?: string;
  taxId?: string;
  taxExempt?: boolean;
  taxExemptionReason?: string;
}

export interface BusinessBankForm {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName?: string;
  swiftCode?: string;
}

export interface BusinessDocumentForm {
  documentType: 'gst_certificate' | 'pan_card' | 'aadhar_card' | 'business_license' | 'address_proof' | 'bank_statement' | 'other';
  documentUrl: string;
  documentNumber?: string;
  expiryDate?: string;
  digilockerUri?: string;
}

export interface BusinessSettingsForm {
  allowPublicProfile: boolean;
  showContactInfo: boolean;
  autoAcceptOrders: boolean;
  notificationPreferences: {
    orderUpdates: boolean;
    paymentUpdates: boolean;
    reviewUpdates: boolean;
    marketingEmails: boolean;
  };
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  gstin?: string;
  verificationTier: 'basic' | 'standard' | 'enhanced' | 'premium';
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLogin {
  id: string;
  userId: string;
  provider: 'google' | 'linkedin' | 'digilocker';
  providerId: string;
  accessToken: string;
  refreshToken?: string;
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  sellerId: string;
  seller: User;
  title: string;
  description: string;
  categoryId: string;
  category: Category;
  subcategoryId?: string;
  subcategory?: Category;
  price: number;
  currency: string;
  stockQuantity: number;
  minOrderQuantity: number;
  isService: boolean;
  status: 'active' | 'inactive' | 'draft';
  variants: ProductVariant[];
  media: ProductMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stockQuantity: number;
}

export interface ProductMedia {
  id: string;
  productId: string;
  mediaType: 'image' | 'video' | 'document';
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  icon?: string;
  isActive: boolean;
}

// RFQ Types
export interface RFQ {
  id: string;
  buyerId: string;
  buyer: User;
  title: string;
  description: string;
  categoryId: string;
  category: Category;
  subcategoryId?: string;
  subcategory?: Category;
  quantity: number;
  budgetMin?: number;
  budgetMax?: number;
  deliveryTimeline: string;
  deliveryLocation: string;
  status: 'active' | 'closed' | 'expired';
  expiresAt: string;
  quotes: Quote[];
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  rfqId: string;
  rfq: RFQ;
  sellerId: string;
  seller: User;
  totalPrice: number;
  deliveryTimeline: string;
  termsConditions?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  productId?: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  orderType: 'product' | 'service';
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  cashfreeOrderId?: string;
  items: OrderItem[];
  serviceAppointment?: ServiceAppointment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ServiceAppointment {
  id: string;
  orderId: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  completionNotes?: string;
  completedAt?: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  availableBalance: number;
  lockedBalance: number;
  negativeBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  transactionType: 'credit' | 'debit' | 'lock' | 'unlock';
  amount: number;
  balanceAfter: number;
  referenceType: string;
  referenceId: string;
  cashfreeTransactionId?: string;
  description: string;
  createdAt: string;
}

export interface LockedAmount {
  id: string;
  walletId: string;
  amount: number;
  lockReason: string;
  referenceId: string;
  lockedUntil: string;
  status: 'active' | 'released' | 'expired';
  createdAt: string;
}

// Deal Types
export interface Deal {
  id: string;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  rfqId?: string;
  rfq?: RFQ;
  quoteId?: string;
  quote?: Quote;
  orderId?: string;
  order?: Order;
  dealValue: number;
  status: 'initiated' | 'negotiating' | 'confirmed' | 'completed' | 'cancelled';
  milestone: string;
  nextFollowUp?: string;
  messages: DealMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DealMessage {
  id: string;
  dealId: string;
  senderId: string;
  sender: User;
  message: string;
  messageType: 'text' | 'file' | 'system';
  createdAt: string;
}

// Search Types
export interface SearchFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  radius?: number;
  verificationTier?: string[];
  isService?: boolean;
  inStock?: boolean;
  sortBy?: 'createdAt' | 'price' | 'rating' | 'title';
}

export interface SearchResult {
  products: Product[];
  sellers: User[];
  categories: Category[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  gstin?: string;
  acceptTerms: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Advertisement Types
export interface Advertisement {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  adType: 'banner' | 'native' | 'video' | 'carousel';
  adFormat: 'image' | 'video' | 'html';
  content: {
    images?: string[];
    videos?: string[];
    html?: string;
  };
  callToAction: string;
  destinationUrl: string;
  priority: number;
  status: 'active' | 'paused' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  location: string; // homepage_banner, product_sidebar, search_results
  platform: 'web' | 'mobile' | 'dashboard';
  dimensions: {
    width: number;
    height: number;
    responsive?: boolean;
  };
  maxAdsPerPage: number;
  refreshInterval?: number;
  isActive: boolean;
}

export interface AdImpression {
  id: string;
  advertisementId: string;
  placementId: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  platform: 'web' | 'mobile' | 'dashboard';
  location?: {
    country: string;
    state: string;
    city: string;
    coordinates?: [number, number];
  };
  viewDuration?: number;
  isViewable: boolean;
  cost: number;
  createdAt: string;
}

export interface AdClick {
  id: string;
  advertisementId: string;
  impressionId?: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrerUrl?: string;
  destinationUrl: string;
  cost: number;
  conversionValue?: number;
  createdAt: string;
}

export interface ExternalAd {
  id: string;
  networkName: 'adsense' | 'adstra';
  title: string;
  description?: string;
  content: {
    html?: string;
    imageUrl?: string;
    videoUrl?: string;
  };
  destinationUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  revenue?: number;
}

// Analytics Types
export interface PlatformAnalytics {
  summary: {
    totalUsers: number;
    newUsers: number;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
  };
  usersByType: Array<{
    type: string;
    count: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    itemsSold: number;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    productCount: number;
  }>;
  searchAnalytics: {
    topSearches: Array<{
      query: string;
      searchCount: number;
    }>;
    searchTrends: any[];
    totalSearches: number;
  };
  timeframe: string;
  generatedAt: string;
}

export interface UserAnalytics {
  summary: {
    totalOrders: number;
    totalSpent: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
  };
  recentActivity: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
      product?: { title: string };
      service?: { title: string };
      quantity: number;
    }>;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  spendingTrend: Array<{
    date: string;
    amount: number;
    orders: number;
  }>;
  timeframe: string;
  generatedAt: string;
}

export interface BusinessAnalytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    quantity: number;
    revenue: number;
    orders: number;
  }>;
  topServices: Array<{
    id: string;
    title: string;
    quantity: number;
    revenue: number;
    orders: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  customerAnalytics: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    repeatRate: number;
  };
  timeframe: string;
  generatedAt: string;
}

export interface ProductAnalytics {
  summary: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalViews: number;
    totalInquiries: number;
    averagePrice: number;
  };
  productsByCategory: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    views: number;
    inquiries: number;
    orders: number;
    revenue: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
  }>;
  performanceMetrics: {
    conversionRate: number;
    averageTimeToSell: number;
    returnRate: number;
  };
}

export interface ServiceAnalytics {
  summary: {
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
    totalBookings: number;
    totalRevenue: number;
    averagePrice: number;
  };
  servicesByCategory: Array<{
    category: string;
    count: number;
    bookings: number;
    revenue: number;
  }>;
  topServices: Array<{
    id: string;
    title: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  servicePerformance: {
    completionRate: number;
    averageRating: number;
    customerSatisfaction: number;
  };
}

export interface BusinessMetrics {
  summary: {
    totalBusinesses: number;
    verifiedBusinesses: number;
    activeBusinesses: number;
    totalRevenue: number;
  };
  businessesByType: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
  topBusinesses: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    rating: number;
  }>;
  businessGrowth: Array<{
    date: string;
    newBusinesses: number;
    activeBusinesses: number;
  }>;
  verificationStats: {
    verifiedPercentage: number;
    pendingVerification: number;
    rejectedVerification: number;
  };
}

export interface RFQAnalytics {
  summary: {
    totalRFQs: number;
    activeRFQs: number;
    completedRFQs: number;
    totalQuotes: number;
    averageQuotesPerRFQ: number;
  };
  rfqsByCategory: Array<{
    category: string;
    count: number;
    quotes: number;
    conversionRate: number;
  }>;
  rfqTrends: Array<{
    date: string;
    created: number;
    completed: number;
  }>;
  quoteAnalytics: {
    averageResponseTime: number;
    quoteAcceptanceRate: number;
    averageQuoteValue: number;
  };
  buyerSellerMetrics: {
    totalBuyers: number;
    totalSellers: number;
    averageRFQsPerBuyer: number;
    averageQuotesPerSeller: number;
  };
}

export interface RealTimeMetrics {
  activeUsers: number;
  recentOrders: number;
  recentEvents: Array<{
    type: string;
    userId: string;
    data: any;
    timestamp: string;
  }>;
  timestamp: string;
}

// Stats Types
export interface PlatformStats {
  successfulDeals: number;
  totalCategories: number;
  totalProducts: number;
  totalSuppliers: number;
  totalBuyers?: number;
  totalServices?: number;
  totalRFQs?: number;
  totalOrders?: number;
  totalRevenue?: number;
  activeUsers?: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  productCount: number;
  serviceCount: number;
  rfqCount: number;
  orderCount: number;
  revenue: number;
  growth: number;
}

export interface MarketplaceStats {
  overview: {
    totalValue: number;
    totalTransactions: number;
    activeUsers: number;
    growthRate: number;
  };
  categories: CategoryStats[];
  trends: {
    daily: Array<{ date: string; value: number; transactions: number }>;
    weekly: Array<{ week: string; value: number; transactions: number }>;
    monthly: Array<{ month: string; value: number; transactions: number }>;
  };
  topPerformers: {
    categories: Array<{ name: string; revenue: number; growth: number }>;
    products: Array<{ name: string; sales: number; revenue: number }>;
    services: Array<{ name: string; bookings: number; revenue: number }>;
  };
}

export interface DashboardStats {
  platform: PlatformStats;
  marketplace: MarketplaceStats;
  recentActivity: Array<{
    type: 'order' | 'rfq' | 'user' | 'product';
    description: string;
    amount?: number;
    timestamp: string;
  }>;
  alerts: Array<{
    type: 'warning' | 'info' | 'success';
    message: string;
    timestamp: string;
  }>;
}