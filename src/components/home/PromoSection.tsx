import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const PromoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=1920&q=80"
        alt="November Sale"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-lg text-white"
          >
            <p className="text-sm uppercase tracking-widest mb-2 text-white/70">
              Limited Time Offer
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal mb-4">
              {t("promo.title")}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {t("promo.subtitle")}
            </p>
            <a
              href="/sale"
              className="inline-block bg-white text-black px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors"
            >
              {t("promo.cta")}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
