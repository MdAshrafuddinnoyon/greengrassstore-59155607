import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedCategorySection } from "@/components/home/FeaturedCategorySection";
import { LocalProductGrid } from "@/components/products/LocalProductGrid";
import { PromoSection } from "@/components/home/PromoSection";
import { BlogSection } from "@/components/home/BlogSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { FAQSection } from "@/components/home/FAQSection";
<<<<<<< HEAD
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { GiftSection } from "@/components/home/GiftSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
<<<<<<< HEAD
      <main className="pb-20 md:pb-0">
=======
      <main className="pb-16 md:pb-0">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        {/* Hero Section */}
        <HeroSection />

        {/* Icon Categories - Simple browsing */}
        <CategoriesGrid />

        {/* Featured Categories with Banner + Product Slider */}
        <FeaturedCategorySection />

        {/* Local Products - All Products */}
        <section className="py-12 md:py-20 bg-background">
          <LocalProductGrid 
            title="Our Collection" 
            titleAr="مجموعتنا"
            subtitle="Discover our curated selection of premium plants and home décor"
            subtitleAr="اكتشف مجموعتنا المختارة من النباتات الفاخرة وديكور المنزل"
            limit={8} 
          />
        </section>

        {/* Gift Section */}
        <GiftSection />

        {/* Sale Banner */}
        <PromoSection />

        {/* Blog Section */}
        <BlogSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Instagram Feed */}
        <InstagramSection />
      </main>
<<<<<<< HEAD
      <MobileBottomNav />
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      <Footer />
    </div>
  );
};

export default Index;
