import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, LayoutDashboard, FileText, Users, Settings, ShoppingBag, MessageSquare, BarChart3, Image, Receipt, Mail, Palette, Key, Megaphone, Sparkles, FolderTree, LayoutTemplate } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";

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
import { AIImageGenerator } from "@/components/admin/AIImageGenerator";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { HomepageSectionsManager } from "@/components/admin/HomepageSectionsManager";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading, checkRole } = useAdminStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <Badge className="bg-primary/10 text-primary border-0 font-medium">Admin</Badge>
          </div>
          <p className="text-slate-500 ml-14">
            Manage your store content, users, and settings
          </p>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2">
            <TabsList className="flex flex-wrap w-full gap-1 h-auto bg-transparent">
              <TabsTrigger value="overview" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <FolderTree className="w-4 h-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="ai-generator" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AI Image</span>
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribers</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Requests</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">TopBar</span>
              </TabsTrigger>
              <TabsTrigger value="homepage" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <LayoutTemplate className="w-4 h-4" />
                <span className="hidden sm:inline">Homepage</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-1.5 py-2.5 px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <TabsContent value="overview" className="m-0">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="products" className="m-0">
              <ProductManager />
            </TabsContent>

            <TabsContent value="categories" className="m-0">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="orders" className="m-0">
              <OrdersManager />
            </TabsContent>

            <TabsContent value="blog" className="m-0">
              <BlogManager />
            </TabsContent>

            <TabsContent value="ai-generator" className="m-0">
              <AIImageGenerator />
            </TabsContent>

            <TabsContent value="subscribers" className="m-0">
              <SubscribersManager />
            </TabsContent>

            <TabsContent value="requests" className="m-0">
              <CustomRequestsManager />
            </TabsContent>

            <TabsContent value="media" className="m-0">
              <MediaLibrary />
            </TabsContent>

            <TabsContent value="users" className="m-0">
              <UsersManager />
            </TabsContent>

            <TabsContent value="announcements" className="m-0">
              <AnnouncementManager />
            </TabsContent>

            <TabsContent value="homepage" className="m-0">
              <HomepageSectionsManager />
            </TabsContent>

            <TabsContent value="content" className="m-0">
              <SiteContentManager />
            </TabsContent>

            <TabsContent value="settings" className="m-0">
              <SiteSettingsManager />
            </TabsContent>

            <TabsContent value="api" className="m-0">
              <APISettingsManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
