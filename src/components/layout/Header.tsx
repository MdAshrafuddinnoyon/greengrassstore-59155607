import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { key: "nav.plants", href: "/plants", hasDropdown: true },
  { key: "nav.trees", href: "/trees", hasDropdown: true, label: "Trees" },
  { key: "nav.flowers", href: "/flowers", hasDropdown: false, label: "Flowers" },
  { key: "nav.pots", href: "/pots", hasDropdown: true },
  { key: "nav.greeneryBunch", href: "/greenary-bunch", hasDropdown: true, label: "Greenary Bunch" },
  { key: "nav.hanging", href: "/hanging", hasDropdown: false, label: "Hanging" },
  { key: "nav.grass", href: "/grass", hasDropdown: false, label: "Grass" },
  { key: "nav.sale", href: "/sale", hasDropdown: false },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, language, setLanguage } = useLanguage();
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const getNavLabel = (link: typeof navLinks[0]) => {
    if (link.label) return link.label;
    return t(link.key);
  };

  return (
    <>
      {/* Top Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 bg-white",
          isScrolled && "shadow-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar - Left */}
            <div className="hidden md:flex items-center flex-1 max-w-xs">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-md text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20"
                />
                <button className="absolute right-0 top-0 h-full px-3 bg-gray-200 rounded-r-md hover:bg-gray-300 transition-colors">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Logo - Center */}
            <a href="/" className="flex items-center justify-center flex-shrink-0 mx-4 lg:mx-8">
              <img src={logo} alt="Green Grass" className="h-12 md:h-14 w-auto" />
            </a>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-xs">
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>{language === "en" ? "العربية" : "English"}</span>
              </button>
              
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Language"
              >
                <Globe className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-1">
                <CartDrawer />
                <span className="hidden md:inline text-sm text-gray-700">
                  (AED {totalPrice.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Gray Background */}
        <nav className="hidden lg:block bg-[#6b6b5e] border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                    link.key === "nav.sale" && "text-white"
                  )}
                >
                  {getNavLabel(link)}
                  {link.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-[300px] bg-white z-50 lg:hidden shadow-xl overflow-y-auto",
                language === "ar" ? "right-0" : "left-0"
              )}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <img src={logo} alt="Green Grass" className="h-10 w-auto" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-md text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none"
                  />
                  <button className="absolute right-0 top-0 h-full px-3 bg-gray-200 rounded-r-md">
                    <Search className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.key}
                      href={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-center justify-between py-3 px-3 text-sm font-medium hover:bg-gray-100 rounded transition-colors",
                        link.key === "nav.sale" && "text-red-600"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {getNavLabel(link)}
                      {link.hasDropdown && (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-sm font-medium hover:text-[#2d5a3d] transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {language === "en" ? "العربية" : "English"}
                  </button>
                  
                  <a
                    href="/account"
                    className="flex items-center gap-2 text-sm font-medium hover:text-[#2d5a3d] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
