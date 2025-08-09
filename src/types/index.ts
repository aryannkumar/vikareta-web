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
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
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

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}