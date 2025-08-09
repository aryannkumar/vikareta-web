import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
  .min(10, 'Phone number must be 10 digits')
  .max(10, 'Phone number must be 10 digits');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const gstinSchema = z
  .string()
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GSTIN')
  .optional();

export const pincodeSchema = z
  .string()
  .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  businessName: z.string().max(100, 'Business name is too long').optional(),
  gstin: gstinSchema,
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Profile schemas
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  phone: phoneSchema.optional(),
  businessName: z.string().max(100, 'Business name is too long').optional(),
  gstin: gstinSchema,
});

// Address schema
export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  phone: phoneSchema,
  addressLine1: z.string().min(1, 'Address line 1 is required').max(200, 'Address is too long'),
  addressLine2: z.string().max(200, 'Address is too long').optional(),
  city: z.string().min(1, 'City is required').max(50, 'City name is too long'),
  state: z.string().min(1, 'State is required').max(50, 'State name is too long'),
  pincode: pincodeSchema,
  landmark: z.string().max(100, 'Landmark is too long').optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters').max(100, 'Search query is too long'),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0, 'Minimum price cannot be negative').optional(),
  maxPrice: z.number().min(0, 'Maximum price cannot be negative').optional(),
  location: z.string().max(100, 'Location is too long').optional(),
  radius: z.number().min(1, 'Radius must be at least 1 km').max(100, 'Radius cannot exceed 100 km').optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'rating']).optional(),
}).refine(data => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: 'Minimum price cannot be greater than maximum price',
  path: ['maxPrice'],
});

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid('Invalid variant ID').optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000, 'Quantity is too large'),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000, 'Quantity is too large'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(20, 'Coupon code is too long'),
});

// Checkout schema
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(['wallet', 'cashfree', 'cod']),
  couponCode: z.string().max(20, 'Coupon code is too long').optional(),
  useSameAsBilling: z.boolean().optional(),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review is too long'),
  orderId: z.string().uuid('Invalid order ID').optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

// Utility functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

export const validateGSTIN = (gstin: string): boolean => {
  return gstinSchema.safeParse(gstin).success;
};

export const validatePincode = (pincode: string): boolean => {
  return pincodeSchema.safeParse(pincode).success;
};

// Form validation helper
export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  return errors?.[fieldName]?.message;
};

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type AddToCartFormData = z.infer<typeof addToCartSchema>;
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>;
export type ApplyCouponFormData = z.infer<typeof applyCouponSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;