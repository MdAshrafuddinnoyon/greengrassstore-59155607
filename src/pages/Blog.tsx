import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Clock, Loader2, Search, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface BlogPost {
  id: string;
  title: string;
  title_ar: string | null;
  slug: string;
  excerpt: string;
  excerpt_ar: string | null;
  content: string;
  featured_image: string | null;
  category: string;
  author_name: string;
  reading_time: number;
  view_count: number;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
}

const categories = ["All", "Plant Care", "Tips & Tricks", "Inspiration", "Gift Guide"];

export default function Blog() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const title = isArabic && post.title_ar ? post.title_ar : post.title;
    const excerpt = isArabic && post.excerpt_ar ? post.excerpt_ar : post.excerpt;
    const matchesSearch = searchQuery === "" || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.is_featured);
  const regularPosts = filteredPosts.filter(p => !p.is_featured || selectedCategory !== "All" || searchQuery !== "");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      
      <main className="flex-1 pb-24 lg:pb-0">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#2d5a3d] via-[#234830] to-[#1a3d28] text-white py-16 md:py-24 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                {isArabic ? "نصائح وإلهام" : "Tips & Inspiration"}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                {isArabic ? "مدونتنا" : "Our Blog"}
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                {isArabic 
                  ? "نصائح وإلهام وأدلة لمحبي النباتات" 
                  : "Tips, inspiration, and guides for plant lovers"
                }
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={isArabic ? "ابحث في المقالات..." : "Search articles..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 rounded-full focus:bg-white/20"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-10 justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat 
                    ? "bg-[#2d5a3d] text-white shadow-lg shadow-[#2d5a3d]/20" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#2d5a3d]" />
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && selectedCategory === "All" && searchQuery === "" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <Link to={`/blog/${featuredPost.slug}`} className="block group">
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                      <div className="grid md:grid-cols-2">
                        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                          <img 
                            src={featuredPost.featured_image || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800'} 
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {isArabic ? "مميز" : "Featured"}
                            </span>
                            <span className="px-3 py-1 bg-[#2d5a3d] text-white text-xs font-medium rounded-full">
                              {featuredPost.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {formatDate(featuredPost.published_at)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {featuredPost.reading_time} {isArabic ? "دقيقة" : "min read"}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 group-hover:text-[#2d5a3d] transition-colors">
                            {isArabic && featuredPost.title_ar ? featuredPost.title_ar : featuredPost.title}
                          </h2>
                          <p className="text-gray-600 mb-6 line-clamp-3">
                            {isArabic && featuredPost.excerpt_ar ? featuredPost.excerpt_ar : featuredPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-8 h-8 rounded-full bg-[#2d5a3d]/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-[#2d5a3d]" />
                              </div>
                              {featuredPost.author_name}
                            </span>
                            <span className="text-[#2d5a3d] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                              {isArabic ? "اقرأ المزيد" : "Read More"}
                              <ArrowRight className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Blog Grid */}
              {regularPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
                    >
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img 
                            src={post.featured_image || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800'} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="absolute top-4 left-4 px-3 py-1 bg-[#2d5a3d] text-white text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {post.reading_time} {isArabic ? "د" : "min"}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2d5a3d] transition-colors line-clamp-2">
                            {isArabic && post.title_ar ? post.title_ar : post.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {isArabic && post.excerpt_ar ? post.excerpt_ar : post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="flex items-center gap-2 text-xs text-gray-500">
                              <User className="w-3.5 h-3.5" />
                              {post.author_name}
                            </span>
                            <span className="text-sm font-medium text-[#2d5a3d] flex items-center gap-1 group-hover:gap-2 transition-all">
                              {isArabic ? "اقرأ" : "Read"}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {isArabic ? "لم يتم العثور على مقالات" : "No articles found"}
                  </h3>
                  <p className="text-gray-500">
                    {isArabic ? "حاول تغيير الفلتر أو البحث" : "Try changing the filter or search term"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}