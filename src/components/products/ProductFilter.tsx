import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "সব", count: 156 },
  { id: "shirts", name: "শার্ট", count: 45 },
  { id: "pants", name: "প্যান্ট", count: 32 },
  { id: "dresses", name: "ড্রেস", count: 28 },
  { id: "accessories", name: "অ্যাক্সেসরিজ", count: 51 },
];

const priceRanges = [
  { id: "all", name: "সব দাম" },
  { id: "under-1000", name: "৳১,০০০ এর নিচে" },
  { id: "1000-3000", name: "৳১,০০০ - ৳৩,০০০" },
  { id: "3000-5000", name: "৳৩,০০০ - ৳৫,০০০" },
  { id: "above-5000", name: "৳৫,০০০ এর উপরে" },
];

const sortOptions = [
  { id: "featured", name: "ফিচার্ড" },
  { id: "newest", name: "নতুন" },
  { id: "price-low", name: "দাম: কম থেকে বেশি" },
  { id: "price-high", name: "দাম: বেশি থেকে কম" },
  { id: "rating", name: "রেটিং" },
];

interface ProductFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  onViewChange?: (view: "grid" | "large") => void;
}

interface FilterState {
  category: string;
  priceRange: string;
  sortBy: string;
}

export const ProductFilter = ({ onFilterChange, onViewChange }: ProductFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState<"grid" | "large">("grid");
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: "all",
    sortBy: "featured",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleViewChange = (view: "grid" | "large") => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "all" && v !== "featured").length;

  return (
    <div className="mb-8">
      {/* Mobile Filter Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg font-medium text-sm"
        >
          <Filter className="w-4 h-4" />
          ফিল্টার
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewChange("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              activeView === "grid" ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleViewChange("large")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              activeView === "large" ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden lg:flex items-center justify-between gap-6 pb-6 border-b border-border">
        {/* Category Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange("category", category.id)}
              className={cn(
                "filter-chip",
                filters.category === category.id && "active"
              )}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-70">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Price Filter Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              দাম
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="p-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => handleFilterChange("priceRange", range.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      filters.priceRange === range.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              সাজান
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="p-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterChange("sortBy", option.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      filters.sortBy === option.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => handleViewChange("grid")}
              className={cn(
                "p-2 rounded-md transition-all duration-200",
                activeView === "grid" ? "bg-card shadow-sm" : "hover:bg-accent"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange("large")}
              className={cn(
                "p-2 rounded-md transition-all duration-200",
                activeView === "large" ? "bg-card shadow-sm" : "hover:bg-accent"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold">ফিল্টার</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">ক্যাটাগরি</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleFilterChange("category", category.id)}
                        className={cn(
                          "filter-chip",
                          filters.category === category.id && "active"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">দাম</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => handleFilterChange("priceRange", range.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg border transition-all",
                          filters.priceRange === range.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-8">
                  <h4 className="font-medium mb-3">সাজান</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterChange("sortBy", option.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg border transition-all",
                          filters.sortBy === option.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full btn-primary rounded-lg"
                >
                  ফিল্টার প্রয়োগ করুন
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
