import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopifyProductGrid } from "@/components/products/ShopifyProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16 md:pb-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Shopify Products - Featured Products */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <ShopifyProductGrid 
              title="Our Collection" 
              subtitle="Discover our curated selection of premium plants and home décor" 
              limit={12} 
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
