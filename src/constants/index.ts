// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    SOCIAL_GOOGLE: '/auth/social/google',
    SOCIAL_LINKEDIN: '/auth/social/linkedin',
    SOCIAL_DIGILOCKER: '/auth/social/digilocker',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    DOCUMENTS: '/users/documents',
    KYC_VERIFY: '/users/kyc/verify',
    DIGILOCKER_SYNC: '/users/documents/digilocker/sync',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    NEARBY: '/products/nearby',
    MEDIA: (id: string) => `/products/${id}/media`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    PRODUCTS: (id: string) => `/categories/${id}/products`,
  },
  
  // RFQ
  RFQS: {
    LIST: '/rfqs',
    CREATE: '/rfqs',
    DETAIL: (id: string) => `/rfqs/${id}`,
    QUOTES: (id: string) => `/rfqs/${id}/quotes`,
    SEND_TO_SELLERS: (id: string) => `/rfqs/${id}/send-to-sellers`,
  },
  
  // Quotes
  QUOTES: {
    CREATE: '/quotes',
    DETAIL: (id: string) => `/quotes/${id}`,
    ACCEPT: (id: string) => `/quotes/${id}/accept`,
    NEGOTIATE: (id: string) => `/quotes/${id}/negotiate`,
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
    APPLY_COUPON: '/cart/coupons/apply',
    REMOVE_COUPON: (code: string) => `/cart/coupons/${code}`,
    SYNC: '/cart/sync',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    RETURN: (id: string) => `/orders/${id}/return`,
  },
  
  // Wallet
  WALLET: {
    BALANCE: '/wallet/balance',
    ADD_MONEY: '/wallet/add-money',
    WITHDRAW: '/wallet/withdraw',
    TRANSACTIONS: '/wallet/transactions',
    LOCK_AMOUNT: '/wallet/lock-amount',
    RELEASE_LOCK: '/wallet/release-lock',
  },
  
  // Payments
  PAYMENTS: {
    CREATE_ORDER: '/payments/cashfree/create-order',
    VERIFY: '/payments/cashfree/verify',
    REFUND: '/payments/refund',
  },
  
  // Deals
  DEALS: {
    LIST: '/deals',
    DETAIL: (id: string) => `/deals/${id}`,
    MESSAGES: (id: string) => `/deals/${id}/messages`,
    FOLLOW_UP: (id: string) => `/deals/${id}/follow-up`,
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Vikareta',
  DESCRIPTION: 'B2B Marketplace for Indian Businesses',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@vikareta.com',
  SUPPORT_PHONE: '+91-1234567890',
} as const;

// Verification Tiers
export const VERIFICATION_TIERS = {
  BASIC: 'basic',
  STANDARD: 'standard',
  ENHANCED: 'enhanced',
  PREMIUM: 'premium',
} as const;

export const VERIFICATION_TIER_LABELS = {
  [VERIFICATION_TIERS.BASIC]: 'Basic',
  [VERIFICATION_TIERS.STANDARD]: 'Standard',
  [VERIFICATION_TIERS.ENHANCED]: 'Enhanced',
  [VERIFICATION_TIERS.PREMIUM]: 'Premium',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
} as const;

// Deal Status
export const DEAL_STATUS = {
  INITIATED: 'initiated',
  NEGOTIATING: 'negotiating',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const DEAL_STATUS_LABELS = {
  [DEAL_STATUS.INITIATED]: 'Initiated',
  [DEAL_STATUS.NEGOTIATING]: 'Negotiating',
  [DEAL_STATUS.CONFIRMED]: 'Confirmed',
  [DEAL_STATUS.COMPLETED]: 'Completed',
  [DEAL_STATUS.CANCELLED]: 'Cancelled',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Search
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RECENT_SEARCHES: 10,
} as const;

// Location
export const LOCATION = {
  DEFAULT_RADIUS: 50, // km
  MAX_RADIUS: 500, // km
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Social Login Providers
export const SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  DIGILOCKER: 'digilocker',
} as const;

// Currency
export const CURRENCY = {
  INR: 'INR',
  SYMBOL: '₹',
} as const;

// GST Rates
export const GST_RATES = {
  STANDARD: 0.18, // 18%
  REDUCED: 0.05,  // 5%
  ZERO: 0,        // 0%
} as const;

// Shipping
export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 500, // ₹500
  STANDARD_SHIPPING_COST: 50,   // ₹50
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  THEME: 'theme',
  RECENT_SEARCHES: 'recent_searches',
  USER_LOCATION: 'user_location',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ITEM_ADDED_TO_CART: 'Item added to cart!',
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
} as const;

// Marketplace Configuration
export const MARKETPLACE_CONFIG = {
  COMMISSION_RATE: Number(process.env.NEXT_PUBLIC_MARKETPLACE_COMMISSION_RATE || '5'),
  MIN_ORDER_VALUE: Number(process.env.NEXT_PUBLIC_MIN_ORDER_VALUE || '100'),
  FREE_SHIPPING_THRESHOLD: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '500'),
  DEFAULT_SHIPPING_COST: Number(process.env.NEXT_PUBLIC_DEFAULT_SHIPPING_COST || '50'),
  GST_RATE: Number(process.env.NEXT_PUBLIC_GST_RATE || '18'),
  SUPPORTED_LANGUAGES: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'en-IN,hi-IN').split(','),
  DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en-IN',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_PUSH_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  ENABLE_VOICE_SEARCH: process.env.NEXT_PUBLIC_ENABLE_VOICE_SEARCH === 'true',
  ENABLE_IMAGE_SEARCH: process.env.NEXT_PUBLIC_ENABLE_IMAGE_SEARCH === 'true',
  ENABLE_WHATSAPP_INTEGRATION: process.env.NEXT_PUBLIC_ENABLE_WHATSAPP_INTEGRATION === 'true',
  ENABLE_SOCIAL_SHARING: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_SHARING === 'true',
} as const;

// Navigation
export const NAVIGATION = {
  MAIN: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'RFQ', href: '/rfq' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  USER: [
    { name: 'Dashboard', href: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001/dashboard' 
        : 'https://dashboard.vikareta.com/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Orders', href: '/orders' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Settings', href: '/settings' },
  ],
  FOOTER: [
    { name: 'About Us', href: '/about' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ],
} as const;