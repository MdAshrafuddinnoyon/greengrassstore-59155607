<<<<<<< HEAD
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { plantsProducts, potsProducts, plantersProducts, vasesProducts, homecareProducts } from "@/data/products";
=======
import { useState, useEffect, useCallback } from "react";
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, ShoppingCart, Heart, Percent, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
<<<<<<< HEAD
=======
import { supabase } from "@/integrations/supabase/client";
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { useLanguage } from "@/contexts/LanguageContext";
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
<<<<<<< HEAD
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [debugData, setDebugData] = useState<{products?: any[]; categories?: any[]}>({});
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch admin settings for featured categories
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'featured_category_section')
          .single();
        if (settingsError) throw settingsError;
        const settings = settingsData?.setting_value || {};
        if (!settings.selectedCategories || !Array.isArray(settings.selectedCategories)) {
          setCategories([]);
          setLoading(false);
          return;
        }

        // Fetch categories from Supabase (for names/slugs)
        const { data: categoriesData, error: catError } = await supabase
=======

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all categories to build parent-child mapping
        const { data: allCategoriesData, error: allCatError } = await supabase
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
<<<<<<< HEAD
        if (catError) throw catError;

        // Fetch all active products from Supabase (not just featured)
        const { data: productsData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);
        if (prodError) throw prodError;

        // Only set debug data in development
        if (process.env.NODE_ENV === 'development') {
          setDebugData({ products: productsData, categories: categoriesData });
        }

        // Build category sections using admin settings
        const adminCategoryIds = settings.selectedCategories;
        const categoryConfigs = settings.categoryConfigs || {};
        const productsPerCategory = settings.productsPerCategory || 6;
        const categoriesWithProducts = adminCategoryIds.map((catId: string) => {
          const cat = (categoriesData || []).find((c: any) => c.id === catId);
          if (!cat) return null;
          const config = categoryConfigs[catId] || {};
          // Use admin-selected image or fallback
          const image = config.image || cat.image || fallbackBanners[cat.slug?.toLowerCase?.()] || ficusPlant;
          // Use admin-selected products if set, else fallback to productsData by category slug (like shop page)
          let products: any[] = [];
          if (Array.isArray(config.selectedProducts) && config.selectedProducts.length > 0) {
            products = config.selectedProducts
              .map((pid: string) => (productsData || []).find((p: any) => p.id === pid))
              .filter(Boolean)
              .slice(0, productsPerCategory);
          } else {
            // Match by category slug (like shop page)
            products = (productsData || []).filter((p: any) => {
              // Prefer category_slug field if available, else fallback to category name slug
              if (p.category_slug && cat.slug) {
                return p.category_slug === cat.slug;
              }
              if (p.category && cat.slug) {
                const prodSlug = typeof p.category === 'string' ? p.category.toLowerCase().replace(/\s+/g, '-') : '';
                return prodSlug === cat.slug;
              }
              return false;
            }).slice(0, productsPerCategory);
          }
          return {
            category: {
              id: cat.id,
              name: cat.name || '',
              nameAr: cat.name_ar || cat.name || '',
              href: `/shop?category=${cat.slug || ''}`,
              image,
            },
            products: Array.isArray(products) ? products : [],
          };
        }).filter(Boolean);
        setCategories(categoriesWithProducts);
      } catch (error) {
        // Hide raw error from users, just log for dev
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error("Failed to fetch featured categories:", error);
        }
        setCategories([]);
