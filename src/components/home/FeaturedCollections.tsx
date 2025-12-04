import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: 1,
    name: "সামার কালেকশন",
    description: "হালকা এবং আরামদায়ক",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    count: 45,
  },
  {
    id: 2,
    name: "অর্গানিক এসেনশিয়ালস",
    description: "১০০% প্রাকৃতিক ফ্যাব্রিক",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    count: 32,
  },
  {
    id: 3,
    name: "অ্যাক্সেসরিজ",
    description: "স্টাইলিশ সংযোজন",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    count: 28,
  },
];

export const FeaturedCollections = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              কালেকশন
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
              ফিচার্ড কালেকশন
            </h2>
          </div>
          <a
            href="/collections"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            সব দেখুন
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.a
              key={collection.id}
              href={`/collections/${collection.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-background/70 text-sm">
                  {collection.count} আইটেম
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-background mt-1">
                  {collection.name}
                </h3>
                <p className="text-background/80 mt-1">{collection.description}</p>
                <div className="mt-4 flex items-center gap-2 text-background font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  এক্সপ্লোর করুন
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
