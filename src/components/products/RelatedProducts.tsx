import { useEffect, useState } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "./ShopifyProductCard";

interface RelatedProductsProps {
  currentProductId: string;
  productType?: string;
  tags?: string;
}

export const RelatedProducts = ({ currentProductId, productType, tags }: RelatedProductsProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
=======
import { supabase } from "@/integrations/supabase/client";
import { LocalProductCard, LocalProduct } from "./LocalProductCard";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
  tags?: string[];
}

export const RelatedProducts = ({ currentProductId, category, tags }: RelatedProductsProps) => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      setLoading(true);
      try {
<<<<<<< HEAD
        // Try to fetch by product type first
        let query = productType ? `product_type:${productType}` : undefined;
        const data = await fetchProducts(8, query);
        
        // Filter out current product
        const filteredProducts = data.filter(
          (p) => p.node.id !== currentProductId
        ).slice(0, 4);
        
        setProducts(filteredProducts);
=======
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .neq('id', currentProductId)
          .limit(8);

        // Filter by category if provided
        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        setProducts((data || []).slice(0, 4));
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
<<<<<<< HEAD
  }, [currentProductId, productType]);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-8">
=======
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-8">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
<<<<<<< HEAD
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
=======
              <div key={i} className="bg-background rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
<<<<<<< HEAD
    <section className="py-12 bg-gray-50">
=======
    <section className="py-12 bg-muted/30">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
<<<<<<< HEAD
          className="text-2xl font-serif font-semibold text-gray-900 mb-8"
=======
          className="text-2xl font-serif font-semibold text-foreground mb-8"
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        >
          You May Also Like
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
<<<<<<< HEAD
              key={product.node.id}
=======
              key={product.id}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
<<<<<<< HEAD
              <ShopifyProductCard product={product} />
=======
              <LocalProductCard product={product} />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
