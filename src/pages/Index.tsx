import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductSection } from "@/components/products/ProductSection";
import { CategoryBanner } from "@/components/home/CategoryBanner";
import { PromoSection } from "@/components/home/PromoSection";
import { GiftSection } from "@/components/home/GiftSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import {
  plantsProducts,
  potsProducts,
  plantersProducts,
  vasesProducts,
  homecareProducts,
} from "@/data/products";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* PLANTS Section */}
        <ProductSection
          title="PLANTS"
          subtitle="Indoor & Outdoor"
          products={plantsProducts}
          viewAllLink="/plants"
        />

        {/* POTS Banner */}
        <CategoryBanner
          title="POTS"
          subtitle="Collection"
          description="Beautiful containers in terracotta, ceramic, and modern designs for every plant"
          image="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80"
          href="/pots"
          layout="left"
          bgColor="bg-secondary"
        />

        {/* POTS Products */}
        <ProductSection
          title="POTS"
          subtitle="Shop by Style"
          products={potsProducts}
          viewAllLink="/pots"
        />

        {/* PLANTERS Banner */}
        <CategoryBanner
          title="PLANTERS"
          subtitle="Elegant Displays"
          description="From hanging planters to floor stands, find the perfect display for your greenery"
          image="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80"
          href="/planters"
          layout="right"
          bgColor="bg-muted"
        />

        {/* VASES Section */}
        <ProductSection
          title="VASES"
          subtitle="Decorative"
          products={vasesProducts}
          viewAllLink="/vases"
        />

        {/* HOMECARE Section */}
        <ProductSection
          title="HOMECARE"
          subtitle="Plant Care Essentials"
          products={homecareProducts}
          viewAllLink="/homecare"
        />

        {/* November Sale Banner */}
        <PromoSection />

        {/* Gift Garden Section */}
        <GiftSection />

        {/* Instagram Feed */}
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
