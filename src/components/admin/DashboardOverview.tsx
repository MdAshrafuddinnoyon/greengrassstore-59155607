import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, MessageSquare, Eye, TrendingUp, ShoppingBag, Package, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  totalRequests: number;
  pendingRequests: number;
  totalUsers: number;
  totalViews: number;
  totalProducts: number;
  totalOrders: number;
}

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalUsers: 0,
    totalViews: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch blog posts count
        const { count: totalPosts } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true });

        const { count: publishedPosts } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");

        // Fetch total views
        const { data: viewsData } = await supabase
          .from("blog_posts")
          .select("view_count");
        
        const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

        // Fetch custom requests count
        const { count: totalRequests } = await supabase
          .from("custom_requirements")
          .select("*", { count: "exact", head: true });

        const { count: pendingRequests } = await supabase
          .from("custom_requirements")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Fetch profiles count (as proxy for users)
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch products count
        const { count: totalProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Fetch orders count
        const { count: totalOrders } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          totalRequests: totalRequests || 0,
          pendingRequests: pendingRequests || 0,
          totalUsers: totalUsers || 0,
          totalViews,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      subtext: "Active products",
      icon: Package,
      color: "bg-emerald-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtext: "All orders",
      icon: Receipt,
      color: "bg-blue-500",
    },
    {
      title: "Blog Posts",
      value: stats.totalPosts,
      subtext: `${stats.publishedPosts} published`,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
      subtext: "Total accounts",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  // Navigate to products tab with add mode
  const handleAddProduct = () => {
    // Scroll to products tab
    const productsTab = document.querySelector('[value="products"]') as HTMLButtonElement;
    if (productsTab) {
      productsTab.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={handleAddProduct}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Add Product</span>
            </div>
            <div 
              onClick={() => {
                const blogTab = document.querySelector('[value="blog"]') as HTMLButtonElement;
                if (blogTab) blogTab.click();
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">New Blog Post</span>
            </div>
            <div 
              onClick={() => {
                const requestsTab = document.querySelector('[value="requests"]') as HTMLButtonElement;
                if (requestsTab) requestsTab.click();
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">View Requests</span>
            </div>
            <div 
              onClick={() => {
                const ordersTab = document.querySelector('[value="orders"]') as HTMLButtonElement;
                if (ordersTab) ordersTab.click();
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <Receipt className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">View Orders</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
