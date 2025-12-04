import { motion } from "framer-motion";
import { Truck, Shield, RefreshCw, Leaf } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "ফ্রি ডেলিভারি",
    description: "৳২,০০০ এর উপরে অর্ডারে বিনামূল্যে ডেলিভারি",
  },
  {
    icon: Shield,
    title: "সিকিউর পেমেন্ট",
    description: "১০০% নিরাপদ অনলাইন পেমেন্ট গেটওয়ে",
  },
  {
    icon: RefreshCw,
    title: "সহজ রিটার্ন",
    description: "৭ দিনের মধ্যে হ্যাসেল-ফ্রি রিটার্ন",
  },
  {
    icon: Leaf,
    title: "ইকো-ফ্রেন্ডলি",
    description: "সাস্টেইনেবল এবং পরিবেশবান্ধব প্রোডাক্ট",
  },
];

export const Features = () => {
  return (
    <section className="py-12 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
