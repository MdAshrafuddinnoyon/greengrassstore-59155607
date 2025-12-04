import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "./ShopifyProductCard";

interface RelatedProductsProps {
  currentProductId: string;
  productType?: string;
  tags?: string;
}

export const RelatedProducts = ({ currentProductId, productType, tags }: RelatedProductsProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      setLoading(true);
      try {
        // Try to fetch by product type first
        let query = productType ? `product_type:${productType}` : undefined;
        const data = await fetchProducts(8, query);
        
        // Filter out current product
        const filteredProducts = data.filter(
          (p) => p.node.id !== currentProductId
        ).slice(0, 4);
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProductId, productType]);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-serif font-semibold text-gray-900 mb-8"
        >
          You May Also Like
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ShopifyProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
