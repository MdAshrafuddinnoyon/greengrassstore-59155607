import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram, Facebook, Twitter } from "lucide-react";
import logo from "@/assets/logo.jpg";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-2 md:col-span-1">
            <img src={logo} alt="Green Grass" className="h-12 w-auto mb-4 bg-white p-1 rounded" />
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Your premium destination for plants, pots, and home garden essentials in Dubai.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/plants" className="hover:text-white transition-colors">{t("nav.plants")}</a></li>
              <li><a href="/pots" className="hover:text-white transition-colors">{t("nav.pots")}</a></li>
              <li><a href="/planters" className="hover:text-white transition-colors">{t("nav.planters")}</a></li>
              <li><a href="/vases" className="hover:text-white transition-colors">{t("nav.vases")}</a></li>
              <li><a href="/homecare" className="hover:text-white transition-colors">{t("nav.homecare")}</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium mb-4">Information</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="/returns" className="hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>www.greengrassstore.com</li>
              <li>Dubai, UAE</li>
              <li>info@greengrassstore.com</li>
              <li>+971 4 XXX XXXX</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2024 Green Grass Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
