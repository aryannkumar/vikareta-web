export interface PaymentGateway {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  image?: string; // Keep for backward compatibility
  status: 'active' | 'inactive';
  config: Record<string, any>;
  gatewayOptions?: GatewayOption[]; // Keep for backward compatibility
  misc?: string;
}

export interface GatewayOption {
  id: string;
  option: string;
  value: string;
}

export interface Order {
  id: string;
  orderSerialNo: string;
  userId: string;
  tax: number;
  discount: number;
  subtotal: number;
  total: number;
  shippingCharge: number;
  orderType: 'delivery' | 'pickup';
  orderDatetime: string;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';
  reason?: string;
  source: 'web' | 'mobile' | 'pos';
  items: OrderItem[];
  address?: OrderAddress;
  user?: User;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  variations?: ProductVariation[];
}

export interface OrderAddress {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  value: string;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance?: number;
}

export interface PaymentRequest {
  orderId: string;
  paymentMethod?: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
  returnUrl: string;
  cancelUrl?: string;
  notifyUrl: string;
  metadata?: Record<string, any>;
  gateway?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  gatewayResponse?: any;
  redirectUrl?: string;
  transactionId?: string;
  paymentUrl?: string;
  message?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface RFQRequest {
  id?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requirements: string;
  category: string;
  quantity?: number;
  budget?: number;
  timeline: string;
  specifications?: string;
  attachments?: File[];
  status?: 'pending' | 'quoted' | 'negotiating' | 'closed' | 'rejected';
  createdAt?: string;
  responses?: RFQResponse[];
}

export interface RFQResponse {
  id: string;
  supplierId: string;
  supplierName: string;
  quotedPrice: number;
  deliveryTime: string;
  terms: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  attachments?: string[];
}

export interface WhatsAppConfig {
  apiUrl: string;
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhook_verify_token: string;
  enabled: boolean;
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'media';
  content: string | WhatsAppTemplate;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components: WhatsAppComponent[];
}

export interface WhatsAppComponent {
  type: 'header' | 'body' | 'footer' | 'button';
  parameters?: WhatsAppParameter[];
}

export interface WhatsAppParameter {
  type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
  text?: string;
  currency?: {
    fallback_value: string;
    code: string;
    amount_1000: number;
  };
  date_time?: {
    fallback_value: string;
  };
  image?: {
    link: string;
  };
  document?: {
    link: string;
    filename: string;
  };
}