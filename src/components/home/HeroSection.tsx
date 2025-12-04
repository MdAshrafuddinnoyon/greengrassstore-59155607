import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Leaf, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a]">
      {/* Mobile Hero - App Style */}
      <div className="md:hidden relative min-h-[85vh]">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Plants"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-end min-h-[85vh] px-5 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-[#2d5a3d] text-white text-xs font-medium rounded-full mb-4">
              New Collection 2025
            </span>
            <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
              Beautiful Plants
              <br />
              <span className="text-[#c9a87c]">For Your Home</span>
            </h1>
            <p className="text-white/70 text-sm mb-6 max-w-xs">
              Transform your space with our premium artificial and real plants collection
            </p>
            
            <div className="flex gap-3">
              <Link
                to="/shop?category=plants"
                className="flex-1 bg-white text-gray-900 px-6 py-3.5 text-sm font-semibold text-center rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="px-6 py-3.5 text-sm font-medium text-white border border-white/30 rounded-xl hover:bg-white/10 transition-colors"
              >
                Explore
              </Link>
            </div>
          </motion.div>
          
          {/* Quick Features - Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-between mt-6 pt-6 border-t border-white/10"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Truck className="w-4 h-4" />
              <span className="text-xs">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Quality Assured</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Leaf className="w-4 h-4" />
              <span className="text-xs">Fresh Plants</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block relative min-h-[500px] lg:min-h-[600px]">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Ficus plant"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center min-h-[500px] lg:min-h-[600px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl py-12"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-[#2d5a3d] text-white text-xs font-medium rounded-full mb-6"
              >
                ✨ New Collection 2025
              </motion.span>
              
              <p className="text-base lg:text-lg text-[#c9a87c] italic mb-4">
                Plants That Look Real & Thrive Without Maintenance in UAE Homes
              </p>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                PLANTS
              </h1>
              
              <div className="flex gap-4">
                <Link
                  to="/shop?category=plants"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 text-sm font-semibold hover:bg-gray-100 transition-colors rounded-lg"
                >
                  Shop Plants
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-transparent text-white px-8 py-4 text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors rounded-lg"
                >
                  View All
                </Link>
              </div>

              {/* Desktop Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-8 mt-12 pt-8 border-t border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Free Delivery</p>
                    <p className="text-white/50 text-xs">On orders over AED 200</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Quality Assured</p>
                    <p className="text-white/50 text-xs">Premium products only</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
