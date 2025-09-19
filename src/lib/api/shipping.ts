import { apiClient } from './client';

export interface ShippingProvider {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  services: ShippingService[];
  settings: Record<string, any>;
}

export interface ShippingService {
  id: string;
  name: string;
  code: string;
  description?: string;
  estimatedDelivery: string;
  cost: number;
  isActive: boolean;
}

export interface ShippingAddress {
  id: string;
  userId: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingCalculationRequest {
  origin: {
    postalCode: string;
    country: string;
  };
  destination: {
    postalCode: string;
    country: string;
  };
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  items: Array<{
    weight: number;
    quantity: number;
    value?: number;
  }>;
}

export interface ShippingRate {
  provider: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDelivery: string;
  trackingAvailable: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  provider: string;
  service: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  cost: number;
  weight: number;
  origin: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  destination: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  events: ShipmentEvent[];
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface ShipmentEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface CreateShipmentData {
  orderId: string;
  provider: string;
  service: string;
  originAddress: ShippingAddress;
  destinationAddress: ShippingAddress;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  items: Array<{
    name: string;
    weight: number;
    quantity: number;
    value?: number;
  }>;
}

export interface CreateShippingAddressData {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UpdateShippingAddressData {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export const shippingApi = {
  // Get all shipping providers
  async getProviders() {
    return apiClient.get<ShippingProvider[]>('/shipping/providers');
  },

  // Calculate shipping cost
  async calculateShipping(request: ShippingCalculationRequest) {
    return apiClient.post<{
      rates: ShippingRate[];
      recommended?: ShippingRate;
    }>('/shipping/calculate', request);
  },

  // Create a shipment
  async createShipment(shipmentData: CreateShipmentData) {
    return apiClient.post<Shipment>('/shipping/create-shipment', shipmentData);
  },

  // Track a shipment
  async trackShipment(trackingNumber: string) {
    return apiClient.get<{
      shipment: Shipment;
      events: ShipmentEvent[];
    }>(`/shipping/track/${trackingNumber}`);
  },

  // Get shipping addresses
  async getAddresses() {
    return apiClient.get<ShippingAddress[]>('/shipping/addresses');
  },

  // Create shipping address
  async createAddress(addressData: CreateShippingAddressData) {
    return apiClient.post<ShippingAddress>('/shipping/addresses', addressData);
  },

  // Update shipping address
  async updateAddress(id: string, addressData: UpdateShippingAddressData) {
    return apiClient.patch<ShippingAddress>(`/shipping/addresses/${id}`, addressData);
  },

  // Delete shipping address
  async deleteAddress(id: string) {
    return apiClient.delete(`/shipping/addresses/${id}`);
  },

  // Set default shipping address
  async setDefaultAddress(id: string) {
    return apiClient.post(`/shipping/addresses/${id}/default`);
  },

  // Get shipment by ID
  async getShipment(id: string) {
    throw new Error('Get shipment endpoint not available');
  },

  // Get shipments for user/order
  async getShipments(filters?: {
    orderId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    throw new Error('Get shipments endpoint not available');
  },

  // Add tracking event (for providers/webhooks)
  async addTrackingEvent(eventData: {
    shipmentId: string;
    status: string;
    description: string;
    location?: string;
    timestamp?: string;
  }) {
    throw new Error('Add tracking event endpoint not available');
  },

  // Get tracking events
  async getTrackingEvents(shipmentId?: string) {
    throw new Error('Get tracking events endpoint not available');
  },

  // Test shipping webhook (for development/testing)
  async testShippingWebhook() {
    throw new Error('Test shipping webhook endpoint not available');
  },

  // Get shipping rates for cart/order
  async getShippingRates(orderData: {
    items: Array<{
      weight: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
      };
      quantity: number;
    }>;
    destinationAddress: ShippingAddress;
  }) {
    throw new Error('Get shipping rates endpoint not available');
  },

  // Validate shipping address
  async validateAddress(address: CreateShippingAddressData) {
    throw new Error('Validate address endpoint not available');
  }
};