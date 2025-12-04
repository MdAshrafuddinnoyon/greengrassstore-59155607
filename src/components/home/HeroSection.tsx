import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] min-h-[400px] md:min-h-[500px]">
      {/* Background with Ficus Plant */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Ficus plant"
          className="w-full h-full object-cover object-right"
        />
        {/* Dark overlay on left side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center min-h-[400px] md:min-h-[500px]">
          {/* Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg py-12"
          >
            <p className="text-sm md:text-base text-[#c9a87c] italic mb-4 md:mb-6">
              Plants That Look Real & Thrive Without Maintenance in UAE Homes
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tight">
              PLANTS
            </h1>
            
            <a
              href="/plants"
              className="inline-block bg-white text-gray-900 px-8 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Shop Plants
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
