import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.plants": "Plants",
    "nav.flowers": "Flowers",
    "nav.pots": "Pots",
    "nav.greenery": "Greenery",
    "nav.planters": "Planters",
    "nav.vases": "Vases",
    "nav.homecare": "Homecare",
    "nav.hanging": "Hanging",
    "nav.gifts": "Gifts",
    "nav.sale": "Sale",
    
    // Hero
    "hero.title": "Plants, Planters & Pots",
    "hero.subtitle": "Your one-stop destination for indoor & outdoor greenery",
    "hero.cta": "Shop Now",
    "hero.tagline": "Plants That Look Real & Thrive Without Maintenance in UAE Homes",
    
    // Categories
    "categories.title": "Shop Our Collections",
    "categories.browse": "Browse by Category",
    
    // Sections
    "section.plants": "Plants",
    "section.plants.desc": "Bring nature indoors",
    "section.pots": "Pots",
    "section.pots.desc": "Beautiful containers for your plants",
    "section.planters": "Planters",
    "section.planters.desc": "Elegant plant displays",
    "section.vases": "Vases",
    "section.vases.desc": "Decorative flower holders",
    "section.homecare": "Homecare",
    "section.homecare.desc": "Plant care essentials",
    "section.featured": "Featured Products",
    "section.bestSellers": "Our Best Sellers",
    
    // Products
    "product.addToCart": "Add to Cart",
    "product.quickView": "Quick View",
    "product.sale": "Sale",
    "product.new": "New",
    "product.soldOut": "Sold Out",
    "product.orderWhatsapp": "Order via WhatsApp",
    "product.noProducts": "No products found",
    
    // CTA
    "cta.shopAll": "Shop All",
    "cta.viewMore": "View More",
    "cta.learnMore": "Learn More",
    "cta.shopNow": "Shop Now",
    "cta.viewAll": "View All",
    "cta.explore": "Explore",
    
    // Promo
    "promo.title": "November Sale",
    "promo.subtitle": "Up to 30% off on selected items",
    "promo.cta": "Shop Sale",
    "promo.limitedTime": "Limited Time Offer",
    
    // Gift
    "gift.title": "Gift Garden",
    "gift.subtitle": "Perfect presents for plant lovers",
    "gift.desc": "Curated gift sets and vouchers available",
    "gift.viewAll": "View All Gifts",
    
    // Blog
    "blog.title": "Latest Articles",
    "blog.subtitle": "From Our Blog",
    "blog.readMore": "Read More",
    "blog.viewAll": "View All Posts",
    
    // Footer
    "footer.about": "About Us",
    "footer.contact": "Contact",
    "footer.shipping": "Shipping & Returns",
    "footer.faq": "FAQ",
    "footer.newsletter": "Subscribe to our newsletter",
    "footer.email": "Enter your email",
    "footer.subscribe": "Subscribe",
    "footer.rights": "All rights reserved",
    "footer.location": "Dubai, UAE",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    
    // Common
    "common.currency": "AED",
    "common.search": "Search",
    "common.cart": "Cart",
    "common.account": "Account",
    "common.home": "Home",
    "common.categories": "Categories",
    "common.freeDelivery": "Free Delivery",
    "common.qualityAssured": "Quality Assured",
    "common.freshPlants": "Fresh Plants",
    
    // 404 Page
    "404.title": "Oops! Page Not Found",
    "404.description": "The page you're looking for seems to have wandered off into the garden. Let's get you back on track.",
    "404.goHome": "Go to Home",
    "404.browseProducts": "Browse Products",
    "404.goBack": "Go Back",
    
    // Auth
    "auth.welcomeBack": "Welcome Back",
    "auth.createAccount": "Create Account",
    "auth.loginSubtitle": "Sign in to access your account",
    "auth.signupSubtitle": "Join us and start shopping",
    "auth.continueGoogle": "Continue with Google",
    "auth.or": "or",
    "auth.fullName": "Full Name",
    "auth.fullNamePlaceholder": "Enter your full name",
    "auth.email": "Email",
    "auth.emailPlaceholder": "Enter your email",
    "auth.password": "Password",
    "auth.passwordPlaceholder": "Enter your password",
    "auth.login": "Sign In",
    "auth.signup": "Sign Up",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.signupLink": "Sign Up",
    "auth.loginLink": "Sign In",
    "auth.loginSuccess": "Welcome back!",
    "auth.signupSuccess": "Account created successfully!",
    "auth.userExists": "This email is already registered",
    "auth.invalidCredentials": "Invalid email or password",
    
    // Account
    "account.myAccount": "My Account",
    "account.manageProfile": "Manage your profile and preferences",
    "account.profile": "Profile",
    "account.orders": "Orders",
    "account.wishlist": "Wishlist",
    "account.settings": "Settings",
    "account.logout": "Logout",
    "account.guest": "Guest",
    "account.personalInfo": "Personal Information",
    "account.edit": "Edit",
    "account.save": "Save",
    "account.fullName": "Full Name",
    "account.email": "Email",
    "account.phone": "Phone",
    "account.city": "City",
    "account.address": "Address",
    "account.profileUpdated": "Profile updated successfully",
    "account.loggedOut": "Logged out successfully",
    "account.myOrders": "My Orders",
    "account.noOrders": "You haven't placed any orders yet",
    "account.myWishlist": "My Wishlist",
    "account.noWishlist": "Your wishlist is empty",
    "account.accountSettings": "Account Settings",
    "account.changePassword": "Change Password",
    "account.notifications": "Notifications",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.getInTouch": "Get in Touch",
    "contact.subtitle": "We'd love to hear from you",
    "contact.name": "Your Name",
    "contact.email": "Your Email",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.phone": "Phone",
    "contact.address": "Address",
    "contact.hours": "Working Hours",
  },
  ar: {
    // Navigation
    "nav.plants": "نباتات",
    "nav.flowers": "زهور",
    "nav.pots": "أواني",
    "nav.greenery": "خضرة",
    "nav.planters": "مزهريات",
    "nav.vases": "مزهريات زجاجية",
    "nav.homecare": "العناية المنزلية",
    "nav.hanging": "معلق",
    "nav.gifts": "هدايا",
    "nav.sale": "تخفيضات",
    
    // Hero
    "hero.title": "نباتات ومزهريات وأواني",
    "hero.subtitle": "وجهتك الشاملة للنباتات الداخلية والخارجية",
    "hero.cta": "تسوق الآن",
    "hero.tagline": "نباتات تبدو حقيقية وتزدهر دون صيانة في منازل الإمارات",
    
    // Categories
    "categories.title": "تسوق مجموعاتنا",
    "categories.browse": "تصفح حسب الفئة",
    
    // Sections
    "section.plants": "نباتات",
    "section.plants.desc": "أحضر الطبيعة للداخل",
    "section.pots": "أواني",
    "section.pots.desc": "حاويات جميلة لنباتاتك",
    "section.planters": "مزهريات",
    "section.planters.desc": "عروض نباتية أنيقة",
    "section.vases": "مزهريات زجاجية",
    "section.vases.desc": "حاملات الزهور الزخرفية",
    "section.homecare": "العناية المنزلية",
    "section.homecare.desc": "أساسيات العناية بالنباتات",
    "section.featured": "المنتجات المميزة",
    "section.bestSellers": "الأكثر مبيعاً",
    
    // Products
    "product.addToCart": "أضف إلى السلة",
    "product.quickView": "عرض سريع",
    "product.sale": "تخفيض",
    "product.new": "جديد",
    "product.soldOut": "نفذ",
    "product.orderWhatsapp": "اطلب عبر واتساب",
    "product.noProducts": "لم يتم العثور على منتجات",
    
    // CTA
    "cta.shopAll": "تسوق الكل",
    "cta.viewMore": "عرض المزيد",
    "cta.learnMore": "اعرف المزيد",
    "cta.shopNow": "تسوق الآن",
    "cta.viewAll": "عرض الكل",
    "cta.explore": "استكشف",
    
    // Promo
    "promo.title": "تخفيضات نوفمبر",
    "promo.subtitle": "خصم يصل إلى 30٪ على منتجات مختارة",
    "promo.cta": "تسوق التخفيضات",
    "promo.limitedTime": "عرض لفترة محدودة",
    
    // Gift
    "gift.title": "حديقة الهدايا",
    "gift.subtitle": "هدايا مثالية لمحبي النباتات",
    "gift.desc": "مجموعات هدايا وقسائم متاحة",
    "gift.viewAll": "عرض جميع الهدايا",
    
    // Blog
    "blog.title": "أحدث المقالات",
    "blog.subtitle": "من مدونتنا",
    "blog.readMore": "اقرأ المزيد",
    "blog.viewAll": "عرض جميع المقالات",
    
    // Footer
    "footer.about": "من نحن",
    "footer.contact": "اتصل بنا",
    "footer.shipping": "الشحن والإرجاع",
    "footer.faq": "الأسئلة الشائعة",
    "footer.newsletter": "اشترك في نشرتنا الإخبارية",
    "footer.email": "أدخل بريدك الإلكتروني",
    "footer.subscribe": "اشترك",
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.location": "دبي، الإمارات",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    
    // Common
    "common.currency": "د.إ",
    "common.search": "بحث",
    "common.cart": "السلة",
    "common.account": "الحساب",
    "common.home": "الرئيسية",
    "common.categories": "الفئات",
    "common.freeDelivery": "توصيل مجاني",
    "common.qualityAssured": "جودة مضمونة",
    "common.freshPlants": "نباتات طازجة",
    
    // 404 Page
    "404.title": "عفواً! الصفحة غير موجودة",
    "404.description": "يبدو أن الصفحة التي تبحث عنها قد ضاعت في الحديقة. دعنا نعيدك إلى المسار الصحيح.",
    "404.goHome": "الذهاب للرئيسية",
    "404.browseProducts": "تصفح المنتجات",
    "404.goBack": "العودة",
    
    // Auth
    "auth.welcomeBack": "مرحباً بعودتك",
    "auth.createAccount": "إنشاء حساب",
    "auth.loginSubtitle": "سجل الدخول للوصول إلى حسابك",
    "auth.signupSubtitle": "انضم إلينا وابدأ التسوق",
    "auth.continueGoogle": "المتابعة مع جوجل",
    "auth.or": "أو",
    "auth.fullName": "الاسم الكامل",
    "auth.fullNamePlaceholder": "أدخل اسمك الكامل",
    "auth.email": "البريد الإلكتروني",
    "auth.emailPlaceholder": "أدخل بريدك الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.passwordPlaceholder": "أدخل كلمة المرور",
    "auth.login": "تسجيل الدخول",
    "auth.signup": "إنشاء حساب",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.haveAccount": "لديك حساب بالفعل؟",
    "auth.signupLink": "إنشاء حساب",
    "auth.loginLink": "تسجيل الدخول",
    "auth.loginSuccess": "مرحباً بعودتك!",
    "auth.signupSuccess": "تم إنشاء الحساب بنجاح!",
    "auth.userExists": "هذا البريد الإلكتروني مسجل بالفعل",
    "auth.invalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    
    // Account
    "account.myAccount": "حسابي",
    "account.manageProfile": "إدارة ملفك الشخصي والتفضيلات",
    "account.profile": "الملف الشخصي",
    "account.orders": "الطلبات",
    "account.wishlist": "المفضلة",
    "account.settings": "الإعدادات",
    "account.logout": "تسجيل الخروج",
    "account.guest": "ضيف",
    "account.personalInfo": "المعلومات الشخصية",
    "account.edit": "تعديل",
    "account.save": "حفظ",
    "account.fullName": "الاسم الكامل",
    "account.email": "البريد الإلكتروني",
    "account.phone": "الهاتف",
    "account.city": "المدينة",
    "account.address": "العنوان",
    "account.profileUpdated": "تم تحديث الملف الشخصي بنجاح",
    "account.loggedOut": "تم تسجيل الخروج بنجاح",
    "account.myOrders": "طلباتي",
    "account.noOrders": "لم تقم بأي طلبات بعد",
    "account.myWishlist": "قائمة المفضلة",
    "account.noWishlist": "قائمة المفضلة فارغة",
    "account.accountSettings": "إعدادات الحساب",
    "account.changePassword": "تغيير كلمة المرور",
    "account.notifications": "الإشعارات",
    
    // Contact
    "contact.title": "اتصل بنا",
    "contact.getInTouch": "تواصل معنا",
    "contact.subtitle": "يسعدنا سماع رأيك",
    "contact.name": "اسمك",
    "contact.email": "بريدك الإلكتروني",
    "contact.message": "الرسالة",
    "contact.send": "إرسال الرسالة",
    "contact.phone": "الهاتف",
    "contact.address": "العنوان",
    "contact.hours": "ساعات العمل",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
