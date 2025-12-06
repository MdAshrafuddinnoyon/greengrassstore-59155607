import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Leaf, Flower2, Package, Shrub, Sparkles, Gift, Tag, Loader2,
  TreeDeciduous, Palmtree, Cherry, TreePine, Scissors, Droplets,
  Home, Lamp, Frame, Sofa, Brush, Palette, Box, ShoppingBag,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Extended icon mapping - matches category names dynamically
const getIconForCategory = (handle: string, title: string): typeof Leaf => {
  const lowerHandle = handle.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  // Plants & Trees
  if (lowerHandle.includes("plant") || lowerTitle.includes("plant")) return Leaf;
  if (lowerHandle.includes("tree") || lowerTitle.includes("tree")) return TreeDeciduous;
  if (lowerHandle.includes("palm") || lowerTitle.includes("palm")) return Palmtree;
  if (lowerHandle.includes("ficus") || lowerTitle.includes("ficus")) return TreePine;
  if (lowerHandle.includes("olive") || lowerTitle.includes("olive")) return Cherry;
  if (lowerHandle.includes("bamboo") || lowerTitle.includes("bamboo")) return TreePine;
  
  // Flowers
  if (lowerHandle.includes("flower") || lowerTitle.includes("flower")) return Flower2;
  if (lowerHandle.includes("bouquet") || lowerTitle.includes("bouquet")) return Flower2;
  if (lowerHandle.includes("rose") || lowerTitle.includes("rose")) return Cherry;
  
  // Pots & Planters
  if (lowerHandle.includes("pot") || lowerTitle.includes("pot")) return Package;
  if (lowerHandle.includes("planter") || lowerTitle.includes("planter")) return Box;
  if (lowerHandle.includes("ceramic") || lowerTitle.includes("ceramic")) return Package;
  if (lowerHandle.includes("fiber") || lowerTitle.includes("fiber")) return Package;
  
  // Greenery
  if (lowerHandle.includes("green") || lowerTitle.includes("green")) return Shrub;
  if (lowerHandle.includes("moss") || lowerTitle.includes("moss")) return Shrub;
  if (lowerHandle.includes("grass") || lowerTitle.includes("grass")) return Shrub;
  if (lowerHandle.includes("wall") || lowerTitle.includes("wall")) return Frame;
  
  // Vases & Decor
  if (lowerHandle.includes("vase") || lowerTitle.includes("vase")) return Sparkles;
  if (lowerHandle.includes("decor") || lowerTitle.includes("decor")) return Lamp;
  if (lowerHandle.includes("home") || lowerTitle.includes("home")) return Home;
  
  // Gifts
  if (lowerHandle.includes("gift") || lowerTitle.includes("gift")) return Gift;
  
  // Sale & Offers
  if (lowerHandle.includes("sale") || lowerTitle.includes("sale")) return Tag;
  if (lowerHandle.includes("offer") || lowerTitle.includes("offer")) return Tag;
  if (lowerHandle.includes("discount") || lowerTitle.includes("discount")) return Tag;
  
  // Hanging
  if (lowerHandle.includes("hang") || lowerTitle.includes("hang")) return Droplets;
  
  // Care & Accessories
  if (lowerHandle.includes("care") || lowerTitle.includes("care")) return Scissors;
  if (lowerHandle.includes("tool") || lowerTitle.includes("tool")) return Brush;
  if (lowerHandle.includes("accessory") || lowerTitle.includes("accessory")) return Palette;
  
  // Furniture
  if (lowerHandle.includes("furniture") || lowerTitle.includes("furniture")) return Sofa;
  
  // New & Featured
  if (lowerHandle.includes("new") || lowerTitle.includes("new")) return Sparkles;
  if (lowerHandle.includes("featured") || lowerTitle.includes("featured")) return Sparkles;
  if (lowerHandle.includes("best") || lowerTitle.includes("best")) return ShoppingBag;
  
  // Default
  return Leaf;
};

export const CategoriesGrid = () => {
  const { t } = useLanguage();
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      dragFree: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(20); // Fetch more for future categories
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  // Map collections to display data with dynamic icons
  const categories = collections.map((collection) => {
    const handle = collection.node.handle.toLowerCase();
    const title = collection.node.title;
    const isSale = handle === "sale" || handle.includes("sale");
    
    return {
      name: title,
      handle: handle,
      icon: getIconForCategory(handle, title),
      href: `/shop?category=${handle}`,
      isSale,
    };
  });

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-background border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2">
            {t("categories.browse")}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-foreground">
            {t("categories.title")}
          </h2>
        </motion.div>

        {/* Carousel with Navigation */}
        <div className="relative group">
          {/* Previous Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1/2 hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Next Button */}
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1/2 hidden md:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.handle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0"
                  >
                    <Link
                      to={category.href}
                      className="group/item flex flex-col items-center gap-3 min-w-[80px]"
                    >
                      {/* Icon Circle */}
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#f8f8f5] group-hover/item:bg-primary/10 border border-border/50 group-hover/item:border-primary/30 flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-lg">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-foreground/70 group-hover/item:text-primary transition-colors duration-300" />
                        
                        {/* Sale Badge */}
                        {category.isSale && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                            %
                          </span>
                        )}
                      </div>
                      
                      {/* Category Name */}
                      <span className="text-xs md:text-sm font-medium text-foreground/80 group-hover/item:text-primary text-center transition-colors whitespace-nowrap">
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
