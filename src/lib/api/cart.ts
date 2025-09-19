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
    throw new Error('Cart summary endpoint not available');
  },

  // Check item availability
  async checkAvailability(productId: string, quantity: number, variantId?: string): Promise<{
    available: boolean;
    maxQuantity: number;
    estimatedDelivery: string;
  }> {
    throw new Error('Availability check endpoint not available');
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
    throw new Error('Coupon endpoint not available');
  },

  // Remove coupon from cart
  async removeCoupon(): Promise<void> {
    throw new Error('Coupon endpoint not available');
  },

  // Bulk update cart items
  async bulkUpdate(updates: Array<{
    itemId: string;
    quantity: number;
  }>): Promise<Cart> {
    throw new Error('Bulk update endpoint not available');
  },

  // Move item to wishlist
  async moveToWishlist(itemId: string): Promise<void> {
    throw new Error('Move to wishlist endpoint not available');
  },

  // Get cart recommendations
  async getRecommendations(): Promise<Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    reason: string;
  }>> {
    throw new Error('Recommendations endpoint not available');
  }
};