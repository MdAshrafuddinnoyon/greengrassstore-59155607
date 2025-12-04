import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Bookmark, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogPosts } from "./Blog";

export default function BlogDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);
  const otherPosts = relatedPosts.length < 2 
    ? [...relatedPosts, ...blogPosts.filter(p => p.id !== post.id && !relatedPosts.includes(p)).slice(0, 2 - relatedPosts.length)]
    : relatedPosts;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    5 min read
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            >
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
            </motion.nav>

            <div className="grid lg:grid-cols-[1fr_280px] gap-10">
              {/* Main Content */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <motion.h2 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="text-2xl font-bold text-foreground mt-10 mb-5 pb-3 border-b border-border"
                        >
                          {paragraph.replace(/\*\*/g, '')}
                        </motion.h2>
                      );
                    }
                    if (paragraph.startsWith('*') && !paragraph.startsWith('**')) {
                      return (
                        <blockquote key={index} className="border-l-4 border-primary pl-6 my-8 italic text-lg text-muted-foreground bg-primary/5 py-4 pr-6 rounded-r-xl">
                          {paragraph.replace(/\*/g, '')}
                        </blockquote>
                      );
                    }
                    if (paragraph.startsWith('-')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={index} className="my-6 space-y-3">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                              <span>{item.replace(/^-\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <motion.p 
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground mb-5 leading-relaxed text-base md:text-lg"
                      >
                        {paragraph}
                      </motion.p>
                    );
                  })}
                </div>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-sm font-medium text-foreground">Share this article</span>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Author Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-center font-semibold text-foreground mb-1">{post.author}</h4>
                  <p className="text-center text-sm text-muted-foreground">Plant Expert</p>
                </motion.div>

                {/* Categories */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h4 className="font-semibold text-foreground mb-4">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Plant Care", "Tips & Tricks", "Inspiration", "DIY"].map((cat) => (
                      <Link 
                        key={cat}
                        to={`/blog?category=${cat}`}
                        className="px-3 py-1.5 bg-muted text-sm text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </aside>
            </div>

            {/* Related Posts */}
            {otherPosts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 pt-12 border-t border-border"
              >
                <h3 className="text-2xl font-serif font-bold text-foreground mb-8">You might also like</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((related, index) => (
                    <motion.div
                      key={related.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/blog/${related.id}`}
                        className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-[16/10] overflow-hidden">
                          <img 
                            src={related.image} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          <span className="text-xs font-medium text-primary">{related.category}</span>
                          <h4 className="font-semibold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-2">{related.date}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}