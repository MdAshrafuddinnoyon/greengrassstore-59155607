import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp, ShoppingBag, Package, Receipt, Plus, Eye, BarChart3, MessageSquare, FolderOpen, Megaphone } from "lucide-react";
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
  pendingOrders: number;
  totalCategories: number;
}

interface DashboardOverviewProps {
  onNavigate?: (tab: string) => void;
}

export const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalUsers: 0,
    totalViews: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCategories: 0,
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

        const { count: pendingOrders } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Fetch categories count
        const { count: totalCategories } = await supabase
          .from("categories")
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
          pendingOrders: pendingOrders || 0,
          totalCategories: totalCategories || 0,
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
      bgGradient: "from-emerald-500/10 to-emerald-500/5",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtext: `${stats.pendingOrders} pending`,
      icon: Receipt,
      color: "bg-blue-500",
      bgGradient: "from-blue-500/10 to-blue-500/5",
    },
    {
      title: "Blog Posts",
      value: stats.totalPosts,
      subtext: `${stats.publishedPosts} published`,
      icon: FileText,
      color: "bg-purple-500",
      bgGradient: "from-purple-500/10 to-purple-500/5",
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
      subtext: "Total accounts",
      icon: Users,
      color: "bg-orange-500",
      bgGradient: "from-orange-500/10 to-orange-500/5",
    },
    {
      title: "Custom Requests",
      value: stats.totalRequests,
      subtext: `${stats.pendingRequests} pending`,
      icon: MessageSquare,
      color: "bg-pink-500",
      bgGradient: "from-pink-500/10 to-pink-500/5",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      subtext: "Active categories",
      icon: FolderOpen,
      color: "bg-teal-500",
      bgGradient: "from-teal-500/10 to-teal-500/5",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Add Product",
      description: "Create new product",
      tab: "products",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      icon: FileText,
      title: "New Blog Post",
      description: "Write article",
      tab: "blog",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: Eye,
      title: "View Orders",
      description: `${stats.pendingOrders} pending`,
      tab: "orders",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: MessageSquare,
      title: "View Requests",
      description: `${stats.pendingRequests} pending`,
      tab: "requests",
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      icon: FolderOpen,
      title: "Categories",
      description: "Manage categories",
      tab: "categories",
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      icon: Megaphone,
      title: "Announcements",
      description: "Update top bar",
      tab: "announcements",
      color: "bg-amber-500 hover:bg-amber-600",
    },
  ];

  const handleQuickAction = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
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
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.tab)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} text-white transition-all hover:scale-105 shadow-lg`}
              >
                <action.icon className="w-6 h-6" />
                <div className="text-center">
                  <span className="text-sm font-semibold block">{action.title}</span>
                  <span className="text-xs text-white/80">{action.description}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5 text-blue-500" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>View orders tab for detailed order management</p>
              <button
                onClick={() => handleQuickAction("orders")}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Go to Orders →
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-pink-500" />
              Custom Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{stats.pendingRequests} pending requests need attention</p>
              <button
                onClick={() => handleQuickAction("requests")}
                className="mt-3 text-sm text-primary hover:underline"
              >
                View Requests →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
