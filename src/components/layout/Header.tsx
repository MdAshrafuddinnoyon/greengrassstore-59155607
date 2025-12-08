import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X, User, ChevronDown, ChevronLeft, ChevronRight, Leaf, TreeDeciduous, Flower2, Package, Grid3X3, Shrub, Tag, Gift, Sparkles, Fence, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import logo from "@/assets/logo-192.png";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  leaf: Leaf,
  flower: Flower2,
  package: Package,
  shrub: Shrub,
  sparkles: Sparkles,
  gift: Gift,
  tag: Tag,
  'tree-deciduous': TreeDeciduous,
  grid: Grid3X3,
  fence: Fence,
  boxes: Boxes,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Leaf;
};

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const { announcementBar, megaMenuCategories, branding } = useSiteSettings();
  const items = useCartStore(state => state.items);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isArabic = language === "ar";

  // Filter active categories and sort by order
  const categories = megaMenuCategories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.order - b.order);

  // Get active announcements
  const activeAnnouncements = announcementBar.announcements
    .filter(a => a.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!announcementBar.autoRotate || activeAnnouncements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentAnnouncement(prev => (prev + 1) % activeAnnouncements.length);
    }, announcementBar.rotationSpeed || 5000);
    return () => clearInterval(interval);
  }, [announcementBar.autoRotate, announcementBar.rotationSpeed, activeAnnouncements.length]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncement(prev => (prev + 1) % activeAnnouncements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement(prev => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const toggleMobileCategory = (categoryId: string) => {
    setExpandedMobileCategory(prev => prev === categoryId ? null : categoryId);
  };

  const activeCategory = categories.find(c => c.id === activeMegaMenu);

  return (
    <>
      {/* Announcement Bar */}
      {announcementBar.enabled && activeAnnouncements.length > 0 && (
        <div 
          className="py-2.5"
          style={{ 
            backgroundColor: announcementBar.backgroundColor,
            color: announcementBar.textColor 
          }}
        >
          <div className="container mx-auto px-4 flex items-center justify-between">
            <button 
              onClick={prevAnnouncement} 
              className="p-1 hover:bg-white/10 rounded transition-colors" 
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-sm font-medium text-center flex-1">
              {isArabic 
                ? activeAnnouncements[currentAnnouncement]?.textAr 
                : activeAnnouncements[currentAnnouncement]?.text
              }
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
      )}

      {/* Main Header */}
      <header className={cn("sticky top-0 z-50 transition-all duration-300 bg-white", isScrolled && "shadow-md")}>
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
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={branding.siteName} className="h-10 md:h-12 w-auto" />
              ) : (
                <img src={logo} alt="Green Grass" className="h-10 md:h-12 w-auto" />
              )}
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
              
              <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Account">
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
              {categories.map(category => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <div 
                    key={category.id} 
                    className="relative" 
                    onMouseEnter={() => category.subcategories.length > 0 ? handleMouseEnter(category.id) : setActiveMegaMenu(null)} 
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link 
                      to={category.href} 
                      className={cn(
                        "flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors", 
                        category.isSale && "text-red-400 hover:text-red-300", 
                        activeMegaMenu === category.id && "bg-white/10"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      {isArabic ? category.nameAr : category.name}
                      {category.subcategories.length > 0 && (
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeMegaMenu === category.id && "rotate-180")} />
                      )}
                    </Link>
                  </div>
                );
              })}
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
                      <Link to={activeCategory.href} className="text-lg font-semibold text-[#2d5a3d] mb-4 block hover:underline">
                        {isArabic ? `جميع ${activeCategory.nameAr}` : `All ${activeCategory.name}`}
                      </Link>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {activeCategory.subcategories.sort((a, b) => a.order - b.order).map(sub => {
                          const SubIcon = getIconComponent(sub.icon);
                          return (
                            <Link 
                              key={sub.id} 
                              to={sub.href} 
                              className="group flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-[#2d5a3d] transition-colors"
                            >
                              <SubIcon className="w-4 h-4 text-gray-400 group-hover:text-[#2d5a3d] transition-colors" />
                              <span>{isArabic ? sub.nameAr : sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Featured Section */}
                    {activeCategory.featuredTitle && (
                      <div className="col-span-4">
                        <div className="bg-gradient-to-br from-[#2d5a3d]/5 to-[#2d5a3d]/10 rounded-2xl p-6">
                          <p className="text-xs uppercase tracking-widest text-[#2d5a3d]/70 mb-2">
                            {isArabic ? "مميز" : "Featured"}
                          </p>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {isArabic ? activeCategory.featuredTitleAr : activeCategory.featuredTitle}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {isArabic ? activeCategory.featuredSubtitleAr : activeCategory.featuredSubtitle}
                          </p>
                          <Link 
                            to={activeCategory.featuredHref} 
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#2d5a3d] hover:gap-3 transition-all"
                          >
                            {isArabic ? "تسوق الآن" : "Shop Now"}
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
                              alt={isArabic ? activeCategory.nameAr : activeCategory.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                          <p className="mt-3 text-sm font-medium text-gray-900 group-hover:text-[#2d5a3d] transition-colors">
                            {isArabic ? `استكشف مجموعة ${activeCategory.nameAr}` : `Explore ${activeCategory.name} Collection`}
                          </p>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-8">
                    <Link to="/shop?category=sale" className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                      <Tag className="w-4 h-4" />
                      {isArabic ? "عروض التخفيضات" : "Sale Offers"}
                    </Link>
                    <Link to="/shop?category=new-arrivals" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2d5a3d] transition-colors">
                      <Sparkles className="w-4 h-4" />
                      {isArabic ? "وصل حديثاً" : "New Arrivals"}
                    </Link>
                    <Link to="/shop?category=gifts" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2d5a3d] transition-colors">
                      <Gift className="w-4 h-4" />
                      {isArabic ? "أفكار هدايا" : "Gift Ideas"}
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
              className={cn("fixed top-0 bottom-0 w-[320px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto", language === "ar" ? "right-0" : "left-0")}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt={branding.siteName} className="h-10 w-auto" />
                    ) : (
                      <img src={logo} alt="Green Grass" className="h-10 w-auto" />
                    )}
                    <span className="text-[10px] text-gray-500">www.greengrassstore.com</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <SearchSuggestions onClose={() => setIsMobileMenuOpen(false)} />
                </div>

                {/* Categories Navigation */}
                <div className="space-y-1">
                  {categories.map(category => {
                    const IconComponent = getIconComponent(category.icon);
                    const hasSubcategories = category.subcategories.length > 0;
                    const isExpanded = expandedMobileCategory === category.id;

                    return (
                      <div key={category.id}>
                        <div className="flex items-center">
                          <Link
                            to={category.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex-1 flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                              category.isSale && "text-red-600"
                            )}
                          >
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium">
                              {isArabic ? category.nameAr : category.name}
                            </span>
                          </Link>
                          {hasSubcategories && (
                            <button
                              onClick={() => toggleMobileCategory(category.id)}
                              className="p-3 hover:bg-gray-100 rounded-lg"
                            >
                              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                            </button>
                          )}
                        </div>

                        {/* Mobile Subcategories */}
                        <AnimatePresence>
                          {hasSubcategories && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-11 py-2 space-y-1">
                                {category.subcategories.sort((a, b) => a.order - b.order).map(sub => (
                                  <Link
                                    key={sub.id}
                                    to={sub.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-[#2d5a3d] hover:bg-gray-50 rounded-lg transition-colors"
                                  >
                                    {isArabic ? sub.nameAr : sub.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Footer Links */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <Link 
                    to="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <User className="w-5 h-5" />
                    {isArabic ? "حسابي" : "My Account"}
                  </Link>
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 w-full"
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">
                      {language === "en" ? "ع" : "En"}
                    </span>
                    {language === "en" ? "العربية" : "English"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
