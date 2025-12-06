import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types for all site settings
export interface AnnouncementBarSettings {
  enabled: boolean;
  backgroundColor: string;
  textColor: string;
  autoRotate: boolean;
  rotationSpeed: number;
  announcements: {
    id: string;
    text: string;
    textAr: string;
    link: string;
    isActive: boolean;
    order: number;
  }[];
}

export interface HeroSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonTextAr: string;
  secondaryButtonLink: string;
  backgroundImage: string;
}

export interface GiftSectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
  items: {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
    href: string;
  }[];
}

export interface PromoSectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  discountText: string;
  discountTextAr: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
  backgroundImage: string;
  backgroundColor: string;
}

export interface FooterSettings {
  description: string;
  descriptionAr: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export interface BrandingSettings {
  logoUrl: string;
  faviconUrl: string;
  siteName: string;
  siteNameAr: string;
  tagline: string;
  taglineAr: string;
}

export interface WhatsAppSettings {
  phone: string;
  enabled: boolean;
  welcomeMessage: string;
}

export interface SalesAgentSettings {
  enabled: boolean;
  name: string;
  responses: Record<string, string>;
}

export interface StoreInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SiteSettingsContextType {
  announcementBar: AnnouncementBarSettings;
  hero: HeroSettings;
  giftSection: GiftSectionSettings;
  promoSection: PromoSectionSettings;
  footer: FooterSettings;
  branding: BrandingSettings;
  whatsapp: WhatsAppSettings;
  salesAgent: SalesAgentSettings;
  storeInfo: StoreInfo;
  loading: boolean;
  refetch: () => Promise<void>;
}

// Default values
const defaultAnnouncementBar: AnnouncementBarSettings = {
  enabled: true,
  backgroundColor: "#2d5a3d",
  textColor: "#ffffff",
  autoRotate: true,
  rotationSpeed: 5000,
  announcements: [
    { id: '1', text: 'Shop Now, Pay Later With Tabby', textAr: 'تسوق الآن وادفع لاحقاً مع تابي', link: '', isActive: true, order: 1 },
    { id: '2', text: 'Free Delivery on Orders Above AED 200', textAr: 'توصيل مجاني للطلبات فوق 200 درهم', link: '', isActive: true, order: 2 },
  ]
};

const defaultHero: HeroSettings = {
  enabled: true,
  title: "Bring Nature",
  titleAr: "أحضر الطبيعة",
  subtitle: "Into Your Home",
  subtitleAr: "إلى منزلك",
  description: "Discover our premium collection of plants, pots, and home décor designed for UAE homes.",
  descriptionAr: "اكتشف مجموعتنا المميزة من النباتات والأواني وديكور المنزل المصممة لمنازل الإمارات.",
  buttonText: "Shop Now",
  buttonTextAr: "تسوق الآن",
  buttonLink: "/shop",
  secondaryButtonText: "View Sale",
  secondaryButtonTextAr: "عرض التخفيضات",
  secondaryButtonLink: "/shop?collection=sale",
  backgroundImage: ""
};

const defaultGiftSection: GiftSectionSettings = {
  enabled: true,
  title: "Gift Garden",
  titleAr: "حديقة الهدايا",
  subtitle: "Thoughtfully curated gift sets for plant lovers",
  subtitleAr: "مجموعات هدايا منسقة بعناية لمحبي النباتات",
  buttonText: "View All Gifts",
  buttonTextAr: "عرض جميع الهدايا",
  buttonLink: "/shop?category=gifts",
  items: []
};

const defaultPromoSection: PromoSectionSettings = {
  enabled: true,
  title: "November Sale",
  titleAr: "تخفيضات نوفمبر",
  subtitle: "Up to 50% Off",
  subtitleAr: "خصم يصل إلى 50%",
  discountText: "Limited Time Offer",
  discountTextAr: "عرض لفترة محدودة",
  buttonText: "Shop Sale",
  buttonTextAr: "تسوق التخفيضات",
  buttonLink: "/shop?category=sale",
  backgroundImage: "",
  backgroundColor: "#2d5a3d"
};

const defaultFooter: FooterSettings = {
  description: "We craft timeless pieces that blend elegance and functionality, elevating every space into a masterpiece.",
  descriptionAr: "نصنع قطعًا خالدة تمزج بين الأناقة والوظائف، ترتقي بكل مساحة إلى تحفة فنية.",
  socialLinks: {
    instagram: "https://www.instagram.com/greengrass_decor",
    facebook: "https://www.facebook.com/greengrassstore",
    whatsapp: "+971547751901"
  }
};

const defaultBranding: BrandingSettings = {
  logoUrl: "",
  faviconUrl: "",
  siteName: "Green Grass",
  siteNameAr: "جرين جراس",
  tagline: "Plants & Pots Store",
  taglineAr: "متجر النباتات والأواني"
};

const defaultWhatsApp: WhatsAppSettings = {
  phone: "+971547751901",
  enabled: true,
  welcomeMessage: "Hello! Welcome to Green Grass Store. How can we help you today?"
};

const defaultSalesAgent: SalesAgentSettings = {
  enabled: true,
  name: "Sales Assistant",
  responses: {}
};

const defaultStoreInfo: StoreInfo = {
  name: "Green Grass Store",
  email: "info@greengrassstore.com",
  phone: "+971547751901",
  address: "Dubai, UAE"
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  announcementBar: defaultAnnouncementBar,
  hero: defaultHero,
  giftSection: defaultGiftSection,
  promoSection: defaultPromoSection,
  footer: defaultFooter,
  branding: defaultBranding,
  whatsapp: defaultWhatsApp,
  salesAgent: defaultSalesAgent,
  storeInfo: defaultStoreInfo,
  loading: true,
  refetch: async () => {}
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [announcementBar, setAnnouncementBar] = useState(defaultAnnouncementBar);
  const [hero, setHero] = useState(defaultHero);
  const [giftSection, setGiftSection] = useState(defaultGiftSection);
  const [promoSection, setPromoSection] = useState(defaultPromoSection);
  const [footer, setFooter] = useState(defaultFooter);
  const [branding, setBranding] = useState(defaultBranding);
  const [whatsapp, setWhatsapp] = useState(defaultWhatsApp);
  const [salesAgent, setSalesAgent] = useState(defaultSalesAgent);
  const [storeInfo, setStoreInfo] = useState(defaultStoreInfo);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      data?.forEach((setting) => {
        const value = setting.setting_value as Record<string, unknown>;
        switch (setting.setting_key) {
          case 'announcement_bar':
            setAnnouncementBar(value as unknown as AnnouncementBarSettings);
            break;
          case 'hero_section':
            setHero(value as unknown as HeroSettings);
            break;
          case 'gift_section':
            setGiftSection(value as unknown as GiftSectionSettings);
            break;
          case 'promo_section':
            setPromoSection(value as unknown as PromoSectionSettings);
            break;
          case 'footer_content':
            setFooter(value as unknown as FooterSettings);
            break;
          case 'branding':
            setBranding(value as unknown as BrandingSettings);
            break;
          case 'whatsapp':
            setWhatsapp(value as unknown as WhatsAppSettings);
            break;
          case 'sales_agent':
            setSalesAgent(value as unknown as SalesAgentSettings);
            break;
          case 'store_info':
            setStoreInfo(value as unknown as StoreInfo);
            break;
        }
      });
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        announcementBar,
        hero,
        giftSection,
        promoSection,
        footer,
        branding,
        whatsapp,
        salesAgent,
        storeInfo,
        loading,
        refetch: fetchSettings
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};