import { useState } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { QuickViewModal } from "./QuickViewModal";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  
  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const secondImage = node.images.edges[1]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-center",
    });
  };

  return (
    <>
      <Link 
        to={`/product/${node.handle}`} 
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] mb-3">
          {firstImage ? (
            <>
              <img
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isHovered && secondImage ? "opacity-0" : "opacity-100"
                )}
              />
              {secondImage && (
                <img
                  src={secondImage.url}
                  alt={secondImage.altText || node.title}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>

          {/* Quick Actions */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-2 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-900 text-white text-[10px] uppercase tracking-wider font-medium hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-3 h-3" />
              Add to Cart
            </button>
            <button 
              onClick={handleQuickView}
              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#2d5a3d] transition-colors line-clamp-1">
            {node.title}
          </h3>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
        product={product}
      />
    </>
  );
};