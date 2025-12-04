import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import ficusPlant from "@/assets/ficus-plant.jpg";
import gardenFlowers from "@/assets/garden-flowers.jpg";
import plantPot from "@/assets/plant-pot.jpg";

const blogPosts = [
  {
    id: 1,
    title: "10 Best Indoor Plants for Dubai Climate",
    excerpt: "Discover the perfect plants that thrive in UAE's unique weather conditions and add greenery to your home.",
    image: ficusPlant,
    author: "Green Grass Team",
    date: "Nov 28, 2024",
    category: "Plant Care",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "How to Choose the Right Pot for Your Plant",
    excerpt: "Learn about drainage, materials, and sizing to ensure your plants have the perfect home.",
    image: gardenFlowers,
    author: "Sarah Ahmed",
    date: "Nov 25, 2024",
    category: "Tips & Tricks",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Creating a Balcony Garden in Your Apartment",
    excerpt: "Transform your small balcony into a lush green oasis with our expert tips and product recommendations.",
    image: plantPot,
    author: "Mohammed Ali",
    date: "Nov 22, 2024",
    category: "Inspiration",
    readTime: "6 min read"
  }
];

export const BlogSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14"
        >
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4"
            >
              {t("blog.subtitle")}
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">
              {t("blog.title")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              Expert tips, inspiration, and guides for your plant journey
            </p>
          </div>
          <Link 
            to="/blog" 
            className="group hidden md:inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-all"
          >
            {t("blog.viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Featured Post - Large Card */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:row-span-2"
          >
            <Link to={`/blog/${blogPosts[0].id}`} className="group block h-full">
              <div className="relative h-full min-h-[400px] lg:min-h-full rounded-3xl overflow-hidden">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-4">
                    {blogPosts[0].category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary-foreground/90 transition-colors">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {blogPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>

          {/* Secondary Posts */}
          {blogPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.id}`} className="group block">
                <div className="flex gap-5 p-4 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-base md:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 hidden md:block">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-3 group-hover:gap-2 transition-all">
                      {t("blog.readMore")}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors"
          >
            {t("blog.viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};