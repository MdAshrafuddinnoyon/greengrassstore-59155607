import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  badge?: string;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isHovered && product.hoverImage ? "opacity-0" : "opacity-100"
          )}
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={product.name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-700",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              নতুন
            </span>
          )}
          {product.isSale && discount > 0 && (
            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            isWishlisted
              ? "bg-destructive text-destructive-foreground"
              : "bg-card/80 backdrop-blur-sm hover:bg-card"
          )}
        >
          <Heart
            className={cn("w-5 h-5", isWishlisted && "fill-current")}
          />
        </button>

        {/* Quick Actions */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-background text-foreground font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">কার্টে যোগ করুন</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-primary">
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                "w-4 h-4",
                i < Math.floor(product.rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted stroke-current"
              )}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating})
          </span>
        </div>
      </div>
    </motion.div>
  );
};
