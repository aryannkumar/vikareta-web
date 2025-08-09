import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  provider: {
    id: string;
    name: string;
    location: string;
  };
  category: string;
  quantity: number;
  inStock: boolean;
  selectedVariant?: {
    id: string;
    name: string;
    price: number;
  };
  customizations?: Record<string, any>;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(item => item.id === newItem.id);

        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          });
        } else {
          // Add new item
          const updatedItems = [...items, { ...newItem, quantity: 1 }];
          
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          });
        }
      },

      removeItem: (itemId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== itemId);
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0
        });
      },

      getItemQuantity: (itemId) => {
        const { items } = get();
        const item = items.find(item => item.id === itemId);
        return item?.quantity || 0;
      }
    }),
    {
      name: 'vikareta-cart',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      })
    }
  )
);