=======
        
        if (allCatError) throw allCatError;

        // Get only main categories (display_order <= 10 typically means parent)
        // OR categories that are specifically parent level (no parent_id)
        const mainCategories = (allCategoriesData || []).filter(cat => 
          cat.parent_id === null && cat.display_order <= 10
        ).slice(0, 4);

        // Build a map of parent categories to their child slugs
        const parentToChildSlugs: Record<string, string[]> = {};
        mainCategories.forEach(parent => {
          const children = (allCategoriesData || []).filter(cat => 
            cat.parent_id === parent.id
          );
          parentToChildSlugs[parent.slug.toLowerCase()] = [
            parent.slug.toLowerCase(),
            parent.name.toLowerCase(),
            ...children.map(c => c.slug.toLowerCase()),
            ...children.map(c => c.name.toLowerCase()),
          ];
        });

        // Get products from Supabase
        const { data: products, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(100);

        if (prodError) throw prodError;

        // Map products to parent categories
        const categoriesWithProducts = mainCategories.map((cat) => {
          const categorySlug = cat.slug.toLowerCase();
          const categoryName = cat.name.toLowerCase();
          const childSlugs = parentToChildSlugs[categorySlug] || [categorySlug, categoryName];
          
          // Match products that belong to this category or any of its children
          const matchedProducts = (products || []).filter((product) => {
            const prodCategory = product.category?.toLowerCase() || '';
            const prodSubcategory = product.subcategory?.toLowerCase() || '';
            
            // Check if product matches parent category directly
            if (childSlugs.includes(prodCategory)) return true;
            
            // Check if product's subcategory matches any child category
            if (prodSubcategory && childSlugs.includes(prodSubcategory)) return true;
            
            // Special case: match "Pots" parent with products that have "Pot" in category
            if (categorySlug === 'pots' && prodCategory.includes('pot')) return true;
            if (categorySlug === 'plants' && prodCategory.includes('plant')) return true;
            if (categorySlug === 'flowers' && prodCategory.includes('flower')) return true;
            
            return false;
          });

          return {
            category: {
              id: cat.id,
              name: cat.name,
              nameAr: cat.name_ar || cat.name,
              href: `/shop?category=${cat.slug}`,
              image: cat.image || fallbackBanners[categorySlug] || ficusPlant,
            },
            products: matchedProducts.slice(0, 8),
          };
        }).filter(cat => cat.products.length > 0);

        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error("Failed to fetch featured categories:", error);
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

<<<<<<< HEAD
  if (!Array.isArray(categories) || categories.length === 0) {
    // Fallback UI if no categories to show
=======
  if (categories.length === 0) {
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    return null;
  }

  return (
<<<<<<< HEAD
    <section className="py-12 md:py-20 bg-muted/30" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        {categories.map((category, index) => (
          <div key={category.category.id}>
            <CategoryBannerSlider
              category={category.category}
              products={category.products}
              reverse={index % 2 === 1}
            />
          </div>
=======
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        {categories.map((category, index) => (
          <CategoryBannerSlider
            key={category.category.id}
            category={category.category}
            products={category.products}
            reverse={index % 2 === 1}
          />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
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

<<<<<<< HEAD
  const emblaOptions = useMemo(() => ({
    loop: true,
    align: "start",
    direction: isArabic ? "rtl" : "ltr"
  }), [isArabic]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    emblaOptions,
=======
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleAddToCart = (product: LocalProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const displayImage = product.featured_image || product.images?.[0] || '/placeholder.svg';
    
    addItem({
<<<<<<< HEAD
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
=======
      product: { ...product, featured_image: displayImage },
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
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
<<<<<<< HEAD
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
=======
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch ${reverse ? "lg:flex-row-reverse" : ""}`}
    >
      {/* Banner Side */}
      <div className={`relative rounded-2xl overflow-hidden min-h-[280px] md:min-h-[400px] ${reverse ? "lg:order-2" : ""}`}>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        <img
          src={category.image}
          alt={isArabic ? category.nameAr : category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
<<<<<<< HEAD

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-6 md:p-8",
            isArabic && "text-right"
          )}
        >
=======
        
        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-3">
            {isArabic ? 'مجموعة مميزة' : 'Featured Collection'}
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-light text-white mb-2">
            {isArabic ? category.nameAr : category.name}
          </h3>
<<<<<<< HEAD
          <Button asChild size="sm" className="bg-white text-foreground hover:bg-white/90">
            <Link
              to={category.href}
              className={cn("inline-flex items-center gap-2", isArabic && "flex-row-reverse")}
            >
              {isArabic ? `تسوق ${category.nameAr}` : `Shop ${category.name}`}
              <ArrowRight className={cn("w-4 h-4", isArabic && "rotate-180")} />
=======
          <Button
            asChild
            size="sm"
            className="bg-white text-foreground hover:bg-white/90"
          >
            <Link to={category.href} className="inline-flex items-center gap-2">
              {isArabic ? `تسوق ${category.nameAr}` : `Shop ${category.name}`}
              <ArrowRight className="w-4 h-4" />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            </Link>
          </Button>
        </div>
      </div>

      {/* Products Slider Side */}
<<<<<<< HEAD
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
=======
      <div className={`relative ${reverse ? "lg:order-1" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base md:text-lg font-medium text-foreground">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            {isArabic ? `شائع في ${category.nameAr}` : `Popular in ${category.name}`}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-background border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
<<<<<<< HEAD
              aria-label={isArabic ? "السابق" : "Previous"}
            >
              {isArabic ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
=======
            >
              <ChevronLeft className="w-4 h-4" />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-background border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
<<<<<<< HEAD
              aria-label={isArabic ? "التالي" : "Next"}
            >
              {isArabic ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
=======
            >
              <ChevronRight className="w-4 h-4" />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            </button>
          </div>
        </div>

<<<<<<< HEAD
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6 w-full min-w-full flex-nowrap pr-4">
            {products.map((product) => {
              const displayImage = product.featured_image || product.images?.[0] || '/placeholder.svg';
              const discountPercentage = product.compare_at_price
=======
        {/* Products Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {products.map((product) => {
              const displayImage = product.featured_image || product.images?.[0] || '/placeholder.svg';
              const discountPercentage = product.compare_at_price 
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                ? Math.round((1 - product.price / product.compare_at_price) * 100)
                : 0;

              return (
<<<<<<< HEAD
                <div key={product.id} className="flex-none w-[180px] md:w-[240px]">
=======
                <div key={product.id} className="flex-none w-[160px] md:w-[200px]">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                  <Link to={`/product/${product.slug}`} className="group block">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-background mb-3 border border-border/30 group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={displayImage}
                        alt={isArabic && product.name_ar ? product.name_ar : product.name}
<<<<<<< HEAD
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                      />

                      <div
                        className={cn(
                          "absolute top-2 left-2 flex flex-col gap-1 z-10",
                          isArabic && "right-2 left-auto"
                        )}
                      >
=======
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
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

<<<<<<< HEAD
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          "absolute bottom-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white",
                          isArabic ? "left-2" : "right-2"
                        )}
                        onClick={(e) => handleAddToCart(product, e)}
                        aria-label={isArabic ? "إضافة إلى السلة" : "Add to cart"}
=======
                      {/* Quick Add Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
                        onClick={(e) => handleAddToCart(product, e)}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </div>
<<<<<<< HEAD

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
=======
                    
                    <h5 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                      {isArabic && product.name_ar ? product.name_ar : product.name}
                    </h5>
                    
                    <div className="flex items-center gap-2 mt-1">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
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

<<<<<<< HEAD
        <Link
          to={category.href}
          className={cn(
            "inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:gap-2 transition-all",
            isArabic && "flex-row-reverse"
          )}
        >
          {isArabic ? `عرض الكل ${category.nameAr}` : `View All ${category.name}`}
          <ArrowRight className={cn("w-4 h-4", isArabic && "rotate-180")} />
=======
        {/* View All Link */}
        <Link
          to={category.href}
          className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:gap-2 transition-all"
        >
          {isArabic ? `عرض الكل ${category.nameAr}` : `View All ${category.name}`}
          <ArrowRight className="w-4 h-4" />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        </Link>
      </div>
    </motion.div>
  );
};
