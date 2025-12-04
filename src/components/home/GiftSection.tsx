import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ikebana from "@/assets/ikebana.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import ficusPlant from "@/assets/ficus-plant.jpg";

const giftItems = [
  {
    id: 1,
    name: "Garden Gift Set",
    price: 199,
    image: ikebana,
  },
  {
    id: 2,
    name: "Plant Lover Bundle",
    price: 149,
    image: flowerPot,
  },
  {
    id: 3,
    name: "Indoor Oasis Kit",
    price: 249,
    image: ficusPlant,
  },
];

export const GiftSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Perfect Presents
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-normal text-gray-900 mb-3">
            Gift Garden
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            Thoughtfully curated gift sets for plant lovers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftItems.map((item, index) => (
            <motion.a
              key={item.id}
              href="/gifts"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="aspect-square overflow-hidden bg-[#f5f5f5] mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-normal text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">AED {item.price}</p>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/gifts"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-900 hover:text-green-700 transition-colors"
          >
            View All Gifts
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
