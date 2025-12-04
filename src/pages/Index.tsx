import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopifyProductGrid } from "@/components/products/ShopifyProductGrid";
import { CategoryBanner } from "@/components/home/CategoryBanner";
import { PromoSection } from "@/components/home/PromoSection";
import { GiftSection } from "@/components/home/GiftSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { BlogSection } from "@/components/home/BlogSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";

// Import category banner images
import hangingPlants from "@/assets/hanging-plants.jpg";
import womanPlant from "@/assets/woman-plant.jpg";
import bluePot from "@/assets/blue-pot.jpg";
import plantPot from "@/assets/plant-pot.jpg";
import ficusPlant from "@/assets/ficus-plant.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16 md:pb-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Grid */}
        <CategoriesGrid />

        {/* Shopify Products - Featured Products */}
        <ShopifyProductGrid title="Featured Products" subtitle="Our Best Sellers" limit={8} />

        {/* PLANTS Banner */}
        <CategoryBanner
          title="PLANTS"
          subtitle="Indoor & Outdoor Collection"
          description="Transform your space with our beautiful collection of artificial and real plants"
          image={ficusPlant}
          href="/shop?category=plants"
          layout="left"
          bgColor="bg-secondary"
        />

        {/* POTS Banner */}
        <CategoryBanner
          title="POTS"
          subtitle="Designer Collection"
          description="Beautiful containers in fiber, ceramic, and terracotta designs"
          image={plantPot}
          href="/shop?category=pots"
          layout="right"
          bgColor="bg-accent"
        />

        {/* Sale Banner */}
        <PromoSection />

        {/* GREENERY Banner */}
        <CategoryBanner
          title="GREENERY"
          subtitle="Green Walls & Bunches"
          description="Create stunning vertical gardens and lush green spaces"
          image={hangingPlants}
          href="/shop?category=greenery"
          layout="center"
        />

        {/* VASES Banner */}
        <CategoryBanner
          title="VASES"
          subtitle="Decorative Collection"
          description="Elegant vases for every style and occasion"
          image={bluePot}
          href="/shop?category=vases"
          layout="left"
          bgColor="bg-muted"
        />

        {/* Hanging Plants Banner */}
        <CategoryBanner
          title="HANGING PLANTS"
          subtitle="Vertical Gardens"
          description="Beautiful hanging solutions for your space"
          image={womanPlant}
          href="/shop?category=hanging"
          layout="center"
        />

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
