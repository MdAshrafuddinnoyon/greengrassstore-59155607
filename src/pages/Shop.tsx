import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopifyProductCard } from "@/components/products/ShopifyProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { key: "all", label: "All Products" },
  { key: "plants", label: "Plants" },
  { key: "trees", label: "Trees" },
  { key: "flowers", label: "Flowers" },
  { key: "pots", label: "Pots" },
  { key: "grass", label: "Grass" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [gridView, setGridView] = useState<"large" | "small">("large");
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.get("q") || undefined;
        const category = searchParams.get("category");
        
        let searchFilter = query;
        if (category && category !== "all") {
          searchFilter = searchFilter 
            ? `${searchFilter} product_type:${category}` 
            : `product_type:${category}`;
        }
        
        const data = await fetchProducts(50, searchFilter);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
      case "price-high":
        return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-[#2d5a3d] text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
            >
              {searchParams.get("q") 
                ? `Search Results: "${searchParams.get("q")}"` 
                : "Shop All Products"
              }
            </motion.h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Discover our collection of beautiful plants, pots, and home decor items
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20"
                  />
                  <button 
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 bg-[#2d5a3d] text-white rounded-md hover:bg-[#234a31] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Categories */}
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryChange(cat.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.key
                        ? "bg-[#2d5a3d] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort & View */}
              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-100 px-4 py-2 pr-8 rounded-lg text-sm cursor-pointer focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setGridView("large")}
                    className={`p-2 rounded ${gridView === "large" ? "bg-[#2d5a3d] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridView("small")}
                    className={`p-2 rounded ${gridView === "small" ? "bg-[#2d5a3d] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {loading ? "Loading..." : `${sortedProducts.length} products found`}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid gap-6 ${
                gridView === "large" 
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              }`}
            >
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ShopifyProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter to find what you're looking for
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSearchParams(new URLSearchParams());
                }}
                className="px-6 py-3 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#234a31] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}