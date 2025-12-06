import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Flower2, Package, Shrub, Sparkles, Gift, Tag, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";

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

        {/* Icon Categories - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {categories.slice(0, 8).map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.handle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0"
              >
                <Link
                  to={category.href}
                  className="group flex flex-col items-center gap-3 min-w-[80px] md:min-w-0"
                >
                  {/* Icon Circle */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#f8f8f5] group-hover:bg-primary/10 border border-border/50 group-hover:border-primary/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-foreground/70 group-hover:text-primary transition-colors duration-300" />
                    
                    {/* Sale Badge */}
                    {category.isSale && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        %
                      </span>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <span className="text-xs md:text-sm font-medium text-foreground/80 group-hover:text-foreground text-center transition-colors whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
