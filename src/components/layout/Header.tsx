import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Globe, ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import logo from "@/assets/logo.jpg";

// Categories data based on the store structure
const categories = [
  {
    name: "Plants",
    href: "/shop?category=plants",
    subcategories: [
      { name: "Mixed Plant", href: "/shop?category=mixed-plant" },
      { name: "Palm Tree", href: "/shop?category=palm-tree" },
      { name: "Ficus Tree", href: "/shop?category=ficus-tree" },
      { name: "Olive Tree", href: "/shop?category=olive-tree" },
      { name: "Paradise Plant", href: "/shop?category=paradise-plant" },
      { name: "Bamboo Tree", href: "/shop?category=bamboo-tree" },
    ],
  },
  {
    name: "Flowers",
    href: "/shop?category=flowers",
    subcategories: [
      { name: "Flower", href: "/shop?category=flower" },
    ],
  },
  {
    name: "Pots",
    href: "/shop?category=pots",
    subcategories: [
      { name: "Fiber Pot", href: "/shop?category=fiber-pot" },
      { name: "Plastic Pot", href: "/shop?category=plastic-pot" },
      { name: "Ceramic Pot", href: "/shop?category=ceramic-pot" },
    ],
  },
  {
    name: "Greenery",
    href: "/shop?category=greenery",
    subcategories: [
      { name: "Green Wall", href: "/shop?category=green-wall" },
      { name: "Greenery Bunch", href: "/shop?category=greenery-bunch" },
      { name: "Moss", href: "/shop?category=moss" },
    ],
  },
  {
    name: "Hanging",
    href: "/shop?category=hanging",
    subcategories: [],
  },
  {
    name: "Sale",
    href: "/shop?category=sale",
    subcategories: [],
    isSale: true,
  },
];

const announcements = [
  "Shop Now, Pay Later With Tabby",
  "Free Delivery on Orders Over AED 200",
  "New Arrivals - Check Out Our Latest Plants!",
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleMouseEnter = (categoryName: string) => {
    setActiveDropdown(categoryName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileCategory = (categoryName: string) => {
    setExpandedMobileCategory(prev => prev === categoryName ? null : categoryName);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#2d5a3d] text-white py-2.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button 
            onClick={prevAnnouncement}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-medium text-center flex-1">
            {announcements[currentAnnouncement]}
          </p>
          <button 
            onClick={nextAnnouncement}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 bg-white",
          isScrolled && "shadow-md"
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
            <div className="hidden md:flex items-center flex-1 max-w-sm">
              <SearchSuggestions />
            </div>

            {/* Logo - Center */}
            <a href="/" className="flex flex-col items-center justify-center flex-shrink-0 mx-4 lg:mx-8">
              <img src={logo} alt="Green Grass" className="h-10 md:h-12 w-auto" />
              <span className="text-[10px] text-gray-500 hidden md:block">www.greengrassstore.com</span>
            </a>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end max-w-sm">
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100"
              >
                <span className="font-medium">{language === "en" ? "العربية" : "English"}</span>
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
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  AED {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar with Dropdowns */}
        <nav className="hidden lg:block bg-[#3a3a3a] border-t border-gray-700" ref={dropdownRef}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => category.subcategories.length > 0 && handleMouseEnter(category.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={category.href}
                    className={cn(
                      "flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                      category.isSale && "text-red-400 hover:text-red-300",
                      activeDropdown === category.name && "bg-white/10"
                    )}
                  >
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 transition-transform",
                        activeDropdown === category.name && "rotate-180"
                      )} />
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === category.name && category.subcategories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 min-w-[220px] bg-white rounded-b-lg shadow-xl border border-gray-200 z-[100] overflow-hidden"
                      >
                        <div className="py-2">
                          <a
                            href={category.href}
                            className="block px-4 py-2.5 text-sm font-semibold text-[#2d5a3d] hover:bg-gray-50 border-b border-gray-100"
                          >
                            All {category.name}
                          </a>
                          {category.subcategories.map((sub) => (
                            <a
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#2d5a3d]/5 hover:text-[#2d5a3d] transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a3d]/40" />
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
              className="fixed inset-0 bg-black/30 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-[320px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto",
                language === "ar" ? "right-0" : "left-0"
              )}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <img src={logo} alt="Green Grass" className="h-10 w-auto" />
                    <span className="text-[10px] text-gray-500">www.greengrassstore.com</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <SearchSuggestions onClose={() => setIsMobileMenuOpen(false)} />
                </div>

                {/* Categories Navigation */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    Categories
                  </p>
                  {categories.map((category, index) => (
                    <div key={category.name}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        {category.subcategories.length > 0 ? (
                          <button
                            onClick={() => toggleMobileCategory(category.name)}
                            className={cn(
                              "w-full flex items-center justify-between py-3 px-3 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors",
                              category.isSale && "text-red-600",
                              expandedMobileCategory === category.name && "bg-gray-50"
                            )}
                          >
                            <span>{category.name}</span>
                            <ChevronRightIcon className={cn(
                              "w-4 h-4 text-gray-400 transition-transform",
                              expandedMobileCategory === category.name && "rotate-90"
                            )} />
                          </button>
                        ) : (
                          <a
                            href={category.href}
                            className={cn(
                              "flex items-center py-3 px-3 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors",
                              category.isSale && "text-red-600"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {category.name}
                          </a>
                        )}
                      </motion.div>

                      {/* Mobile Subcategories */}
                      <AnimatePresence>
                        {expandedMobileCategory === category.name && category.subcategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-3 border-l-2 border-[#2d5a3d]/20"
                          >
                            <a
                              href={category.href}
                              className="block py-2 pl-4 pr-3 text-sm text-[#2d5a3d] font-medium hover:bg-gray-50 rounded-r-lg"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              All {category.name}
                            </a>
                            {category.subcategories.map((sub) => (
                              <a
                                key={sub.name}
                                href={sub.href}
                                className="block py-2 pl-4 pr-3 text-sm text-gray-600 hover:text-[#2d5a3d] hover:bg-gray-50 rounded-r-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {sub.name}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

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
