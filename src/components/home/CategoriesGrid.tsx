import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Flower2, Package, Shrub, Sparkles, Gift, Tag } from "lucide-react";

// Import images
import ficusPlant from "@/assets/ficus-plant.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";
import plantPot from "@/assets/plant-pot.jpg";
import ikebana from "@/assets/ikebana.jpg";
import gardenFlowers from "@/assets/garden-flowers.jpg";

const categories = [
  {
    name: "Plants",
    icon: Leaf,
    image: ficusPlant,
    href: "/shop?category=plants",
    description: "Indoor & Outdoor",
    color: "from-green-600 to-green-800",
  },
  {
    name: "Flowers",
    icon: Flower2,
    image: flowerPot,
    href: "/shop?category=flowers",
    description: "Fresh & Artificial",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Pots",
    icon: Package,
    image: plantPot,
    href: "/shop?category=pots",
    description: "All Styles",
    color: "from-amber-600 to-orange-700",
  },
  {
    name: "Greenery",
    icon: Shrub,
    image: hangingPlants,
    href: "/shop?category=greenery",
    description: "Walls & Bunches",
    color: "from-emerald-600 to-teal-700",
  },
  {
    name: "Vases",
    icon: Sparkles,
    image: bluePot,
    href: "/shop?category=vases",
    description: "Decorative",
    color: "from-blue-600 to-indigo-700",
  },
  {
    name: "Gifts",
    icon: Gift,
    image: ikebana,
    href: "/shop?category=gifts",
    description: "Gift Sets",
    color: "from-purple-600 to-violet-700",
  },
  {
    name: "Sale",
    icon: Tag,
    image: gardenFlowers,
    href: "/shop?category=sale",
    description: "Up to 40% Off",
    color: "from-red-500 to-rose-600",
    isSale: true,
  },
];

export const CategoriesGrid = () => {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Browse by Category
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-normal text-foreground">
            Shop Our Collections
          </h2>
        </motion.div>

        {/* Mobile Categories - App Style Scrollable */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start"
              >
                <Link
                  to={category.href}
                  className="group flex flex-col items-center w-20"
                >
                  <div className={`relative w-16 h-16 rounded-2xl overflow-hidden mb-2 shadow-lg ${category.isSale ? 'ring-2 ring-red-500' : ''}`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-50`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <span className={`text-xs font-medium text-center ${category.isSale ? 'text-red-500' : 'text-foreground'}`}>
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Grid - Large cards */}
        <div className="hidden md:grid grid-cols-7 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={category.href}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <category.icon className="w-8 h-8 mb-2 drop-shadow-lg" />
                  <h3 className="font-semibold text-sm text-center drop-shadow-lg">{category.name}</h3>
                  <p className="text-[10px] text-white/80 text-center mt-1">{category.description}</p>
                </div>
                {category.isSale && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    SALE
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Quick Actions */}
        <div className="md:hidden mt-6 grid grid-cols-2 gap-3">
          <Link
            to="/shop?category=sale"
            className="relative h-20 rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center"
          >
            <Tag className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-sm">Sale 40% Off</span>
          </Link>
          <Link
            to="/shop?sort=newest"
            className="relative h-20 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-emerald-700 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-sm">New Arrivals</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
