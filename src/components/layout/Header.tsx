import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, Heart, Globe, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const navLinks = [
  { key: "nav.plants", href: "/plants" },
  { key: "nav.pots", href: "/pots" },
  { key: "nav.planters", href: "/planters" },
  { key: "nav.vases", href: "/vases" },
  { key: "nav.homecare", href: "/homecare" },
  { key: "nav.sale", href: "/sale" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(2);
  const { t, language, setLanguage } = useLanguage();

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

  return (
    <>
      {/* Top Bar */}
      <div className="bg-foreground text-background text-[11px] py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span>Free delivery on orders over AED 200</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Globe className="w-3 h-3" />
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 bg-background border-b border-border",
          isScrolled && "shadow-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-muted rounded transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-1.5">
              <Leaf className="w-5 h-5 text-primary" />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold tracking-wider">GREEN</span>
                <span className="text-xs font-semibold tracking-wider">GRASS</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-[11px] uppercase tracking-widest font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  {t(link.key)}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                className="hidden sm:flex p-2 hover:bg-muted rounded transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                className="hidden sm:flex p-2 hover:bg-muted rounded transition-colors"
                aria-label="Account"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                className="relative p-2 hover:bg-muted rounded transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-[280px] bg-background z-50 lg:hidden shadow-xl",
                language === "ar" ? "right-0" : "left-0"
              )}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold tracking-wider">GREEN GRASS</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-muted rounded"
                  >
                    <X className="w-4 h-4" />
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
                      className="block py-3 px-3 text-sm uppercase tracking-widest font-medium hover:bg-muted rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(link.key)}
                    </motion.a>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-border">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
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
