import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';

interface CompareStore {
  items: ShopifyProduct[];
  maxItems: number;
  isOpen: boolean;
  
  // Actions
  addItem: (product: ShopifyProduct) => boolean;
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
        if (items.some(item => item.node.id === product.node.id)) {
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
          items: get().items.filter(item => item.node.id !== productId)
        });
      },

      clearAll: () => {
        set({ items: [], isOpen: false });
      },

      isInCompare: (productId) => {
        return get().items.some(item => item.node.id === productId);
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
