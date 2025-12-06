import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, LayoutDashboard, Settings } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

// Admin Dashboard Components
import { BlogManager } from "@/components/admin/BlogManager";
import { CustomRequestsManager } from "@/components/admin/CustomRequestsManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { SubscribersManager } from "@/components/admin/SubscribersManager";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { APISettingsManager } from "@/components/admin/APISettingsManager";
import { AnnouncementManager } from "@/components/admin/AnnouncementManager";
import { LocalCategoryManager } from "@/components/admin/LocalCategoryManager";
import { HomepageSectionsManager } from "@/components/admin/HomepageSectionsManager";
import { PagesContentManager } from "@/components/admin/PagesContentManager";
import { MegaMenuManager } from "@/components/admin/MegaMenuManager";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { HeroSliderManager } from "@/components/admin/HeroSliderManager";
import { PopupManager } from "@/components/admin/PopupManager";
import { CouponManager } from "@/components/admin/CouponManager";
import { PaymentSettingsManager } from "@/components/admin/PaymentSettingsManager";
import { TrackingPixelManager } from "@/components/admin/TrackingPixelManager";
import { AnalyticsReport } from "@/components/admin/AnalyticsReport";
import { EmailTemplateManager } from "@/components/admin/EmailTemplateManager";
import { FooterMenuManager } from "@/components/admin/FooterMenuManager";
import { SMTPSettingsManager } from "@/components/admin/SMTPSettingsManager";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading, checkRole } = useAdminStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setAuthLoading(false);
      
      if (user) {
        await checkRole();
      }
    };
    
    checkAuth();
  }, [checkRole]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <DashboardOverview onNavigate={setActiveTab} />
            <AnalyticsReport />
          </div>
        );
      case "products":
        return <ProductManager />;
      case "categories":
        return <LocalCategoryManager />;
      case "orders":
        return <OrdersManager />;
      case "customers":
        return <CustomerManager />;
      case "blog":
        return <BlogManager />;
      case "subscribers":
        return <SubscribersManager />;
      case "requests":
        return <CustomRequestsManager />;
      case "media":
        return <MediaLibrary />;
      case "announcements":
        return <AnnouncementManager />;
      case "homepage":
        return (
          <div className="space-y-6">
            <HeroSliderManager />
            <HomepageSectionsManager />
          </div>
        );
      case "megamenu":
        return <MegaMenuManager />;
      case "pages":
        return <PagesContentManager />;
      case "content":
        return <SiteContentManager />;
      case "footer":
        return <FooterMenuManager />;
      case "popups":
        return <PopupManager />;
      case "coupons":
        return <CouponManager />;
      case "settings":
        return (
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
              <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm">Users & Roles</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
              <TabsTrigger value="tracking" className="text-xs sm:text-sm">Tracking</TabsTrigger>
              <TabsTrigger value="api" className="text-xs sm:text-sm">API & Security</TabsTrigger>
              <TabsTrigger value="smtp" className="text-xs sm:text-sm">SMTP / Email</TabsTrigger>
              <TabsTrigger value="templates" className="text-xs sm:text-sm">Email Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="m-0">
              <SiteSettingsManager />
            </TabsContent>
            
            <TabsContent value="users" className="m-0">
              <UsersManager />
            </TabsContent>
            
            <TabsContent value="payments" className="m-0">
              <PaymentSettingsManager />
            </TabsContent>
            
            <TabsContent value="tracking" className="m-0">
              <TrackingPixelManager />
            </TabsContent>
            
            <TabsContent value="api" className="m-0">
              <APISettingsManager />
            </TabsContent>
            
            <TabsContent value="smtp" className="m-0">
              <SMTPSettingsManager />
            </TabsContent>
            
            <TabsContent value="templates" className="m-0">
              <EmailTemplateManager />
            </TabsContent>
          </Tabs>
        );
      default:
        return <DashboardOverview />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      overview: "Dashboard Overview",
      products: "Product Management",
      categories: "Category Management",
      orders: "Order Management",
      customers: "Customer Management",
      blog: "Blog Management",
      subscribers: "Newsletter Subscribers",
      requests: "Custom Requests",
      media: "Media Library",
      announcements: "Announcement Bar",
      homepage: "Homepage Sections",
      megamenu: "Mega Menu",
      pages: "Pages Content",
      content: "Branding & Content",
      footer: "Footer Menu",
      popups: "Popup Notifications",
      coupons: "Discount Coupons",
      settings: "Settings",
    };
    return titles[activeTab] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-lg shadow-primary/20 w-fit">
                  <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    {getPageTitle()}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your store content, users, and settings
                  </p>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-4 sm:p-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
