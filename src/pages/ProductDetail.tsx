import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        setLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        
        // Initialize selected options
        if (data?.options) {
          const initialOptions: Record<string, string> = {};
          data.options.forEach((opt: { name: string; values: string[] }) => {
            if (opt.values.length > 0) {
              initialOptions[opt.name] = opt.values[0];
            }
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  // Find variant based on selected options
  const selectedVariant = product?.variants.edges.find((v) => {
    return v.node.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    );
  })?.node || product?.variants.edges[0]?.node;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem: CartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.title} x ${quantity}`,
      position: "top-center",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title,
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
          <Loader2 className="w-8 h-8 animate-spin text-[#2d5a3d]" />
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
          <p className="text-gray-500 text-lg">Product not found</p>
          <Link to="/shop" className="text-[#2d5a3d] hover:underline">
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const hasDiscount = selectedVariant?.compareAtPrice && 
    parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link to="/shop" className="text-gray-500 hover:text-gray-700">Shop</Link>
              {product.productType && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link 
                    to={`/shop?category=${product.productType}`} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.productType}
                  </Link>
                </>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
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
              <ProductGallery images={images} productTitle={product.title} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Category & Vendor */}
              <div className="flex items-center gap-3">
                {product.productType && (
                  <Link to={`/shop?category=${product.productType}`}>
                    <Badge variant="secondary" className="bg-[#2d5a3d]/10 text-[#2d5a3d] hover:bg-[#2d5a3d]/20">
                      {product.productType}
                    </Badge>
                  </Link>
                )}
                {product.vendor && (
                  <span className="text-sm text-gray-500">by {product.vendor}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#2d5a3d]">
                  {selectedVariant?.price.currencyCode}{" "}
                  {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    {selectedVariant?.compareAtPrice?.currencyCode}{" "}
                    {parseFloat(selectedVariant?.compareAtPrice?.amount || "0").toFixed(2)}
                  </span>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">
                    {Math.round((1 - parseFloat(selectedVariant?.price.amount || "0") / parseFloat(selectedVariant?.compareAtPrice?.amount || "1")) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                {selectedVariant?.availableForSale ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                  </>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              )}

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Variant Options */}
              {product.options.map((option) => (
                option.values.length > 1 && (
                  <div key={option.name} className="space-y-3">
                    <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {option.name}: <span className="font-normal text-gray-600">{selectedOptions[option.name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {option.values.map((value) => {
                        const isSelected = selectedOptions[option.name] === value;
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value })}
                            className={`px-5 py-2.5 text-sm font-medium border-2 rounded-xl transition-all ${
                              isSelected
                                ? "border-[#2d5a3d] bg-[#2d5a3d] text-white shadow-lg shadow-[#2d5a3d]/20"
                                : "border-gray-200 text-gray-700 hover:border-[#2d5a3d] hover:text-[#2d5a3d]"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-l-xl rounded-r-none h-12 w-12"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-14 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-r-xl rounded-l-none h-12 w-12"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  size="lg"
                  className="flex-1 h-12 bg-[#2d5a3d] hover:bg-[#234830] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#2d5a3d]/20 transition-all hover:shadow-xl hover:shadow-[#2d5a3d]/30"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                {/* Wishlist & Share */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                    }}
                    className={`h-12 w-12 rounded-xl border-2 ${
                      isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-12 w-12 rounded-xl border-2 border-gray-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-[#2d5a3d]" />
                  <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                  <p className="text-xs text-gray-500">Over AED 200</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-[#2d5a3d]" />
                  <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Protected</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#2d5a3d]" />
                  <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                  <p className="text-xs text-gray-500">14 Days</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          currentProductId={product.id} 
          productType={product.productType}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
