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
  textColor?: string;
}

export const CategoryBanner = ({
  title,
  subtitle,
  description,
  image,
  href,
  layout = "left",
  bgColor = "bg-muted",
  textColor = "text-foreground",
}: CategoryBannerProps) => {
  if (layout === "center") {
    return (
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {subtitle && (
              <p className="text-sm uppercase tracking-widest mb-2 text-white/80">
                {subtitle}
              </p>
            )}
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-white/80 mb-6 max-w-md mx-auto">{description}</p>
            )}
            <a
              href={href}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={bgColor}>
      <div className="container mx-auto px-4">
        <div
          className={`grid md:grid-cols-2 gap-8 items-center py-12 md:py-0 ${
            layout === "right" ? "" : ""
          }`}
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: layout === "left" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={layout === "right" ? "md:order-2" : "md:order-1"}
          >
            <div className="aspect-[4/3] md:aspect-[4/5] overflow-hidden">
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
            className={`py-8 md:py-16 ${textColor} ${
              layout === "right" ? "md:order-1" : "md:order-2"
            }`}
          >
            {subtitle && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {subtitle}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-normal mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
            )}
            <a
              href={href}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:gap-3 transition-all"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
