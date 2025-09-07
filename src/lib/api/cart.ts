import { apiClient } from './client';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: Record<string, any>;
  available: boolean;
  maxQuantity?: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
  specifications?: Record<string, any>;
}

export interface UpdateCartItemData {
  quantity: number;
  specifications?: Record<string, any>;
}

export const cartApi = {
  // Get user's cart
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>('/cart');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch cart');
    }
    return response.data;
  },

  // Add item to cart
  async addItem(data: AddToCartData): Promise<CartItem> {
    const response = await apiClient.post<CartItem>('/cart/items', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add item to cart');
    }
    return response.data;
  },

  // Update cart item
  async updateItem(itemId: string, data: UpdateCartItemData): Promise<CartItem> {
    const response = await apiClient.put<CartItem>(`/cart/items/${itemId}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update cart item');
    }
    return response.data;
  },

  // Remove item from cart
  async removeItem(itemId: string): Promise<void> {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove item from cart');
    }
  },

  // Clear cart
  async clearCart(): Promise<void> {
    const response = await apiClient.delete('/cart');
    if (!response.success) {
      throw new Error(response.error || 'Failed to clear cart');
    }
  },

  // Get cart summary
  async getCartSummary(): Promise<{
    itemCount: number;
    subtotal: number;
    total: number;
  }> {
    const response = await apiClient.get<{
      itemCount: number;
      subtotal: number;
      total: number;
    }>('/cart/summary');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch cart summary');
    }
    return response.data;
  },

  // Check item availability
  async checkAvailability(productId: string, quantity: number, variantId?: string): Promise<{
    available: boolean;
    maxQuantity: number;
    estimatedDelivery: string;
  }> {
    const response = await apiClient.get<{
      available: boolean;
      maxQuantity: number;
      estimatedDelivery: string;
    }>('/cart/availability', {
      productId,
      quantity,
      variantId
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to check availability');
    }
    return response.data;
  },

  // Apply coupon to cart
  async applyCoupon(code: string): Promise<{
    discount: number;
    total: number;
    coupon: {
      id: string;
      code: string;
      discountType: string;
      discountValue: number;
    };
  }> {
    const response = await apiClient.post<{
      discount: number;
      total: number;
      coupon: {
        id: string;
        code: string;
        discountType: string;
        discountValue: number;
      };
    }>('/cart/coupon', { code });
    if (!response.success) {
      throw new Error(response.error || 'Failed to apply coupon');
    }
    return response.data;
  },

  // Remove coupon from cart
  async removeCoupon(): Promise<void> {
    const response = await apiClient.delete('/cart/coupon');
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove coupon');
    }
  },

  // Bulk update cart items
  async bulkUpdate(updates: Array<{
    itemId: string;
    quantity: number;
  }>): Promise<Cart> {
    const response = await apiClient.put<Cart>('/cart/bulk', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update cart items');
    }
    return response.data;
  },

  // Move item to wishlist
  async moveToWishlist(itemId: string): Promise<void> {
    const response = await apiClient.post(`/cart/items/${itemId}/wishlist`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to move item to wishlist');
    }
  },

  // Get cart recommendations
  async getRecommendations(): Promise<Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    reason: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      image: string;
      price: number;
      reason: string;
    }>>('/cart/recommendations');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch recommendations');
    }
    return response.data;
  }
};