import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";

// Fallback images
import ficusPlant from "@/assets/ficus-plant.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";
import plantPot from "@/assets/plant-pot.jpg";

const fallbackImages: Record<string, string> = {
  plants: ficusPlant,
  flowers: flowerPot,
  pots: plantPot,
  greenery: hangingPlants,
  vases: bluePot,
};

const bgColors = [
  "bg-secondary",
  "bg-accent",
  "bg-muted",
  "bg-primary/5",
];

const layouts: Array<"left" | "right" | "center"> = ["left", "right", "center"];

interface DynamicCategoryBannersProps {
  limit?: number;
  excludeHandles?: string[];
}

export const DynamicCategoryBanners = ({ 
  limit = 4, 
  excludeHandles = ["sale"] 
}: DynamicCategoryBannersProps) => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(20);
        // Filter out excluded handles
        const filtered = data.filter(
          (c) => !excludeHandles.includes(c.node.handle.toLowerCase())
        );
        setCollections(filtered.slice(0, limit));
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, [limit, excludeHandles]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <>
      {collections.map((collection, index) => {
        const handle = collection.node.handle.toLowerCase();
        const layout = layouts[index % layouts.length];
        const bgColor = bgColors[index % bgColors.length];
        const image = collection.node.image?.url || fallbackImages[handle] || ficusPlant;

        if (layout === "center") {
          return (
            <section key={collection.node.id} className="relative h-[60vh] min-h-[400px] overflow-hidden">
              <img
                src={image}
                alt={collection.node.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center text-white px-4"
                >
                  <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 tracking-wide">
                    {collection.node.title.toUpperCase()}
                  </h2>
                  {collection.node.description && (
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                      {collection.node.description}
                    </p>
                  )}
                  <Link
                    to={`/shop?category=${handle}`}
                    className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-3 rounded-full font-medium hover:bg-white/90 transition-all"
                  >
                    Shop {collection.node.title}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        }

        return (
          <section key={collection.node.id} className={`py-16 md:py-24 ${bgColor}`}>
            <div className="container mx-auto px-4">
              <div className={`flex flex-col ${layout === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-16`}>
                <motion.div
                  initial={{ opacity: 0, x: layout === "right" ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex-1"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={image}
                      alt={collection.node.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: layout === "right" ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex-1 text-center md:text-left"
                >
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {collection.node.title.toUpperCase()}
                  </h2>
                  {collection.node.description && (
                    <p className="text-muted-foreground text-lg mb-8 max-w-md">
                      {collection.node.description}
                    </p>
                  )}
                  <Link
                    to={`/shop?category=${handle}`}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all"
                  >
                    Shop {collection.node.title}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};
