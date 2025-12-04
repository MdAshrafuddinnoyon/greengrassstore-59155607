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

// Import category banner images
import heroChair from "@/assets/hero-chair.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";
import womanPlant from "@/assets/woman-plant.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import ikebana from "@/assets/ikebana.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
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
          description="Beautiful containers in terracotta, ceramic, and modern designs"
          image={heroChair}
          href="/pots"
          layout="left"
          bgColor="bg-[#f8f8f5]"
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
          description="From hanging planters to floor stands"
          image={hangingPlants}
          href="/planters"
          layout="right"
          bgColor="bg-[#f0f4f0]"
        />

        {/* HOMECARE Section */}
        <ProductSection
          title="HOMECARE"
          subtitle="Plant Care Essentials"
          products={homecareProducts}
          viewAllLink="/homecare"
        />

        {/* VASES Banner */}
        <CategoryBanner
          title="VASES"
          subtitle="Decorative"
          description="Elegant vases for every style"
          image={bluePot}
          href="/vases"
          layout="center"
        />

        {/* VASES Products */}
        <ProductSection
          title="VASES"
          subtitle="Decorative"
          products={vasesProducts}
          viewAllLink="/vases"
        />

        {/* Homecare Banner */}
        <CategoryBanner
          title="Homecare"
          subtitle="Essential Care"
          description="Everything you need to keep your plants healthy"
          image={womanPlant}
          href="/homecare"
          layout="center"
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
