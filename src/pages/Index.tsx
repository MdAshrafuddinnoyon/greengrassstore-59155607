import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { Features } from "@/components/home/Features";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Testimonials } from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <ProductGallery />
        <FeaturedCollections />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
