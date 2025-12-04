import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Flower2, Package, Shrub, Sparkles, Gift, Tag, Loader2 } from "lucide-react";
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

// Color mapping for collections
const colorMap: Record<string, string> = {
  plants: "from-green-600 to-green-800",
  flowers: "from-pink-500 to-rose-600",
  pots: "from-amber-600 to-orange-700",
  greenery: "from-emerald-600 to-teal-700",
  vases: "from-blue-600 to-indigo-700",
  gifts: "from-purple-600 to-violet-700",
  sale: "from-red-500 to-rose-600",
};

export const CategoriesGrid = () => {
  const { t } = useLanguage();
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(20);
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
      color: colorMap[handle] || "from-green-600 to-green-800",
      isSale,
    };
  });

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-white">
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
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            {t("categories.browse")}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground">
            {t("categories.title")}
          </h2>
        </motion.div>

        {/* Mobile Categories - App Style Scrollable */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {categories.map((category, index) => (
              <motion.div
                key={category.handle}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start"
              >
                <Link
                  to={category.href}
                  className="group flex flex-col items-center w-20"
                >
                  <div className={`relative w-16 h-16 rounded-2xl overflow-hidden mb-2 shadow-lg ${category.isSale ? 'ring-2 ring-red-500' : ''}`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-50`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <span className={`text-xs font-medium text-center ${category.isSale ? 'text-red-500' : 'text-foreground'}`}>
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Grid - Dynamic columns based on count */}
        <div className={`hidden md:grid gap-4 ${categories.length <= 4 ? 'grid-cols-4' : categories.length <= 6 ? 'grid-cols-6' : 'grid-cols-7'}`}>
          {categories.map((category, index) => (
            <motion.div
              key={category.handle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={category.href}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <category.icon className="w-8 h-8 mb-2 drop-shadow-lg" />
                  <h3 className="font-semibold text-sm text-center drop-shadow-lg">{category.name}</h3>
                  {category.description && (
                    <p className="text-[10px] text-white/80 text-center mt-1 line-clamp-2">{category.description}</p>
                  )}
                </div>
                {category.isSale && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    {t("product.sale").toUpperCase()}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Quick Actions */}
        <div className="md:hidden mt-6 grid grid-cols-2 gap-3">
          <Link
            to="/shop?category=sale"
            className="relative h-20 rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center"
          >
            <Tag className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-sm">{t("category.sale40")}</span>
          </Link>
          <Link
            to="/shop?sort=newest"
            className="relative h-20 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-emerald-700 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-sm">{t("header.newArrivals")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
