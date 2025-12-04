import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram, Facebook, Twitter, Truck, RefreshCw, CreditCard, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#3d3d35] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold tracking-wide mb-2">BE THE FIRST TO KNOW</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Subscribe to our newsletter for exclusive content, and special offers delivered straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72 px-4 py-3 bg-transparent border border-gray-600 rounded-none text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
                  required
                />
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#3d3d35] font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Free Delivery</h4>
                <p className="text-gray-400 text-xs mt-0.5">Free Delivery On Orders Over 300 AED</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Hassle-Free Returns</h4>
                <p className="text-gray-400 text-xs mt-0.5">Within 7 days of delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Easy Installments</h4>
                <p className="text-gray-400 text-xs mt-0.5">Pay Later with tabby.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Visit Us In-Store</h4>
                <p className="text-gray-400 text-xs mt-0.5">In Abu Dhabi and Dubai.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight">GREEN</h2>
              <h2 className="text-3xl font-serif font-bold tracking-tight">GRASS</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              We craft timeless pieces that blend elegance and functionality, elevating every space into a masterpiece. Our commitment to quality and design ensures that your home reflects sophistication and comfort in every detail.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Plants & Flowers */}
          <div>
            <h4 className="font-bold text-sm mb-4">Plants & Flowers</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="/shop?category=trees" className="hover:text-white transition-colors">Artificial Trees</a></li>
              <li><a href="/shop?category=flowers" className="hover:text-white transition-colors">Artificial Flowers</a></li>
              <li><a href="/shop?category=plants" className="hover:text-white transition-colors">Artificial Plants</a></li>
              <li><a href="/shop?category=orchids" className="hover:text-white transition-colors">Artificial Orchids</a></li>
              <li><a href="/shop?category=pots" className="hover:text-white transition-colors">Pots</a></li>
            </ul>
          </div>

          {/* Pots */}
          <div>
            <h4 className="font-bold text-sm mb-4">Pots</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="/shop?category=trees" className="hover:text-white transition-colors">Artificial Trees</a></li>
              <li><a href="/shop?category=flowers" className="hover:text-white transition-colors">Artificial Flowers</a></li>
              <li><a href="/shop?category=plants" className="hover:text-white transition-colors">Artificial Plants</a></li>
              <li><a href="/shop?category=orchids" className="hover:text-white transition-colors">Artificial Orchids</a></li>
              <li><a href="/shop?category=pots" className="hover:text-white transition-colors">Pots</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact us</a></li>
              <li><a href="/order-lookup" className="hover:text-white transition-colors">Order Lookup</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/delivery" className="hover:text-white transition-colors">Delivery</a></li>
              <li><a href="/returns" className="hover:text-white transition-colors">Return</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-sm mb-4">About</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/stores" className="hover:text-white transition-colors">Store Locator</a></li>
              <li><a href="/vip" className="hover:text-white transition-colors">VIP Program</a></li>
              <li><a href="/gift-card" className="hover:text-white transition-colors">Gift Card</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2024 Green Grass Store. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <span>www.greengrassstore.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};