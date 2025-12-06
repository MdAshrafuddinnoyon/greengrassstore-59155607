import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye, Tag, Sparkles, Percent, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCompareStore } from "@/stores/compareStore";
import { toast } from "sonner";
import { LocalQuickViewModal } from "./LocalQuickViewModal";

export interface LocalProduct {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  category: string;
  subcategory?: string;
  images?: string[];
  featured_image?: string;
  is_featured?: boolean;
  is_on_sale?: boolean;
  is_new?: boolean;
  is_active?: boolean;
  stock_quantity?: number;
}

interface LocalProductCardProps {
  product: LocalProduct;
  isArabic?: boolean;
}

export const LocalProductCard = ({ product, isArabic = false }: LocalProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompareStore();
  
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const discountPercentage = product.compare_at_price 
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  const displayName = isArabic && product.name_ar ? product.name_ar : product.name;
  const displayImage = product.featured_image || product.images?.[0] || '/placeholder.svg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a minimal ShopifyProduct-like structure for cart compatibility
    const cartItem = {
      product: {
        node: {
          id: product.id,
          title: product.name,
          description: product.description || '',
          handle: product.slug,
          priceRange: {
            minVariantPrice: {
              amount: product.price.toString(),
              currencyCode: product.currency
            }
          },
          images: {
            edges: [{
              node: {
                url: displayImage,
                altText: product.name
              }
            }]
          },
          variants: {
            edges: [{
              node: {
                id: product.id,
                title: 'Default',
                price: {
                  amount: product.price.toString(),
                  currencyCode: product.currency
                },
                availableForSale: true,
                selectedOptions: []
              }
            }]
          },
          options: []
        }
      },
      variantId: product.id,
      variantTitle: 'Default',
      price: {
        amount: product.price.toString(),
        currencyCode: product.currency
      },
      quantity: 1,
      selectedOptions: []
    };
    
    addItem(cartItem);
    toast.success(isArabic ? 'تمت الإضافة إلى السلة' : 'Added to cart');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        title: product.name,
        price: `${product.currency} ${product.price}`,
        image: displayImage
      });
      toast.success(isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to wishlist');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCompared) {
      removeFromCompare(product.id);
      toast.success(isArabic ? 'تمت الإزالة من المقارنة' : 'Removed from compare');
    } else {
      const shopifyLikeProduct = {
        node: {
          id: product.id,
          title: product.name,
          description: product.description || '',
          handle: product.slug,
          priceRange: {
            minVariantPrice: {
              amount: product.price.toString(),
              currencyCode: product.currency
            }
          },
          images: {
            edges: [{ node: { url: displayImage, altText: product.name } }]
          },
          variants: { edges: [] },
          options: []
        }
      };
      const added = addToCompare(shopifyLikeProduct);
      if (added) {
        toast.success(isArabic ? 'تمت الإضافة للمقارنة' : 'Added to compare');
      } else {
        toast.error(isArabic ? 'قائمة المقارنة ممتلئة (4 كحد أقصى)' : 'Compare list is full (max 4)');
      }
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-background rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            src={displayImage}
            alt={displayName}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovered && "scale-110"
            )}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.is_on_sale && discountPercentage > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                <Percent className="w-3 h-3" />
                {discountPercentage}% OFF
              </span>
            )}
            {product.is_new && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                <Sparkles className="w-3 h-3" />
                {isArabic ? 'جديد' : 'NEW'}
              </span>
            )}
            {product.is_featured && !product.is_new && !product.is_on_sale && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                <Tag className="w-3 h-3" />
                {isArabic ? 'مميز' : 'FEATURED'}
              </span>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3"
          >
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              onClick={handleAddToCart}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={handleToggleWishlist}
              className={cn(
                "p-3 rounded-full shadow-lg transition-colors",
                isWishlisted 
                  ? "bg-red-500 text-white" 
                  : "bg-white hover:bg-red-500 hover:text-white"
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
            </motion.button>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              onClick={handleQuickView}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              onClick={handleToggleCompare}
              className={cn(
                "p-3 rounded-full shadow-lg transition-colors",
                isCompared 
                  ? "bg-primary text-white" 
                  : "bg-white hover:bg-primary hover:text-white"
              )}
              aria-label="Compare"
            >
              <GitCompare className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {displayName}
          </h3>
          
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {product.currency} {product.price.toFixed(2)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {product.currency} {product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <p className="mt-2 text-xs text-amber-600 font-medium">
              {isArabic ? `${product.stock_quantity} فقط متبقي` : `Only ${product.stock_quantity} left`}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
    
    <LocalQuickViewModal
      isOpen={showQuickView}
      onClose={() => setShowQuickView(false)}
      product={product}
    />
    </>
  );
};
