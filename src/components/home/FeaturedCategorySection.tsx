import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, ShoppingCart, Heart, Percent, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  hanging: hangingPlants,
  gifts: flowerPot,
};

interface LocalProduct {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  category: string;
  subcategory?: string;
  featured_image?: string;
  images?: string[];
  is_on_sale?: boolean;
  is_new?: boolean;
}

interface CategoryWithProducts {
  category: {
    id: string;
    name: string;
    nameAr: string;
    href: string;
    image: string;
  };
  products: LocalProduct[];
}

export const FeaturedCategorySection = () => {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  // Use site settings context
  const { featuredCategorySection } = useSiteSettings();
  const categoriesLimit = featuredCategorySection?.categoriesLimit || 4;
  const displayMode = featuredCategorySection?.displayMode || 'grid';

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories from Supabase
        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(categoriesLimit);
        if (catError) throw catError;

        // Get products from Supabase
        const { data: products, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(80);
        if (prodError) throw prodError;

        // Map products to categories
        const categoriesWithProducts = (categoriesData || []).map((cat) => {
          const categorySlug = cat.slug.toLowerCase();
          const categoryName = cat.name.toLowerCase();
          const matchedProducts = (products || []).filter((product) => {
            const prodCategory = product.category?.toLowerCase() || '';
            return prodCategory === categorySlug || prodCategory === categoryName;
          });
          // Prefer featured products for the slider if available
          const featuredProducts = matchedProducts.filter((p) => p.is_featured);
          const displayProducts = (featuredProducts.length > 0 ? featuredProducts : matchedProducts).slice(0, 6);
          return {
            category: {
              id: cat.id,
              name: cat.name,
              nameAr: cat.name_ar || cat.name,
              href: `/shop?category=${cat.slug}`,
              image: cat.image || fallbackBanners[categorySlug] || ficusPlant,
            },
            products: displayProducts,
          };
        }).filter(cat => cat.products.length > 0);
        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error("Failed to fetch featured categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoriesLimit]);

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  // Grid mode: show all categories in a grid
  if (displayMode === 'grid') {
    return (
      <section className="py-12 md:py-20 bg-muted/30" dir={isArabic ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
            {categories.map((cat) => (
              <div key={cat.category.id} className="flex flex-col items-center">
                <Link to={cat.category.href} className="block group">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-3 border border-border/30 group-hover:border-primary/30 transition-all">
                    <img src={cat.category.image} alt={isArabic ? cat.category.nameAr : cat.category.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm font-medium text-foreground text-center">
                    {isArabic ? cat.category.nameAr : cat.category.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Scroll/slider mode: show as before (slider per category)
  return (
    <section className="py-12 md:py-20 bg-muted/30" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        {categories.map((category, index) => (
          <CategoryBannerSlider
            key={category.category.id}
            category={category.category}
            products={category.products}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};

interface CategoryBannerSliderProps {
  category: {
    id: string;
    name: string;
    nameAr: string;
    href: string;
    image: string;
  };
  products: LocalProduct[];
  reverse?: boolean;
}

const CategoryBannerSlider = ({ category, products, reverse }: CategoryBannerSliderProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const addItem = useCartStore(state => state.addItem);

  const emblaOptions = useMemo(() => ({
    loop: true,
    align: "start",
    direction: isArabic ? "rtl" : "ltr"
  }), [isArabic]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    emblaOptions,
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleAddToCart = (product: LocalProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const displayImage = product.featured_image || product.images?.[0] || '/placeholder.svg';
    
    addItem({
      product: {
        node: {
          id: product.id,
          title: product.name,
          description: '',
          handle: product.slug,
          priceRange: {
            minVariantPrice: {
              amount: product.price.toString(),
              currencyCode: product.currency
            }
          },
          images: { edges: [{ node: { url: displayImage, altText: product.name } }] },
          variants: { edges: [{ node: { id: product.id, title: 'Default', price: { amount: product.price.toString(), currencyCode: product.currency }, availableForSale: true, selectedOptions: [] } }] },
          options: []
        }
      },
      variantId: product.id,
      variantTitle: 'Default',
      price: { amount: product.price.toString(), currencyCode: product.currency },
      quantity: 1,
      selectedOptions: []
    });
    
    toast.success(isArabic ? 'تمت الإضافة إلى السلة' : 'Added to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Banner Side */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden min-h-[280px] md:min-h-[400px]",
          reverse && "lg:order-2",
          isArabic && reverse && "lg:order-1"
        )}
      >
        <img
          src={category.image}
          alt={isArabic ? category.nameAr : category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-6 md:p-8",
            isArabic && "text-right"
          )}
        >
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-3">
            {isArabic ? 'مجموعة مميزة' : 'Featured Collection'}
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-light text-white mb-2">
            {isArabic ? category.nameAr : category.name}
          </h3>
          <Button asChild size="sm" className="bg-white text-foreground hover:bg-white/90">
            <Link
              to={category.href}
              className={cn("inline-flex items-center gap-2", isArabic && "flex-row-reverse")}
            >
              {isArabic ? `تسوق ${category.nameAr}` : `Shop ${category.name}`}
              <ArrowRight className={cn("w-4 h-4", isArabic && "rotate-180")} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Products Slider Side */}
      <div
        className={cn(
          "relative",
          reverse && "lg:order-1",
          isArabic && reverse && "lg:order-2"
        )}
      >
        <div
          className={cn("flex items-center justify-between mb-4", isArabic && "flex-row-reverse")}
        >
          <h4 className={cn("text-base md:text-lg font-medium text-foreground", isArabic && "text-right")}>
            {isArabic ? `شائع في ${category.nameAr}` : `Popular in ${category.name}`}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-background border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
              aria-label={isArabic ? "السابق" : "Previous"}
            >
              {isArabic ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-background border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
              aria-label={isArabic ? "التالي" : "Next"}
            >
              {isArabic ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-5 w-full min-w-full flex-nowrap pr-1">
            {products.map((product) => {
              const displayImage = product.featured_image || product.images?.[0] || '/placeholder.svg';
              const discountPercentage = product.compare_at_price
                ? Math.round((1 - product.price / product.compare_at_price) * 100)
                : 0;

              return (
                <div key={product.id} className="flex-none w-[180px] md:w-[220px]">
                  <Link to={`/product/${product.slug}`} className="group block">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-background mb-3 border border-border/30 group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={displayImage}
                        alt={isArabic && product.name_ar ? product.name_ar : product.name}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                      />

                      <div
                        className={cn(
                          "absolute top-2 left-2 flex flex-col gap-1 z-10",
                          isArabic && "right-2 left-auto"
                        )}
                      >
                        {product.is_on_sale && discountPercentage > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                            <Percent className="w-2.5 h-2.5" />
                            {discountPercentage}%
                          </span>
                        )}
                        {product.is_new && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                            <Sparkles className="w-2.5 h-2.5" />
                            {isArabic ? 'جديد' : 'NEW'}
                          </span>
                        )}
                      </div>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          "absolute bottom-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white",
                          isArabic ? "left-2" : "right-2"
                        )}
                        onClick={(e) => handleAddToCart(product, e)}
                        aria-label={isArabic ? "إضافة إلى السلة" : "Add to cart"}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <h5
                      className={cn(
                        "font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]",
                        isArabic && "text-right"
                      )}
                    >
                      {isArabic && product.name_ar ? product.name_ar : product.name}
                    </h5>

                    <div
                      className={cn(
                        "flex items-center gap-2 mt-1",
                        isArabic && "flex-row-reverse justify-end"
                      )}
                    >
                      <p className="text-sm text-primary font-bold">
                        {product.currency} {product.price.toFixed(0)}
                      </p>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {product.currency} {product.compare_at_price.toFixed(0)}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          to={category.href}
          className={cn(
            "inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:gap-2 transition-all",
            isArabic && "flex-row-reverse"
          )}
        >
          {isArabic ? `عرض الكل ${category.nameAr}` : `View All ${category.name}`}
          <ArrowRight className={cn("w-4 h-4", isArabic && "rotate-180")} />
        </Link>
      </div>
    </motion.div>
  );
};
