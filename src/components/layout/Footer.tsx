import { Facebook, Instagram, Twitter, Leaf, MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-display text-xl md:text-2xl mb-2">
              {t("footer.newsletter")}
            </h3>
            <p className="text-background/50 text-xs mb-4">
              Get updates on new arrivals, exclusive offers and plant care tips.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.email")}
                className="flex-1 px-3 py-2 bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-background/40 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <Leaf className="w-4 h-4" />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold tracking-wider">GREEN</span>
                <span className="text-xs font-semibold tracking-wider">GRASS</span>
              </div>
            </div>
            <p className="text-background/50 text-xs mb-4 max-w-[200px]">
              Your one-stop destination for indoor & outdoor greenery in Dubai.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-7 h-7 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook className="w-3 h-3" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="w-3 h-3" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-medium mb-3">Shop</h4>
            <ul className="space-y-2 text-xs text-background/50">
              <li><a href="/plants" className="hover:text-background transition-colors">{t("nav.plants")}</a></li>
              <li><a href="/pots" className="hover:text-background transition-colors">{t("nav.pots")}</a></li>
              <li><a href="/planters" className="hover:text-background transition-colors">{t("nav.planters")}</a></li>
              <li><a href="/vases" className="hover:text-background transition-colors">{t("nav.vases")}</a></li>
              <li><a href="/homecare" className="hover:text-background transition-colors">{t("nav.homecare")}</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-medium mb-3">Help</h4>
            <ul className="space-y-2 text-xs text-background/50">
              <li><a href="/about" className="hover:text-background transition-colors">{t("footer.about")}</a></li>
              <li><a href="/contact" className="hover:text-background transition-colors">{t("footer.contact")}</a></li>
              <li><a href="/shipping" className="hover:text-background transition-colors">{t("footer.shipping")}</a></li>
              <li><a href="/faq" className="hover:text-background transition-colors">{t("footer.faq")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-medium mb-3">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-xs text-background/50">
              <li className="flex items-start gap-2">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                <span>Al Quoz Industrial Area 3, Dubai, UAE</span>
              </li>
              <li>
                <a href="tel:+97145551234" className="flex items-center gap-2 hover:text-background transition-colors">
                  <Phone className="w-3 h-3" />
                  +971 4 555 1234
                </a>
              </li>
              <li>
                <a href="mailto:hello@greengrass.ae" className="flex items-center gap-2 hover:text-background transition-colors">
                  <Mail className="w-3 h-3" />
                  hello@greengrass.ae
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-background/40">
            <p>© 2025 Green Grass. {t("footer.rights")}.</p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-background transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
