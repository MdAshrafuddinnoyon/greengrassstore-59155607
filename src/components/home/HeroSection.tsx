import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
            >
              <Leaf className="w-4 h-4" />
              <span>সাস্টেইনেবল কালেকশন ২০২৫</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              প্রকৃতির ছোঁয়ায়{" "}
              <span className="text-gradient">আধুনিক স্টাইল</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
              পরিবেশ-বান্ধব ফ্যাব্রিক এবং টাইমলেস ডিজাইনের অসাধারণ সমন্বয়। আপনার
              স্টাইলে যোগ করুন প্রকৃতির সতেজতা।
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a href="/shop" className="btn-primary inline-flex items-center justify-center gap-2 group rounded-lg">
                কালেকশন দেখুন
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="/about" className="btn-outline inline-flex items-center justify-center rounded-lg">
                আমাদের সম্পর্কে
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
            >
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  ৫০০+
                </div>
                <div className="text-sm text-muted-foreground mt-1">প্রোডাক্ট</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  ৯৮%
                </div>
                <div className="text-sm text-muted-foreground mt-1">সন্তুষ্ট গ্রাহক</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  ১০০%
                </div>
                <div className="text-sm text-muted-foreground mt-1">ইকো-ফ্রেন্ডলি</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                alt="Fashion Model"
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 top-1/4 bg-card p-4 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">১০০% অর্গানিক</div>
                    <div className="text-xs text-muted-foreground">কটন ফ্যাব্রিক</div>
                  </div>
                </div>
              </motion.div>

              {/* Price Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -left-4 bottom-1/4 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg"
              >
                <div className="text-xs uppercase tracking-wider mb-1">শুরু</div>
                <div className="font-display text-2xl font-bold">৳১,৯৯৯</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
