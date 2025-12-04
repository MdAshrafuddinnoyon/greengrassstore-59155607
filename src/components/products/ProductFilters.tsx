import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterProps {
  categories: { key: string; label: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onClearAll: () => void;
}

export const ProductFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  tags,
  selectedTags,
  onTagsChange,
  onClearAll,
}: FilterProps) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    tags: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-[#2d5a3d] hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection("category")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">Category</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              openSections.category ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {openSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.key}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedCategory === cat.key}
                      onCheckedChange={() => onCategoryChange(cat.key)}
                      className="border-gray-300 data-[state=checked]:bg-[#2d5a3d] data-[state=checked]:border-[#2d5a3d]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection("price")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">Price Range</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {openSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  max={maxPrice}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">AED</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        onPriceRangeChange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                    />
                  </div>
                  <span className="text-gray-400">—</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">AED</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        onPriceRangeChange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("tags")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Tags</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                openSections.tags ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-[#2d5a3d] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
