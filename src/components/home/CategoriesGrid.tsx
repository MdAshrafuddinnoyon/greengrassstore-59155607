import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Flower2, Package, Shrub, Sparkles, Gift, Tag, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
    <section className="py-8 md:py-16 bg-white overflow-hidden">
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

        {/* Carousel with Navigation */}
        <div className="relative group">
          {/* Previous Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Next Button */}
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden md:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.handle}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex-none w-[140px] md:w-[200px] lg:w-[220px]"
                >
                  <Link
                    to={category.href}
                    className="group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                      <category.icon className="w-8 h-8 md:w-10 md:h-10 mb-2 drop-shadow-lg" />
                      <h3 className="font-semibold text-sm md:text-base text-center drop-shadow-lg">{category.name}</h3>
                      {category.description && (
                        <p className="text-[10px] md:text-xs text-white/80 text-center mt-1 line-clamp-2 hidden md:block">{category.description}</p>
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
          </div>
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
