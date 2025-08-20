import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistApi, type WishlistItem } from '@/lib/api/wishlist';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  
  // Getters
  count: number;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (itemId: string, type: 'product' | 'service' | 'business') => Promise<boolean>;
  removeFromWishlist: (wishlistId: string) => Promise<boolean>;
  removeItemFromWishlist: (type: 'product' | 'service' | 'business', itemId: string) => Promise<boolean>;
  checkWishlist: (type: 'product' | 'service' | 'business', itemId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  isInWishlist: (type: 'product' | 'service' | 'business', itemId: string) => boolean;
  clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      
      // Computed getter for count
      get count() {
        return get().items.length;
      },

      fetchWishlist: async () => {
        set({ loading: true, error: null });
        try {
          const response = await wishlistApi.getWishlist();
          if (response.success) {
            set({ items: response.data || [], loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch wishlist', loading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch wishlist', 
            loading: false 
          });
        }
      },

      addToWishlist: async (itemId: string, type: 'product' | 'service' | 'business') => {
        try {
          const response = await wishlistApi.addToWishlist({ itemId, type });
          if (response.success) {
            // Refresh wishlist to get updated data
            await get().fetchWishlist();
            return true;
          } else {
            // Handle specific error cases
            if (response.error?.includes('403') || response.error?.includes('Forbidden') || response.error?.includes('Access denied')) {
              set({ error: 'Authentication required. Please login again.' });
            } else {
              set({ error: response.error || 'Failed to add to wishlist' });
            }
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add to wishlist';
          // Handle authentication errors specifically
          if (errorMessage.includes('403') || errorMessage.includes('Forbidden') || errorMessage.includes('Access denied')) {
            set({ error: 'Authentication required. Please login again.' });
          } else {
            set({ error: errorMessage });
          }
          return false;
        }
      },

      removeFromWishlist: async (wishlistId: string) => {
        try {
          const response = await wishlistApi.removeFromWishlist(wishlistId);
          if (response.success) {
            // Remove from local state immediately for better UX
            set(state => ({
              items: state.items.filter(item => item.id !== wishlistId)
            }));
            return true;
          } else {
            set({ error: response.error || 'Failed to remove from wishlist' });
            return false;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove from wishlist' });
          return false;
        }
      },

      removeItemFromWishlist: async (type: 'product' | 'service' | 'business', itemId: string) => {
        try {
          const response = await wishlistApi.removeItemFromWishlist(type, itemId);
          if (response.success) {
            // Remove from local state immediately for better UX
            set(state => ({
              items: state.items.filter(item => !(item.type === type && item.itemId === itemId))
            }));
            return true;
          } else {
            set({ error: response.error || 'Failed to remove from wishlist' });
            return false;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove from wishlist' });
          return false;
        }
      },

      checkWishlist: async (type: 'product' | 'service' | 'business', itemId: string) => {
        try {
          const response = await wishlistApi.checkWishlist(type, itemId);
          if (response.success) {
            return response.data.inWishlist;
          }
          return false;
        } catch (error) {
          console.error('Error checking wishlist:', error);
          return false;
        }
      },

      clearWishlist: async () => {
        try {
          const response = await wishlistApi.clearWishlist();
          if (response.success) {
            set({ items: [] });
            return true;
          } else {
            set({ error: response.error || 'Failed to clear wishlist' });
            return false;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to clear wishlist' });
          return false;
        }
      },

      isInWishlist: (type: 'product' | 'service' | 'business', itemId: string) => {
        const { items } = get();
        return items.some(item => item.type === type && item.itemId === itemId);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);