import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShopifyProduct } from "@/lib/shopify";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopifyProduct | null;
}

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const { node } = product;
  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = () => {
    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success(`Added ${quantity} item(s) to cart`, {
      description: node.title,
      position: "top-center",
    });
    onClose();
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-gray-100">
            {firstImage ? (
              <img
                src={firstImage.url}
                alt={node.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-left">{node.title}</DialogTitle>
            </DialogHeader>

            <p className="text-2xl font-bold text-[#2d5a3d] mt-2">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </p>

            {node.description && (
              <p className="text-gray-600 text-sm mt-4 line-clamp-4">
                {node.description}
              </p>
            )}

            {/* Variants */}
            {node.options && node.options.length > 0 && node.options[0].name !== "Title" && (
              <div className="mt-4 space-y-3">
                {node.options.map((option) => (
                  <div key={option.name}>
                    <p className="text-sm font-medium mb-2">{option.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          className="px-3 py-1.5 text-sm border rounded-md hover:border-[#2d5a3d] hover:text-[#2d5a3d] transition-colors"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-auto pt-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#2d5a3d] hover:bg-[#234a31] text-white"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};