import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { fetchCollections, fetchProducts, ShopifyCollection, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Fallback images
import ficusPlant from "@/assets/ficus-plant.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";

const fallbackBanners: Record<string, string> = {
  plants: ficusPlant,
  flowers: flowerPot,
  pots: bluePot,
  greenery: hangingPlants,
};

interface CategoryWithProducts {
  collection: ShopifyCollection;
  products: ShopifyProduct[];
}

export const FeaturedCategorySection = () => {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const collections = await fetchCollections(4);
        const products = await fetchProducts(20);
        
        // Map products to collections (simplified matching)
        const categoriesWithProducts = collections.slice(0, 2).map((collection) => {
          const handle = collection.node.handle.toLowerCase();
          const matchedProducts = products.filter((product) => {
            const title = product.node.title.toLowerCase();
            const productType = (product.node.productType || "").toLowerCase();
            return title.includes(handle) || productType.includes(handle);
          });
          
          return {
            collection,
            products: matchedProducts.length > 0 ? matchedProducts : products.slice(0, 6),
          };
        });
        
        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error("Failed to fetch featured categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-[#f8f8f5]">
        <div className="container mx-auto px-4 flex justify-center py-10">
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
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        {categories.map((category, index) => (
          <CategoryBannerSlider
            key={category.collection.node.id}
            collection={category.collection}
            products={category.products}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};

interface CategoryBannerSliderProps {
  collection: ShopifyCollection;
  products: ShopifyProduct[];
  reverse?: boolean;
}

const CategoryBannerSlider = ({ collection, products, reverse }: CategoryBannerSliderProps) => {
  const handle = collection.node.handle.toLowerCase();
  const bannerImage = collection.node.image?.url || fallbackBanners[handle] || ficusPlant;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`grid md:grid-cols-2 gap-6 md:gap-8 items-stretch ${reverse ? "md:flex-row-reverse" : ""}`}
    >
      {/* Banner Side */}
      <div className={`relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[400px] ${reverse ? "md:order-2" : ""}`}>
        <img
          src={bannerImage}
          alt={collection.node.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-3">
            Featured Collection
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-light text-white mb-2">
            {collection.node.title}
          </h3>
          {collection.node.description && (
            <p className="text-white/80 text-sm md:text-base mb-4 max-w-md line-clamp-2">
              {collection.node.description}
            </p>
          )}
          <Button
            asChild
            className="bg-white text-foreground hover:bg-white/90"
          >
            <Link to={`/shop?category=${handle}`} className="inline-flex items-center gap-2">
              Shop {collection.node.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Products Slider Side */}
      <div className={`relative ${reverse ? "md:order-1" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-foreground">
            Popular in {collection.node.title}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-white border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-white border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {products.slice(0, 6).map((product) => (
              <div key={product.node.id} className="flex-none w-[160px] md:w-[200px]">
                <Link to={`/product/${product.node.handle}`} className="group block">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-3">
                    <img
                      src={product.node.images.edges[0]?.node.url || ficusPlant}
                      alt={product.node.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h5 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.node.title}
                  </h5>
                  <p className="text-sm text-primary font-semibold mt-1">
                    {product.node.priceRange.minVariantPrice.currencyCode}{" "}
                    {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <Link
          to={`/shop?category=${handle}`}
          className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:gap-2 transition-all"
        >
          View All {collection.node.title}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};
