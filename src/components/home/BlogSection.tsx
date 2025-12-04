import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
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
    category: "Plant Care"
  },
  {
    id: 2,
    title: "How to Choose the Right Pot for Your Plant",
    excerpt: "Learn about drainage, materials, and sizing to ensure your plants have the perfect home.",
    image: gardenFlowers,
    author: "Sarah Ahmed",
    date: "Nov 25, 2024",
    category: "Tips & Tricks"
  },
  {
    id: 3,
    title: "Creating a Balcony Garden in Your Apartment",
    excerpt: "Transform your small balcony into a lush green oasis with our expert tips and product recommendations.",
    image: plantPot,
    author: "Mohammed Ali",
    date: "Nov 22, 2024",
    category: "Inspiration"
  }
];

export const BlogSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[#1a5d1a] text-xs uppercase tracking-widest font-medium">From Our Blog</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-2">Latest Articles</h2>
          </div>
          <Link 
            to="/blog" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#1a5d1a] hover:underline"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <Link to={`/blog/${post.id}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#1a5d1a] text-white text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1a5d1a] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-sm font-medium text-[#1a5d1a] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5d1a] text-white text-sm font-medium rounded-full hover:bg-[#145214] transition-colors"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
