import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard, Product } from "./ProductCard";
import { ProductFilter } from "./ProductFilter";
import { cn } from "@/lib/utils";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "অর্গানিক কটন শার্ট",
    price: 1999,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    category: "শার্ট",
    rating: 4.5,
    isNew: true,
    isSale: true,
  },
  {
    id: "2",
    name: "লিনেন সামার ড্রেস",
    price: 3499,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    category: "ড্রেস",
    rating: 4.8,
    isNew: true,
  },
  {
    id: "3",
    name: "ইকো-ফ্রেন্ডলি ট্রাউজার্স",
    price: 2799,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    category: "প্যান্ট",
    rating: 4.3,
    isSale: true,
  },
  {
    id: "4",
    name: "হ্যান্ডউভেন স্কার্ফ",
    price: 899,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    category: "অ্যাক্সেসরিজ",
    rating: 4.6,
  },
  {
    id: "5",
    name: "বাম্বু ফাইবার টি-শার্ট",
    price: 1499,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&q=80",
    category: "শার্ট",
    rating: 4.4,
    isNew: true,
  },
  {
    id: "6",
    name: "রিসাইকেল্ড ডেনিম জ্যাকেট",
    price: 4999,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    category: "আউটারওয়্যার",
    rating: 4.9,
    isSale: true,
  },
  {
    id: "7",
    name: "অর্গানিক কটন প্যান্ট",
    price: 2299,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    category: "প্যান্ট",
    rating: 4.2,
  },
  {
    id: "8",
    name: "হেম্প ক্যানভাস ব্যাগ",
    price: 1299,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
    category: "অ্যাক্সেসরিজ",
    rating: 4.7,
    isNew: true,
  },
];

export const ProductGallery = () => {
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            আমাদের কালেকশন
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            জনপ্রিয় প্রোডাক্ট
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            প্রকৃতি-বান্ধব এবং সাস্টেইনেবল ফ্যাশন আইটেম দিয়ে আপনার ওয়ার্ডরোব সাজান।
          </p>
        </motion.div>

        {/* Filter Bar */}
        <ProductFilter onViewChange={setViewMode} />

        {/* Product Grid */}
        <div
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {sampleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-outline rounded-lg inline-flex items-center gap-2">
            আরো দেখুন
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
