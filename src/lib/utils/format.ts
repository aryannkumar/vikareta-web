// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatting
export const formatNumber = (
  number: number,
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale).format(number);
};

// Date formatting
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'en-IN'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

export const formatDateTime = (
  date: string | Date,
  locale: string = 'en-IN'
): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }, locale);
};

export const formatTime = (
  date: string | Date,
  locale: string = 'en-IN'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Relative time formatting
export const formatRelativeTime = (
  date: string | Date,
  locale: string = 'en'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX for Indian numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  // Format as +91 XXXXX XXXXX if it starts with 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Text formatting
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// URL formatting
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Address formatting
export const formatAddress = (address: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}): string => {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Distance formatting
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  total: number,
  decimals: number = 1
): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

// Order status formatting
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  };
  
  return statusMap[status] || capitalizeFirst(status);
};

// Payment status formatting
export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    success: 'Success',
    failed: 'Failed',
    refunded: 'Refunded',
  };
  
  return statusMap[status] || capitalizeFirst(status);
};

// Verification tier formatting
export const formatVerificationTier = (tier: string): string => {
  const tierMap: Record<string, string> = {
    basic: 'Basic',
    standard: 'Standard',
    enhanced: 'Enhanced',
    premium: 'Premium',
  };
  
  return tierMap[tier] || capitalizeFirst(tier);
};

// Rating formatting
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)} ⭐`;
};

// Quantity formatting
export const formatQuantity = (quantity: number, unit?: string): string => {
  const formattedQuantity = formatNumber(quantity);
  return unit ? `${formattedQuantity} ${unit}` : formattedQuantity;
};

// GST formatting
export const formatGSTIN = (gstin: string): string => {
  if (gstin.length !== 15) return gstin;
  
  return `${gstin.slice(0, 2)} ${gstin.slice(2, 7)} ${gstin.slice(7, 11)} ${gstin.slice(11, 12)} ${gstin.slice(12, 13)} ${gstin.slice(13, 14)} ${gstin.slice(14)}`;
};