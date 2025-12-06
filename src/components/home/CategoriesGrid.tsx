import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Flower2, Package, Shrub, Sparkles, Gift, Tag, Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";

// Fallback images
import ficusPlant from "@/assets/ficus-plant.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";
import plantPot from "@/assets/plant-pot.jpg";
import ikebana from "@/assets/ikebana.jpg";
import gardenFlowers from "@/assets/garden-flowers.jpg";

// Icon mapping for collections
const iconMap: Record<string, typeof Leaf> = {
  plants: Leaf,
  flowers: Flower2,
  pots: Package,
  greenery: Shrub,
  vases: Sparkles,
  gifts: Gift,
  sale: Tag,
};

// Fallback image mapping
const fallbackImages: Record<string, string> = {
  plants: ficusPlant,
  flowers: flowerPot,
  pots: plantPot,
  greenery: hangingPlants,
  vases: bluePot,
  gifts: ikebana,
  sale: gardenFlowers,
};

export const CategoriesGrid = () => {
  const { t } = useLanguage();
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(8);
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  // Map collections to display data
  const categories = collections.map((collection) => {
    const handle = collection.node.handle.toLowerCase();
    const isSale = handle === "sale" || handle.includes("sale");
    
    return {
      name: collection.node.title,
      handle: handle,
      icon: iconMap[handle] || Leaf,
      image: collection.node.image?.url || fallbackImages[handle] || ficusPlant,
      href: `/shop?category=${handle}`,
      description: collection.node.description || "",
      isSale,
    };
  });

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-[#f8f8f5]">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-[#f8f8f5]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3">
            {t("categories.browse")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
            {t("categories.title")}
          </h2>
        </motion.div>

        {/* Categories Grid - Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((category, index) => (
            <motion.div
              key={category.handle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={category.href}
                className="group block relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Sale Badge */}
                  {category.isSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full">
                      SALE
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <category.icon className="w-4 h-4 md:w-5 md:h-5 text-white/90" />
                      <h3 className="font-medium text-sm md:text-base text-white">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="flex items-center gap-1 text-white/70 text-xs md:text-sm mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Action Buttons - Mobile Only */}
        <div className="md:hidden mt-6 grid grid-cols-2 gap-3">
          <Link
            to="/shop?category=sale"
            className="group relative h-16 rounded-xl overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Tag className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Sale Items</span>
          </Link>
          <Link
            to="/shop?sort=newest"
            className="group relative h-16 rounded-xl overflow-hidden bg-gradient-to-r from-[#2d5a3d] to-[#1e3d2a] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">New Arrivals</span>
          </Link>
        </div>

        {/* View All Button - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="hidden md:flex justify-center mt-10"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 border border-foreground/20 rounded-full text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
