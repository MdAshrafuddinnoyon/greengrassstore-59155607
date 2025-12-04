import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "./ShopifyProductCard";
import { Loader2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ShopifyProductGridProps {
  title?: string;
  subtitle?: string;
  query?: string;
  limit?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export const ShopifyProductGrid = ({ 
  title, 
  subtitle, 
  query, 
  limit = 12,
  showViewAll = true,
  viewAllLink = "/shop"
}: ShopifyProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(limit, query);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [query, limit]);

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {title && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-medium text-foreground">{title}</h2>
            </div>
          )}
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-lg md:text-xl font-medium text-foreground mb-6">{title}</h2>
          )}
          <div className="text-center py-12 text-destructive">{error}</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-lg md:text-xl font-medium text-foreground mb-6">{title}</h2>
          )}
          <div className="text-center py-12 bg-muted rounded-2xl">
            <p className="text-muted-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground/70">
              Tell us what products you'd like to add to your store!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {title && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            {showViewAll && (
              <Link 
                to={viewAllLink}
                className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        )}

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {products.map((product, index) => (
              <motion.div 
                key={product.node.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start flex-shrink-0 w-[160px]"
              >
                <ShopifyProductCard product={product} compact />
              </motion.div>
            ))}
          </div>
          {showViewAll && (
            <Link 
              to={viewAllLink}
              className="flex items-center justify-center gap-1 text-sm font-medium text-primary py-3"
            >
              View All Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <ShopifyProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
