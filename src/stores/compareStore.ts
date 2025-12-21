import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
<<<<<<< HEAD
import { ShopifyProduct } from '@/lib/shopify';

interface CompareStore {
  items: ShopifyProduct[];
=======
import { LocalProduct } from '@/components/products/LocalProductCard';

interface CompareStore {
  items: LocalProduct[];
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  maxItems: number;
  isOpen: boolean;
  
  // Actions
<<<<<<< HEAD
  addItem: (product: ShopifyProduct) => boolean;
=======
  addItem: (product: LocalProduct) => boolean;
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
  toggleCompareDrawer: (open?: boolean) => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,
      isOpen: false,

      addItem: (product) => {
        const { items, maxItems } = get();
        
        // Check if already in compare
<<<<<<< HEAD
        if (items.some(item => item.node.id === product.node.id)) {
=======
        if (items.some(item => item.id === product.id)) {
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
          return false;
        }
        
        // Check max limit
        if (items.length >= maxItems) {
          return false;
        }
        
        set({ items: [...items, product] });
        return true;
      },

      removeItem: (productId) => {
        set({
<<<<<<< HEAD
          items: get().items.filter(item => item.node.id !== productId)
=======
          items: get().items.filter(item => item.id !== productId)
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        });
      },

      clearAll: () => {
        set({ items: [], isOpen: false });
      },

      isInCompare: (productId) => {
<<<<<<< HEAD
        return get().items.some(item => item.node.id === productId);
=======
        return get().items.some(item => item.id === productId);
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      },

      toggleCompareDrawer: (open) => {
        set({ isOpen: open ?? !get().isOpen });
      },
    }),
    {
      name: 'product-compare',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
