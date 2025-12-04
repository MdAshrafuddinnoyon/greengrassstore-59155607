import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import gardenFlowers from "@/assets/garden-flowers.jpg";
import heroChair from "@/assets/hero-chair.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px]">
      {/* Background Image - Garden Scene */}
      <div className="absolute inset-0">
        <img
          src={gardenFlowers}
          alt="Garden plants background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px] md:min-h-[600px]">
          {/* Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white py-12 md:py-0"
          >
            <p className="text-xs text-white/70 mb-3 tracking-wide">
              Plants, Planters & Pots Online Store to beautify homes!
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6 text-white">
              {t("hero.title")}
            </h1>
            
            <div className="mt-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2">
                PLANTS
              </span>
              <div className="w-16 h-0.5 bg-white/30 mb-4" />
              <p className="text-white/70 text-sm max-w-sm leading-relaxed mb-6">
                Curated collection of indoor and outdoor plants perfect for Dubai's climate
              </p>
              <a
                href="/plants"
                className="inline-block bg-white text-gray-900 px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-gray-100 transition-colors"
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
            className="hidden md:flex justify-center md:justify-end items-center"
          >
            <div className="relative max-w-xs lg:max-w-sm">
              <img
                src={heroChair}
                alt="Modern orange terracotta armchair"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
