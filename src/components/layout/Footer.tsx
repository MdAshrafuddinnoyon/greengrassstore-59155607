import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { Instagram, Facebook, Truck, RefreshCw, CreditCard, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo192 from "@/assets/logo-192.png";

export const Footer = () => {
  const { t, language } = useLanguage();
  const { footer, branding, megaMenuCategories, themeColors } = useSiteSettings();
  const isArabic = language === "ar";
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get active categories for footer links
  const activeCategories = megaMenuCategories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.order - b.order);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'footer' });

      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        toast.success(t("footer.subscribed"));
      }
      setEmail("");
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer 
      className="text-white"
      style={{ backgroundColor: themeColors?.footerBackground || '#3d3d35' }}
    >
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold tracking-wide mb-2">{t("footer.beFirst")}</h3>
              <p className="text-gray-400 text-sm max-w-md">
                {t("footer.newsletterDesc")}
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72 px-4 py-3 bg-transparent border border-gray-600 rounded-none text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
                  required
                />
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-[#3d3d35] font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "..." : t("footer.submit")}
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
                <h4 className="font-semibold text-sm">{t("footer.freeDelivery")}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{t("footer.freeDeliveryDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("footer.hassleFree")}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{t("footer.hassleFreeDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("footer.easyInstallments")}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{t("footer.easyInstallmentsDesc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("footer.visitStore")}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{t("footer.visitStoreDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="col-span-2">
            <div className="mb-4 md:mb-6">
              {/* Footer Logo with transparent background - key forces re-render on change */}
              <img 
                key={branding.logoUrl || 'default-logo'}
                src={branding.logoUrl || logo192} 
                alt={branding.siteName || "Green Grass"} 
                className="h-12 md:h-16 w-auto object-contain mix-blend-lighten"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = logo192;
                }}
              />
            </div>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs">
              {isArabic ? footer.descriptionAr : footer.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 md:gap-4 mt-4 md:mt-6">
              {footer.socialLinks.instagram && (
                <a href={footer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                  <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
              {footer.socialLinks.facebook && (
                <a href={footer.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
              {footer.socialLinks.whatsapp && (
                <a href={`https://wa.me/${footer.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Categories */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t("footer.plantsFlowers")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {activeCategories.slice(0, 4).map(cat => (
                <li key={cat.id}>
                  <Link to={cat.href} className="hover:text-white transition-colors">
                    {isArabic ? cat.nameAr : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t("footer.pots")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {activeCategories.slice(4).map(cat => (
                <li key={cat.id}>
                  <Link to={cat.href} className="hover:text-white transition-colors">
                    {isArabic ? cat.nameAr : cat.name}
                  </Link>
                </li>
              ))}
              {/* Subcategories from Pots category */}
              {activeCategories.find(c => c.name.toLowerCase() === 'pots')?.subcategories.slice(0, 3).map(sub => (
                <li key={sub.id}>
                  <Link to={sub.href} className="hover:text-white transition-colors">
                    {isArabic ? sub.nameAr : sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t("footer.help")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">{t("footer.contactUs")}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">{isArabic ? "الأسئلة الشائعة" : "FAQ"}</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">{isArabic ? "تتبع الطلب" : "Track Order"}</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">{t("footer.returnPolicy")}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t("footer.aboutLink")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">{t("footer.about")}</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">{t("footer.shop")}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t("blog.title")}</Link></li>
              <li><Link to="/vip" className="hover:text-white transition-colors">{t("footer.vipProgram")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
              {t("footer.copyright")}
            </p>
            <span className="text-[10px] sm:text-xs text-gray-500">www.greengrassstore.com</span>
          </div>
          {/* Developer Credit - PERMANENT - Cannot be changed */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Developed by{" "}
              <a
                href="https://www.websearchbd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                Web Search BD
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
