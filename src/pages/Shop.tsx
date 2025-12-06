import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopifyProductCard } from "@/components/products/ShopifyProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { fetchProducts, fetchCollections, ShopifyProduct, ShopifyCollection, filterProductsByCategory, isProductOnSale } from "@/lib/shopify";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [gridView, setGridView] = useState<"large" | "small">("large");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Build categories from collections
  const categories = useMemo(() => {
    const dynamicCategories = collections.map((c) => ({
      key: c.node.handle,
      label: c.node.title,
      isParent: true,
    }));
    return [{ key: "all", label: "All Products" }, ...dynamicCategories];
  }, [collections]);

  // Extract unique tags from products
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => {
      const productTags = ["indoor", "outdoor", "low-maintenance", "tropical", "decorative", "air-purifying"];
      productTags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [products]);

  // Extract colors and sizes from product options
  const { allColors, allSizes } = useMemo(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    
    products.forEach((p) => {
      p.node.options?.forEach((opt) => {
        if (opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour") {
          opt.values.forEach((v) => colors.add(v));
        }
        if (opt.name.toLowerCase() === "size") {
          opt.values.forEach((v) => sizes.add(v));
        }
      });
    });
    
    return { 
      allColors: Array.from(colors), 
      allSizes: Array.from(sizes) 
    };
  }, [products]);

  // Calculate max price
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    const prices = products.map((p) => parseFloat(p.node.priceRange.minVariantPrice.amount));
    return Math.ceil(Math.max(...prices, 1000) / 100) * 100;
  }, [products]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const query = searchParams.get("q") || undefined;
        
        // Fetch products and collections in parallel
        const [productsData, collectionsData] = await Promise.all([
          fetchProducts(100, query),
          fetchCollections(20)
        ]);
        
        setProducts(productsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Sync selected category with URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all";
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
    setTimeout(() => setIsSearching(false), 500);
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
    setSelectedColors([]);
    setSelectedSizes([]);
    setSearchQuery("");
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter (client-side)
    if (selectedCategory && selectedCategory !== "all") {
      // Special handling for sale category
      if (selectedCategory === "sale") {
        result = result.filter(p => isProductOnSale(p));
      } else {
        result = filterProductsByCategory(result, selectedCategory);
      }
    }

    // Price filter
    result = result.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) => {
        const colorOption = p.node.options?.find(
          (opt) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour"
        );
        if (!colorOption) return false;
        return colorOption.values.some((v) => selectedColors.includes(v));
      });
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) => {
        const sizeOption = p.node.options?.find((opt) => opt.name.toLowerCase() === "size");
        if (!sizeOption) return false;
        return sizeOption.values.some((v) => selectedSizes.includes(v));
      });
    }

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
  }, [products, selectedCategory, priceRange, sortBy, selectedColors, selectedSizes]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, selectedColors, selectedSizes, searchParams]);

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) + 
    selectedTags.length +
    selectedColors.length +
    selectedSizes.length;

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
      colors={allColors}
      selectedColors={selectedColors}
      onColorsChange={setSelectedColors}
      sizes={allSizes}
      selectedSizes={selectedSizes}
      onSizesChange={setSelectedSizes}
      onClearAll={handleClearAll}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 pb-24 lg:pb-0">
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
                        placeholder="Search by name, category, type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20"
                      />
                      <button 
                        type="submit"
                        disabled={isSearching}
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#2d5a3d] text-white rounded-lg hover:bg-[#234a31] transition-colors disabled:opacity-50"
                      >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
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
                <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
                  gridView === "large" 
                    ? "grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                        <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                <>
                  <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
                    gridView === "large" 
                      ? "grid-cols-2 lg:grid-cols-3" 
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  }`}>
                    {paginatedProducts.map((product) => (
                      <ShopifyProductCard key={product.node.id} product={product} compact={gridView === "small"} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4 mt-10">
                      <p className="text-sm text-gray-500">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first, last, current, and adjacent pages
                            const showPage = page === 1 || 
                              page === totalPages || 
                              Math.abs(page - currentPage) <= 1;
                            const showEllipsis = page === 2 && currentPage > 3 || 
                              page === totalPages - 1 && currentPage < totalPages - 2;
                            
                            if (!showPage && !showEllipsis) return null;
                            
                            if (showEllipsis && !showPage) {
                              return (
                                <span key={page} className="px-2 text-gray-400">
                                  ...
                                </span>
                              );
                            }
                            
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                  currentPage === page
                                    ? "bg-[#2d5a3d] text-white"
                                    : "bg-white border border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
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
