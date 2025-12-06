import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopifyProductGrid } from "@/components/products/ShopifyProductGrid";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { PromoSection } from "@/components/home/PromoSection";
import { BlogSection } from "@/components/home/BlogSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { FAQSection } from "@/components/home/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16 md:pb-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Grid - Dynamic from Shopify Collections */}
        <CategoriesGrid />

        {/* Shopify Products - Featured Products */}
        <section className="py-16 md:py-20 bg-background">
          <ShopifyProductGrid 
            title="Our Collection" 
            subtitle="Discover our curated selection of premium plants and home décor" 
            limit={8} 
          />
        </section>

        {/* Sale Banner */}
        <PromoSection />

        {/* Blog Section */}
        <BlogSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Instagram Feed */}
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
