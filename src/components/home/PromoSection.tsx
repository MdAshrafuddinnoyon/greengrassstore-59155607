import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gardenFlowers from "@/assets/garden-flowers.jpg";

export const PromoSection = () => {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      <img
        src={gardenFlowers}
        alt="November Sale"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <p className="text-xs uppercase tracking-widest mb-3 text-white/80">
            Limited Time Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal mb-4">
            November Sale
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
            Up to 40% off on selected plants, pots, and accessories
          </p>
          <a
            href="/sale"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors"
          >
            Shop Sale
            <ArrowRight className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
