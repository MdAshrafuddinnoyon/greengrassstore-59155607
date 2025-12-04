import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopifyProductCard } from "@/components/products/ShopifyProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const categories = [
  { key: "all", label: "All Products" },
  { key: "Plants", label: "Plants" },
  { key: "Trees", label: "Trees" },
  { key: "Flowers", label: "Flowers" },
  { key: "Pots", label: "Pots" },
  { key: "Vases", label: "Vases" },
  { key: "Grass", label: "Grass" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [gridView, setGridView] = useState<"large" | "small">("large");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract unique tags from products
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => {
      // Parse tags if available in product data
      const productTags = ["indoor", "outdoor", "low-maintenance", "tropical", "decorative", "air-purifying"];
      productTags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [products]);

  // Calculate max price
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    const prices = products.map((p) => parseFloat(p.node.priceRange.minVariantPrice.amount));
    return Math.ceil(Math.max(...prices, 1000) / 100) * 100;
  }, [products]);

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

  const handleClearAll = () => {
    setSelectedCategory("all");
    setPriceRange([0, maxPrice]);
    setSelectedTags([]);
    setSearchQuery("");
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    result = result.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => 
          parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-high":
        result.sort((a, b) => 
          parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "name-asc":
        result.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.node.title.localeCompare(a.node.title));
        break;
    }

    return result;
  }, [products, priceRange, sortBy]);

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) + 
    selectedTags.length;

  const FilterSidebar = () => (
    <ProductFilters
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      maxPrice={maxPrice}
      tags={allTags}
      selectedTags={selectedTags}
      onTagsChange={setSelectedTags}
      onClearAll={handleClearAll}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#2d5a3d] to-[#1a3d28] text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-serif font-bold mb-4"
            >
              {searchParams.get("q") 
                ? `Search: "${searchParams.get("q")}"` 
                : selectedCategory !== "all" 
                  ? categories.find(c => c.key === selectedCategory)?.label || "Shop"
                  : "Shop All Products"
              }
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 max-w-2xl mx-auto text-lg"
            >
              Discover our curated collection of plants, pots, and home decor
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20"
                      />
                      <button 
                        type="submit"
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#234a31] transition-colors"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Mobile Filter Button */}
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                      <SheetTrigger asChild>
                        <button className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                          <SlidersHorizontal className="w-4 h-4" />
                          Filters
                          {activeFiltersCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-[#2d5a3d] text-white rounded-full text-xs">
                              {activeFiltersCount}
                            </span>
                          )}
                        </button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[320px] p-0">
                        <SheetHeader className="p-4 border-b">
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                          <FilterSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-gray-100 px-4 py-2.5 pr-10 rounded-xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Grid View Toggle */}
                    <div className="flex items-center border border-gray-200 rounded-xl p-1">
                      <button
                        onClick={() => setGridView("large")}
                        className={`p-2 rounded-lg transition-colors ${
                          gridView === "large" ? "bg-[#2d5a3d] text-white" : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGridView("small")}
                        className={`p-2 rounded-lg transition-colors ${
                          gridView === "small" ? "bg-[#2d5a3d] text-white" : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Pills */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {selectedCategory !== "all" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2d5a3d]/10 text-[#2d5a3d] rounded-full text-sm">
                        {categories.find(c => c.key === selectedCategory)?.label}
                        <button onClick={() => handleCategoryChange("all")}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2d5a3d]/10 text-[#2d5a3d] rounded-full text-sm">
                        AED {priceRange[0]} - {priceRange[1]}
                        <button onClick={() => setPriceRange([0, maxPrice])}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#2d5a3d]/10 text-[#2d5a3d] rounded-full text-sm">
                        {tag}
                        <button onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {loading ? "Loading..." : `${filteredAndSortedProducts.length} products found`}
                </p>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className={`grid gap-6 ${
                  gridView === "large" 
                    ? "grid-cols-2 md:grid-cols-3" 
                    : "grid-cols-3 md:grid-cols-4"
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                <motion.div 
                  layout
                  className={`grid gap-6 ${
                    gridView === "large" 
                      ? "grid-cols-2 md:grid-cols-3" 
                      : "grid-cols-3 md:grid-cols-4"
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredAndSortedProducts.map((product, index) => (
                      <motion.div
                        key={product.node.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <ShopifyProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <button 
                    onClick={handleClearAll}
                    className="px-6 py-3 bg-[#2d5a3d] text-white rounded-xl hover:bg-[#234a31] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
