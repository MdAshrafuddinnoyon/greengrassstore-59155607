import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopifyProductGrid } from "@/components/products/ShopifyProductGrid";
import { DynamicCategoryBanners } from "@/components/home/DynamicCategoryBanners";
import { PromoSection } from "@/components/home/PromoSection";
import { GiftSection } from "@/components/home/GiftSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { BlogSection } from "@/components/home/BlogSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";

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
        <ShopifyProductGrid title="Featured Products" subtitle="Our Best Sellers" limit={8} />

        {/* Dynamic Category Banners from Shopify Collections */}
        <DynamicCategoryBanners limit={4} excludeHandles={["sale"]} />

        {/* Sale Banner */}
        <PromoSection />

        {/* Gift Garden Section */}
        <GiftSection />

        {/* Blog Section */}
        <BlogSection />

        {/* Instagram Feed */}
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
