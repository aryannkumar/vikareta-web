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

export class ShippingService {
  // Get all shipping providers
  static async getProviders(): Promise<ShippingProvider[]> {
    const response = await apiClient.get('/shipping/providers');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch shipping providers');
    }
    return response.data as ShippingProvider[];
  }

  // Calculate shipping cost
  static async calculateShipping(request: ShippingCalculationRequest): Promise<{
    rates: ShippingRate[];
    recommended?: ShippingRate;
  }> {
    const response = await apiClient.post('/shipping/calculate', request);
    if (!response.success) {
      throw new Error(response.error || 'Failed to calculate shipping');
    }
    return response.data as {
      rates: ShippingRate[];
      recommended?: ShippingRate;
    };
  }

  // Create a shipment
  static async createShipment(shipmentData: CreateShipmentData): Promise<Shipment> {
    const response = await apiClient.post('/shipping/create-shipment', shipmentData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create shipment');
    }
    return response.data as Shipment;
  }

  // Track a shipment
  static async trackShipment(trackingNumber: string): Promise<{
    shipment: Shipment;
    events: ShipmentEvent[];
  }> {
    const response = await apiClient.get(`/shipping/track/${trackingNumber}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to track shipment');
    }
    return response.data as {
      shipment: Shipment;
      events: ShipmentEvent[];
    };
  }

  // Get shipping addresses
  static async getAddresses(): Promise<ShippingAddress[]> {
    const response = await apiClient.get('/shipping/addresses');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch shipping addresses');
    }
    return response.data as ShippingAddress[];
  }

  // Create shipping address
  static async createAddress(addressData: CreateShippingAddressData): Promise<ShippingAddress> {
    const response = await apiClient.post('/shipping/addresses', addressData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create shipping address');
    }
    return response.data as ShippingAddress;
  }

  // Update shipping address
  static async updateAddress(id: string, addressData: UpdateShippingAddressData): Promise<ShippingAddress> {
    const response = await apiClient.patch(`/shipping/addresses/${id}`, addressData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update shipping address');
    }
    return response.data as ShippingAddress;
  }

  // Delete shipping address
  static async deleteAddress(id: string): Promise<void> {
    const response = await apiClient.delete(`/shipping/addresses/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete shipping address');
    }
  }

  // Set default shipping address
  static async setDefaultAddress(id: string): Promise<void> {
    const response = await apiClient.post(`/shipping/addresses/${id}/default`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set default address');
    }
  }

  // Get shipment by ID
  static async getShipment(id: string): Promise<Shipment> {
    const response = await apiClient.get(`/shipping/shipments/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch shipment');
    }
    return response.data as Shipment;
  }

  // Get shipments for user/order
  static async getShipments(filters?: {
    orderId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    shipments: Shipment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/shipping/shipments', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch shipments');
    }
    return response.data as {
      shipments: Shipment[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Add tracking event (for providers/webhooks)
  static async addTrackingEvent(eventData: {
    shipmentId: string;
    status: string;
    description: string;
    location?: string;
    timestamp?: string;
  }): Promise<ShipmentEvent> {
    const response = await apiClient.post('/shipping/tracking/events', eventData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add tracking event');
    }
    return response.data as ShipmentEvent;
  }

  // Get tracking events
  static async getTrackingEvents(shipmentId?: string): Promise<ShipmentEvent[]> {
    const response = await apiClient.get('/shipping/tracking/events', shipmentId ? { shipmentId } : undefined);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch tracking events');
    }
    return response.data as ShipmentEvent[];
  }

  // Test shipping webhook (for development/testing)
  static async testShippingWebhook(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post('/shipping/webhooks/test');
    if (!response.success) {
      throw new Error(response.error || 'Failed to test shipping webhook');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Get shipping rates for cart/order
  static async getShippingRates(orderData: {
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
  }): Promise<ShippingRate[]> {
    const response = await apiClient.post('/shipping/rates', orderData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get shipping rates');
    }
    return response.data as ShippingRate[];
  }

  // Validate shipping address
  static async validateAddress(address: CreateShippingAddressData): Promise<{
    valid: boolean;
    suggestions?: ShippingAddress[];
    errors?: string[];
  }> {
    const response = await apiClient.post('/shipping/validate-address', address);
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate address');
    }
    return response.data as {
      valid: boolean;
      suggestions?: ShippingAddress[];
      errors?: string[];
    };
  }
}