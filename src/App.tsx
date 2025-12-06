import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteSettingsProvider, useSiteSettings } from "@/contexts/SiteSettingsContext";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import { LocalCompareDrawer } from "@/components/compare/LocalCompareDrawer";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ReturnPolicy from "./pages/ReturnPolicy";
import VIPProgram from "./pages/VIPProgram";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import FAQ from "./pages/FAQ";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import Maintenance from "./pages/Maintenance";
import Install from "./pages/Install";

const queryClient = new QueryClient();

// Wrapper component to handle maintenance mode
const MaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { securitySettings } = useSiteSettings();
  
  // Check if maintenance mode is enabled
  const isMaintenanceMode = securitySettings?.maintenanceMode === true;
  
  // Allow access to admin route even in maintenance mode
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isMaintenanceMode && !isAdminRoute) {
    return <Maintenance />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MaintenanceWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/returns" element={<ReturnPolicy />} />
          <Route path="/vip" element={<VIPProgram />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/install" element={<Install />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MaintenanceWrapper>
      <FloatingActionMenu />
      <LocalCompareDrawer />
      <MobileBottomNav />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SiteSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </SiteSettingsProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
