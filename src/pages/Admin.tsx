import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, LayoutDashboard, FileText, Users, Settings, ShoppingBag, MessageSquare, BarChart3, Image, Upload, FolderOpen, FileSpreadsheet } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";

// Admin Dashboard Components
import { BlogManager } from "@/components/admin/BlogManager";
import { CustomRequestsManager } from "@/components/admin/CustomRequestsManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { ProductImporter } from "@/components/admin/ProductImporter";
import { BlogImporter } from "@/components/admin/BlogImporter";
import { FileManager } from "@/components/admin/FileManager";

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <Badge className="bg-primary text-primary-foreground">Admin</Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your store content, users, and settings
          </p>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1 h-auto p-1 bg-muted/50">
            <TabsTrigger value="overview" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="import-products" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="import-blog" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">Import</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 py-2 px-2 text-xs sm:text-sm">
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          {/* Custom Requests Tab */}
          <TabsContent value="requests">
            <CustomRequestsManager />
          </TabsContent>

          {/* Media Library Tab */}
          <TabsContent value="media">
            <MediaLibrary />
          </TabsContent>

          {/* File Manager Tab */}
          <TabsContent value="files">
            <FileManager />
          </TabsContent>

          {/* Product Import Tab */}
          <TabsContent value="import-products">
            <ProductImporter />
          </TabsContent>

          {/* Blog Import Tab */}
          <TabsContent value="import-blog">
            <BlogImporter />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Configure your store settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Store settings will be available here. For now, manage your products and collections directly in Shopify Admin.
                </p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Open Shopify Admin
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
