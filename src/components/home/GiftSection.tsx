import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const GiftSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80"
                alt="Gift plant"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden mt-8">
              <img
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80"
                alt="Gift arrangement"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-normal mb-4">
              {t("gift.title")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto md:mx-0">
              {t("gift.subtitle")}. {t("gift.desc")}
            </p>
            <a
              href="/gifts"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-foreground/90 transition-colors"
            >
              Shop Gifts
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
