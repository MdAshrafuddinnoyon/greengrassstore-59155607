import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronRight, Check, Ticket, Copy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductGallery } from "@/components/products/ProductGallery";
import { LocalRelatedProducts } from "@/components/products/LocalRelatedProducts";

interface LocalProduct {
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
  featured_image?: string;
  images?: string[];
  is_featured: boolean;
  is_on_sale: boolean;
  is_new: boolean;
  is_active: boolean;
  stock_quantity: number;
  sku?: string;
  tags?: string[];
  product_type: 'simple' | 'variable';
  option1_name?: string;
  option1_values?: string[];
  option2_name?: string;
  option2_values?: string[];
  option3_name?: string;
  option3_values?: string[];
}

interface ProductVariant {
  id: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  is_active: boolean;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  image_url?: string;
}

interface ActiveCoupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        fetchWishlist();
      }
    };
    checkAuth();
  }, [fetchWishlist]);

  // Fetch active coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const now = new Date().toISOString();
        const { data } = await supabase
          .from('discount_coupons')
          .select('id, code, description, discount_type, discount_value, min_order_amount')
          .eq('is_active', true)
          .or(`expires_at.is.null,expires_at.gte.${now}`)
          .order('discount_value', { ascending: false })
          .limit(3);
        
        setActiveCoupons((data || []) as ActiveCoupon[]);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        setLoading(true);
        // Reset quantity and options when loading new product
        setQuantity(1);
        setSelectedOptions({});
        setSelectedImageIndex(0);
        
        // Fetch product by slug
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', handle)
          .eq('is_active', true)
          .single();

        if (productError) throw productError;
        
        if (productData) {
          const typedProduct: LocalProduct = {
            ...productData,
            product_type: (productData.product_type || 'simple') as 'simple' | 'variable',
          };
          setProduct(typedProduct);

          // Initialize selected options
          const newOptions: Record<string, string> = {};
          if (typedProduct.option1_values?.length) {
            newOptions[typedProduct.option1_name || 'Option 1'] = typedProduct.option1_values[0];
          }
          if (typedProduct.option2_values?.length) {
            newOptions[typedProduct.option2_name || 'Option 2'] = typedProduct.option2_values[0];
          }
          if (typedProduct.option3_values?.length) {
            newOptions[typedProduct.option3_name || 'Option 3'] = typedProduct.option3_values[0];
          }
          setSelectedOptions(newOptions);

          // Fetch variants if variable product
          if (typedProduct.product_type === 'variable') {
            const { data: variantsData } = await supabase
              .from('product_variants')
              .select('*')
              .eq('product_id', productData.id)
              .eq('is_active', true);
            setVariants(variantsData || []);
          } else {
            setVariants([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  // Real-time stock updates subscription
  useEffect(() => {
    if (!product?.id) return;

    const channel = supabase
      .channel(`product-stock-${product.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${product.id}`
        },
        (payload) => {
          setProduct(prev => prev ? { ...prev, stock_quantity: payload.new.stock_quantity } : prev);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'product_variants',
          filter: `product_id=eq.${product.id}`
        },
        (payload) => {
          setVariants(prev => prev.map(v => 
            v.id === payload.new.id ? { ...v, stock_quantity: payload.new.stock_quantity } : v
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product?.id]);

  // Find matching variant based on selected options
  const selectedVariant = variants.find(v => {
    if (product?.option1_name && v.option1_value !== selectedOptions[product.option1_name]) return false;
    if (product?.option2_name && v.option2_value !== selectedOptions[product.option2_name]) return false;
    if (product?.option3_name && v.option3_value !== selectedOptions[product.option3_name]) return false;
    return true;
  });

  const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
  const currentComparePrice = selectedVariant?.compare_at_price ?? product?.compare_at_price;
  const currentStock = selectedVariant?.stock_quantity ?? product?.stock_quantity ?? 0;
  const hasDiscount = currentComparePrice && currentComparePrice > currentPrice;

  const allImages = product?.images?.length 
    ? [product.featured_image, ...product.images].filter(Boolean) as string[]
    : product?.featured_image 
      ? [product.featured_image] 
      : [];

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      product: { ...product, featured_image: allImages[0] || product.featured_image },
      variantId: selectedVariant?.id || product.id,
      variantTitle: Object.values(selectedOptions).filter(Boolean).join(' / ') || 'Default',
      price: {
        amount: String(currentPrice),
        currencyCode: product.currency,
      },
      quantity,
      selectedOptions: Object.entries(selectedOptions).map(([name, value]) => ({ name, value })),
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.name} x ${quantity}`,
      position: "top-center",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-muted-foreground text-lg">{isArabic ? 'المنتج غير موجود' : 'Product not found'}</p>
          <Link to="/shop" className="text-primary hover:underline">
            ← {isArabic ? 'العودة إلى المتجر' : 'Back to Shop'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-24 lg:pb-0">
        {/* Breadcrumb */}
        <div className="bg-muted border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">{isArabic ? 'الرئيسية' : 'Home'}</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link to="/shop" className="text-muted-foreground hover:text-foreground">{isArabic ? 'المتجر' : 'Shop'}</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link 
                to={`/shop?category=${product.category}`} 
                className="text-muted-foreground hover:text-foreground capitalize"
              >
                {product.category}
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {isArabic && product.name_ar ? product.name_ar : product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductGallery 
                images={allImages} 
                productTitle={product.name} 
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/shop?category=${product.category.toLowerCase()}`}>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 capitalize cursor-pointer">
                    {product.category}
                  </Badge>
                </Link>
                {product.subcategory && (
                  <Link to={`/shop?category=${product.subcategory.toLowerCase()}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 capitalize cursor-pointer">
                      {product.subcategory}
                    </Badge>
                  </Link>
                )}
                {product.is_new && <Badge className="bg-blue-500">New</Badge>}
                {product.is_on_sale && <Badge className="bg-red-500">Sale</Badge>}
                {product.is_featured && <Badge className="bg-amber-500">Featured</Badge>}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
                {isArabic && product.name_ar ? product.name_ar : product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {product.currency} {currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {product.currency} {currentComparePrice?.toFixed(2)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {Math.round((1 - currentPrice / currentComparePrice!) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Active Coupons Banner */}
              {activeCoupons.length > 0 && (
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Ticket className="w-5 h-5" />
                    <span>{isArabic ? 'عروض خاصة متاحة!' : 'Special Offers Available!'}</span>
                  </div>
                  <div className="space-y-2">
                    {activeCoupons.map((coupon) => (
                      <div 
                        key={coupon.id} 
                        className="flex items-center justify-between bg-background rounded-lg p-3 border"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary text-primary-foreground font-mono font-bold">
                            {coupon.code}
                          </Badge>
                          <div className="text-sm">
                            <span className="font-semibold text-primary">
                              {coupon.discount_type === 'percentage' 
                                ? `${coupon.discount_value}% OFF` 
                                : `AED ${coupon.discount_value} OFF`}
                            </span>
                            {coupon.min_order_amount > 0 && (
                              <span className="text-muted-foreground ml-1">
                                ({isArabic ? 'الحد الأدنى' : 'Min.'} AED {coupon.min_order_amount})
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.code);
                            toast.success(isArabic ? 'تم نسخ الكود!' : 'Coupon code copied!');
                          }}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {isArabic ? 'نسخ' : 'Copy'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center gap-2">
                {currentStock > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {isArabic ? 'متوفر' : 'In Stock'} ({currentStock})
                    </span>
                  </>
                ) : (
                  <span className="text-red-500 font-medium">{isArabic ? 'غير متوفر' : 'Out of Stock'}</span>
                )}
              </div>

              {/* Description */}
              {(product.description || product.description_ar) && (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {isArabic && product.description_ar ? product.description_ar : product.description}
                </p>
              )}

              <hr className="border-border" />

              {/* Variant Options */}
              {product.option1_name && product.option1_values?.length ? (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    {product.option1_name}: <span className="font-normal text-muted-foreground">{selectedOptions[product.option1_name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.option1_values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [product.option1_name!]: value })}
                        className={`px-5 py-2.5 text-sm font-medium border-2 rounded-xl transition-all ${
                          selectedOptions[product.option1_name!] === value
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.option2_name && product.option2_values?.length ? (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    {product.option2_name}: <span className="font-normal text-muted-foreground">{selectedOptions[product.option2_name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.option2_values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [product.option2_name!]: value })}
                        className={`px-5 py-2.5 text-sm font-medium border-2 rounded-xl transition-all ${
                          selectedOptions[product.option2_name!] === value
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.option3_name && product.option3_values?.length ? (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    {product.option3_name}: <span className="font-normal text-muted-foreground">{selectedOptions[product.option3_name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.option3_values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [product.option3_name!]: value })}
                        className={`px-5 py-2.5 text-sm font-medium border-2 rounded-xl transition-all ${
                          selectedOptions[product.option3_name!] === value
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    {isArabic ? 'الكمية' : 'Quantity'}
                  </span>
                  <div className="flex items-center border-2 border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-l-lg rounded-r-none h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="rounded-r-lg rounded-l-none h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={async () => {
                        if (!isAuthenticated) {
                          toast.error(isArabic ? 'يرجى تسجيل الدخول لإضافة إلى المفضلة' : 'Please login to add to wishlist');
                          return;
                        }
                        if (!product) return;
                        
                        if (isInWishlist(product.id)) {
                          const success = await removeFromWishlist(product.id);
                          if (success) toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist');
                        } else {
                          const success = await addToWishlist({
                            id: product.id,
                            title: product.name,
                            image: product.featured_image,
                            price: `${product.currency} ${currentPrice.toFixed(2)}`,
                          });
                          if (success) toast.success(isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to wishlist');
                        }
                      }}
                      className={`h-10 w-10 rounded-lg border ${
                        isInWishlist(product.id) ? "bg-red-50 border-red-200 text-red-500" : "border-border"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="h-10 w-10 rounded-lg border border-border"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0}
                    size="lg"
                    className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isArabic ? 'أضف إلى السلة' : 'Add to Cart'}
                  </Button>

                  <button
                    onClick={() => {
                      const message = `Hi! I want to order:\n\n🛒 Product: ${product.name}\n${Object.values(selectedOptions).filter(Boolean).length ? `📦 Options: ${Object.values(selectedOptions).join(' / ')}\n` : ''}💰 Price: ${product.currency} ${currentPrice.toFixed(2)}\n📊 Quantity: ${quantity}\n\nPlease confirm availability.`;
                      const whatsappUrl = `https://wa.me/+971547751901?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="h-14 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {isArabic ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-muted rounded-xl">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium text-foreground">{isArabic ? 'شحن مجاني' : 'Free Shipping'}</p>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'فوق 200 درهم' : 'Over AED 200'}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium text-foreground">{isArabic ? 'دفع آمن' : 'Secure Payment'}</p>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'محمي 100%' : '100% Protected'}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium text-foreground">{isArabic ? 'إرجاع سهل' : 'Easy Returns'}</p>
                  <p className="text-xs text-muted-foreground">{isArabic ? '14 يوم' : '14 Days'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Related Products */}
        <LocalRelatedProducts 
          currentProductId={product.id} 
          category={product.category} 
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
