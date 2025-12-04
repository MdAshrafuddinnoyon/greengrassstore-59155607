import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import ikebana from "@/assets/ikebana.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import ficusPlant from "@/assets/ficus-plant.jpg";

const giftItems = [
  {
    id: 1,
    name: "Garden Gift Set",
    price: 199,
    image: ikebana,
    href: "/shop?category=gifts",
  },
  {
    id: 2,
    name: "Plant Lover Bundle",
    price: 149,
    image: flowerPot,
    href: "/shop?category=gifts",
  },
  {
    id: 3,
    name: "Indoor Oasis Kit",
    price: 249,
    image: ficusPlant,
    href: "/shop?category=gifts",
  },
];

export const GiftSection = () => {
  return (
    <section className="py-8 md:py-16 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">
              Perfect Presents
            </p>
          </div>
          <h2 className="font-display text-xl md:text-3xl font-normal text-foreground mb-2 md:mb-3">
            Gift Garden
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-xs md:text-sm">
            Thoughtfully curated gift sets for plant lovers
          </p>
        </motion.div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {giftItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="snap-start flex-shrink-0 w-[200px]"
              >
                <Link to={item.href} className="group block">
                  <div className="aspect-square overflow-hidden bg-muted rounded-2xl mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-primary">AED {item.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {giftItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={item.href}
                className="group block"
              >
                <div className="aspect-square overflow-hidden bg-muted rounded-xl mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-foreground">AED {item.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <Link
            to="/shop?category=gifts"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
          >
            <Gift className="w-4 h-4" />
            View All Gifts
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};
