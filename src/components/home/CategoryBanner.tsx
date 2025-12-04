import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  href: string;
  layout?: "left" | "right" | "center";
  bgColor?: string;
}

export const CategoryBanner = ({
  title,
  subtitle,
  description,
  image,
  href,
  layout = "left",
  bgColor = "bg-[#f5f5f0]",
}: CategoryBannerProps) => {
  if (layout === "center") {
    return (
      <section className="relative h-[350px] md:h-[450px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {subtitle && (
              <p className="text-xs uppercase tracking-widest mb-2 text-white/80">
                {subtitle}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">{description}</p>
            )}
            <a
              href={href}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={bgColor}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 items-center py-10 md:py-0">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: layout === "left" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={layout === "right" ? "md:order-2" : "md:order-1"}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: layout === "left" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`py-6 md:py-12 ${
              layout === "right" ? "md:order-1" : "md:order-2"
            }`}
          >
            {subtitle && (
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                {subtitle}
              </p>
            )}
            <h2 className="font-display text-2xl md:text-3xl font-normal mb-3 text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="text-gray-600 mb-5 max-w-md text-sm">{description}</p>
            )}
            <a
              href={href}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-900 hover:gap-3 transition-all"
            >
              Shop Now
              <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
