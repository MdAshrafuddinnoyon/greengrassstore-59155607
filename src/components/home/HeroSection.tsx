import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const { hero, loading } = useSiteSettings();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  if (!hero.enabled && !loading) return null;

  const title = isArabic ? hero.titleAr : hero.title;
  const subtitle = isArabic ? hero.subtitleAr : hero.subtitle;
  const description = isArabic ? hero.descriptionAr : hero.description;
  const buttonText = isArabic ? hero.buttonTextAr : hero.buttonText;
  const secondaryButtonText = isArabic ? hero.secondaryButtonTextAr : hero.secondaryButtonText;
  const backgroundImage = hero.backgroundImage || heroBg;

  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Premium plants collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-medium"
          >
            Green Grass Store
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white font-light leading-[1.1] mb-6"
          >
            {title}
            <br />
            <span className="text-[#c9a87c]">{subtitle}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl mb-8 max-w-lg font-light"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-white/90 text-gray-900 px-8 py-6 text-base font-medium rounded-lg"
            >
              <Link to={hero.buttonLink} className="flex items-center gap-2">
                {buttonText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 px-8 py-6 text-base rounded-lg"
            >
              <Link to={hero.secondaryButtonLink}>
                {secondaryButtonText}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};