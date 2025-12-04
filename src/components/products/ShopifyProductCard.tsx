import { useState } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { ShoppingBag, Heart, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { QuickViewModal } from "./QuickViewModal";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  compact?: boolean;
}

export const ShopifyProductCard = ({ product, compact = false }: ShopifyProductCardProps) => {
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

  // Compact Mobile Card
  if (compact) {
    return (
      <Link to={`/product/${node.handle}`} className="group block">
        <div className="relative aspect-square overflow-hidden bg-muted rounded-xl mb-2">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          
          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1">
          {node.title}
        </h3>
        <p className="text-sm font-bold text-primary">
          {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
        </p>
      </Link>
    );
  }

  return (
    <>
      <Link 
        to={`/product/${node.handle}`} 
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted rounded-xl mb-3">
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
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
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
              "absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-medium hover:bg-foreground/90 transition-colors rounded-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button 
              onClick={handleQuickView}
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors rounded-lg shadow-md"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {node.title}
          </h3>
          <p className="text-base font-bold text-foreground mt-1">
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