import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "হোম", href: "/" },
  { name: "শপ", href: "/shop" },
  { name: "কালেকশন", href: "/collections" },
  { name: "নতুন", href: "/new-arrivals" },
  { name: "যোগাযোগ", href: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="font-display text-2xl md:text-3xl font-bold text-gradient">
                GreenGrass
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-link text-sm font-medium tracking-wide uppercase"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                className="p-2 hover:bg-accent rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="hidden sm:flex p-2 hover:bg-accent rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                className="hidden sm:flex p-2 hover:bg-accent rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                className="relative p-2 hover:bg-accent rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
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
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-2xl font-bold text-gradient">
                    GreenGrass
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block py-3 px-4 text-lg font-medium hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                      <Heart className="w-5 h-5" />
                      উইশলিস্ট
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                      <User className="w-5 h-5" />
                      অ্যাকাউন্ট
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
