import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import heroChair from "@/assets/hero-chair.jpg";
import plantPot from "@/assets/plant-pot.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#0a120a] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={plantPot}
          alt="Plants background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a120a] via-[#0a120a]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[550px] md:min-h-[650px]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white py-12 md:py-0"
          >
            <p className="text-xs text-white/50 mb-4 tracking-wide">
              Plants, Planters & Pots Online Store to beautify homes!
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-8 text-white">
              {t("hero.title")}
            </h1>
            
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block">
                PLANTS
              </span>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                Curated collection of indoor and outdoor plants perfect for Dubai's climate
              </p>
              <a
                href="/plants"
                className="inline-block bg-white text-[#0a120a] px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors mt-2"
              >
                {t("hero.cta")}
              </a>
            </div>
          </motion.div>

          {/* Hero Image - Orange Chair */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative max-w-sm md:max-w-md">
              <img
                src={heroChair}
                alt="Modern orange terracotta chair"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
