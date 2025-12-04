import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X, User, Globe, ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, Leaf, TreeDeciduous, Flower2, Package, Grid3X3, Shrub, Tag, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import logo from "@/assets/logo.jpg";

// Import images for mega menu
import ficusPlant from "@/assets/ficus-plant.jpg";
import flowerPot from "@/assets/flower-pot.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";

// Categories data based on the store structure
const categories = [
  {
    name: "Plants",
    href: "/shop?category=plants",
    icon: Leaf,
    image: ficusPlant,
    featured: { title: "New Arrivals", subtitle: "Fresh plants just arrived", href: "/shop?category=plants&sort=newest" },
    subcategories: [
      { name: "Mixed Plant", href: "/shop?category=mixed-plant", icon: Grid3X3 },
      { name: "Palm Tree", href: "/shop?category=palm-tree", icon: TreeDeciduous },
      { name: "Ficus Tree", href: "/shop?category=ficus-tree", icon: TreeDeciduous },
      { name: "Olive Tree", href: "/shop?category=olive-tree", icon: TreeDeciduous },
      { name: "Paradise Plant", href: "/shop?category=paradise-plant", icon: Leaf },
      { name: "Bamboo Tree", href: "/shop?category=bamboo-tree", icon: TreeDeciduous },
    ],
  },
  {
    name: "Flowers",
    href: "/shop?category=flowers",
    icon: Flower2,
    image: flowerPot,
    featured: { title: "Seasonal Blooms", subtitle: "Beautiful flower arrangements", href: "/shop?category=flowers" },
    subcategories: [
      { name: "Fresh Flowers", href: "/shop?category=fresh-flowers", icon: Flower2 },
      { name: "Artificial Flowers", href: "/shop?category=artificial-flowers", icon: Flower2 },
      { name: "Flower Bouquets", href: "/shop?category=flower-bouquets", icon: Flower2 },
    ],
  },
  {
    name: "Pots",
    href: "/shop?category=pots",
    icon: Package,
    image: bluePot,
    featured: { title: "Designer Pots", subtitle: "Premium collection", href: "/shop?category=pots&sort=price-desc" },
    subcategories: [
      { name: "Fiber Pot", href: "/shop?category=fiber-pot", icon: Package },
      { name: "Plastic Pot", href: "/shop?category=plastic-pot", icon: Package },
      { name: "Ceramic Pot", href: "/shop?category=ceramic-pot", icon: Package },
      { name: "Terracotta Pot", href: "/shop?category=terracotta-pot", icon: Package },
    ],
  },
  {
    name: "Greenery",
    href: "/shop?category=greenery",
    icon: Shrub,
    image: hangingPlants,
    featured: { title: "Green Walls", subtitle: "Transform your space", href: "/shop?category=green-wall" },
    subcategories: [
      { name: "Green Wall", href: "/shop?category=green-wall", icon: Grid3X3 },
      { name: "Greenery Bunch", href: "/shop?category=greenery-bunch", icon: Shrub },
      { name: "Moss", href: "/shop?category=moss", icon: Leaf },
      { name: "Grass", href: "/shop?category=grass", icon: Shrub },
    ],
  },
  {
    name: "Hanging",
    href: "/shop?category=hanging",
    icon: Sparkles,
    subcategories: [],
  },
  {
    name: "Gifts",
    href: "/shop?category=gifts",
    icon: Gift,
    subcategories: [],
  },
  {
    name: "Sale",
    href: "/shop?category=sale",
    icon: Tag,
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
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(categoryName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const toggleMobileCategory = (categoryName: string) => {
    setExpandedMobileCategory(prev => prev === categoryName ? null : categoryName);
  };

  const activeCategory = categories.find(c => c.name === activeMegaMenu);

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
            <Link to="/" className="flex flex-col items-center justify-center flex-shrink-0 mx-4 lg:mx-8">
              <img src={logo} alt="Green Grass" className="h-10 md:h-12 w-auto" />
              <span className="text-[10px] text-gray-500 hidden md:block">www.greengrassstore.com</span>
            </Link>

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
              
              <Link
                to="/account"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-gray-600" />
              </Link>
              
              <div className="flex items-center gap-1">
                <CartDrawer />
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  AED {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar with Mega Menu */}
        <nav className="hidden lg:block bg-[#3a3a3a]" ref={megaMenuRef}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => category.subcategories.length > 0 ? handleMouseEnter(category.name) : setActiveMegaMenu(null)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={category.href}
                    className={cn(
                      "flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                      category.isSale && "text-red-400 hover:text-red-300",
                      activeMegaMenu === category.name && "bg-white/10"
                    )}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        activeMegaMenu === category.name && "rotate-180"
                      )} />
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {activeMegaMenu && activeCategory && activeCategory.subcategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-[100]"
                onMouseEnter={() => handleMouseEnter(activeMegaMenu)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="container mx-auto px-4 py-8">
                  <div className="grid grid-cols-12 gap-8">
                    {/* Subcategories */}
                    <div className="col-span-4">
                      <Link
                        to={activeCategory.href}
                        className="text-lg font-semibold text-[#2d5a3d] mb-4 block hover:underline"
                      >
                        All {activeCategory.name}
                      </Link>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {activeCategory.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className="group flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-[#2d5a3d] transition-colors"
                          >
                            <sub.icon className="w-4 h-4 text-gray-400 group-hover:text-[#2d5a3d] transition-colors" />
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Featured Section */}
                    {activeCategory.featured && (
                      <div className="col-span-4">
                        <div className="bg-gradient-to-br from-[#2d5a3d]/5 to-[#2d5a3d]/10 rounded-2xl p-6">
                          <p className="text-xs uppercase tracking-widest text-[#2d5a3d]/70 mb-2">Featured</p>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeCategory.featured.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{activeCategory.featured.subtitle}</p>
                          <Link
                            to={activeCategory.featured.href}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#2d5a3d] hover:gap-3 transition-all"
                          >
                            Shop Now
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Category Image */}
                    {activeCategory.image && (
                      <div className="col-span-4">
                        <Link to={activeCategory.href} className="block group">
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                            <img
                              src={activeCategory.image}
                              alt={activeCategory.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <p className="mt-3 text-sm font-medium text-gray-900 group-hover:text-[#2d5a3d] transition-colors">
                            Explore {activeCategory.name} Collection
                          </p>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-8">
                    <Link
                      to="/shop?category=sale"
                      className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Tag className="w-4 h-4" />
                      Sale & Offers
                    </Link>
                    <Link
                      to="/shop?category=new-arrivals"
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2d5a3d] transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      New Arrivals
                    </Link>
                    <Link
                      to="/shop?category=gifts"
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2d5a3d] transition-colors"
                    >
                      <Gift className="w-4 h-4" />
                      Gift Ideas
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                            <span className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              {category.name}
                            </span>
                            <ChevronRightIcon className={cn(
                              "w-4 h-4 text-gray-400 transition-transform",
                              expandedMobileCategory === category.name && "rotate-90"
                            )} />
                          </button>
                        ) : (
                          <Link
                            to={category.href}
                            className={cn(
                              "flex items-center gap-2 py-3 px-3 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors",
                              category.isSale && "text-red-600"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <category.icon className="w-4 h-4" />
                            {category.name}
                          </Link>
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
                            <Link
                              to={category.href}
                              className="block py-2 pl-4 pr-3 text-sm text-[#2d5a3d] font-medium hover:bg-gray-50 rounded-r-lg"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              All {category.name}
                            </Link>
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                className="flex items-center gap-2 py-2 pl-4 pr-3 text-sm text-gray-600 hover:text-[#2d5a3d] hover:bg-gray-50 rounded-r-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <sub.icon className="w-3.5 h-3.5" />
                                {sub.name}
                              </Link>
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
                  
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 text-sm font-medium hover:text-[#2d5a3d] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
