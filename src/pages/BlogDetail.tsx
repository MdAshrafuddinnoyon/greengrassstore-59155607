import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { blogPosts } from "./Blog";

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <Link to="/blog" className="text-[#2d5a3d] hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px]">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container mx-auto">
              <span className="inline-block px-3 py-1 bg-[#2d5a3d] text-white text-xs font-medium rounded-full mb-4">
                {post.category}
              </span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-serif font-bold text-white max-w-3xl"
              >
                {post.title}
              </motion.h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2d5a3d] mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-400">Share:</span>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Facebook className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Twitter className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('*') && !paragraph.startsWith('**')) {
                  return (
                    <p key={index} className="text-gray-600 italic mb-4">
                      {paragraph.replace(/\*/g, '')}
                    </p>
                  );
                }
                if (paragraph.startsWith('-')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={index} className="list-disc pl-5 mb-4 space-y-1">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-600">
                          {item.replace(/^-\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Related Posts</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.id}`}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-[#2d5a3d] transition-colors line-clamp-2 mb-1">
                          {related.title}
                        </h4>
                        <p className="text-sm text-gray-500">{related.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
