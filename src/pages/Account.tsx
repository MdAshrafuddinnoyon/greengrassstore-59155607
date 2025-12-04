import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, Phone, Mail, Package, Heart, LogOut, Edit2, Save, Loader2, ChevronRight, Settings, Trash2, ShoppingBag, FileText, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWishlistStore, WishlistItem } from "@/stores/wishlistStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomRequestModal } from "@/components/custom-request/CustomRequestModal";
import { toast } from "sonner";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface CustomRequest {
  id: string;
  title: string;
  description: string;
  requirement_type: string;
  status: string;
  created_at: string;
  budget: string | null;
  timeline: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
}

const Account = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isArabic = language === "ar";
  const { items: wishlistItems, fetchWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlistStore();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        } else {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchWishlist();
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
        fetchWishlist();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchWishlist]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setCity(data.city || "");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          address,
          city,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, full_name: fullName, phone, address, city } : null);
      setIsEditing(false);
      toast.success(t("account.profileUpdated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(t("account.loggedOut"));
    navigate("/");
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success(isArabic ? "تمت الإزالة من المفضلة" : "Removed from wishlist");
    }
  };

  const fetchCustomRequests = async () => {
    if (!user) return;
    setRequestsLoading(true);
    try {
      const { data, error } = await supabase
        .from("custom_requirements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "requests" && user) {
      fetchCustomRequests();
    }
  }, [activeTab, user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return t("account.requestCompleted");
      case "processing": return t("account.requestProcessing");
      case "cancelled": return t("account.requestCancelled");
      default: return t("account.requestPending");
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, { en: string; ar: string }> = {
      custom_plant: { en: "Custom Plant", ar: "نباتات مخصصة" },
      bulk_order: { en: "Bulk Order", ar: "طلب بالجملة" },
      corporate_gift: { en: "Corporate Gift", ar: "هدايا الشركات" },
      event_decoration: { en: "Event Decoration", ar: "تزيين المناسبات" },
      landscaping: { en: "Landscaping", ar: "تنسيق الحدائق" },
      other: { en: "Other", ar: "أخرى" },
    };
    return types[type]?.[isArabic ? "ar" : "en"] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: t("account.profile"), icon: User },
    { id: "orders", label: t("account.orders"), icon: Package },
    { id: "wishlist", label: t("account.wishlist"), icon: Heart, count: wishlistItems.length },
    { id: "requests", label: t("account.myRequests"), icon: FileText, count: customRequests.length },
    { id: "settings", label: t("account.settings"), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-6 md:py-12 pb-24 md:pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-xl md:text-3xl font-display font-semibold text-foreground">
              {t("account.myAccount")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t("account.manageProfile")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block">
              <div className="bg-card rounded-2xl border border-border p-4 sticky top-24">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{profile?.full_name || t("account.guest")}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeTab === tab.id ? "bg-white/20" : "bg-primary/10 text-primary"
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  {t("account.logout")}
                </button>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden mb-6">
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all snap-start flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`text-xs px-1.5 rounded-full ${
                        activeTab === tab.id ? "bg-white/20" : "bg-primary/10 text-primary"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      {t("account.personalInfo")}
                    </h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Edit2 className="w-4 h-4" />
                        {t("account.edit")}
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {t("account.save")}
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        {t("account.fullName")}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{fullName || "-"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        {t("account.email")}
                      </label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        {t("account.phone")}
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{phone || "-"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        {t("account.city")}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{city || "-"}</span>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        {t("account.address")}
                      </label>
                      {isEditing ? (
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                      ) : (
                        <div className="flex items-start gap-2 px-4 py-3 bg-muted rounded-xl">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <span className="text-foreground">{address || "-"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t("account.myOrders")}
                  </h2>
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t("account.noOrders")}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t("account.myWishlist")}
                  </h2>
                  
                  {wishlistLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">{t("account.noWishlist")}</p>
                      <Link 
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {wishlistItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative bg-muted rounded-xl overflow-hidden"
                        >
                          <div className="aspect-square">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Heart className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 mb-1">
                              {item.product_title}
                            </h4>
                            {item.product_price && (
                              <p className="text-xs sm:text-sm font-bold text-primary">{item.product_price}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.product_id)}
                            className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t("account.accountSettings")}
                  </h2>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                      <span className="text-foreground">{t("account.changePassword")}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                      <span className="text-foreground">{t("account.notifications")}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors md:hidden"
                    >
                      <LogOut className="w-5 h-5" />
                      {t("account.logout")}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "requests" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      {t("account.myRequests")}
                    </h2>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      {isArabic ? "طলب جديد" : "New Request"}
                    </button>
                  </div>
                  
                  {requestsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : customRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">{t("account.noRequests")}</p>
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        {t("account.submitRequest")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {customRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 sm:p-4 bg-muted rounded-xl"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                  {getTypeLabel(request.requirement_type)}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {getStatusIcon(request.status)}
                                  {getStatusLabel(request.status)}
                                </span>
                              </div>
                              <h4 className="font-medium text-foreground mb-1 text-sm sm:text-base">{request.title}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-muted-foreground">
                                <span>
                                  {new Date(request.created_at).toLocaleDateString(isArabic ? "ar-AE" : "en-AE", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                  })}
                                </span>
                                {request.budget && (
                                  <span>{isArabic ? "الميزانية:" : "Budget:"} {request.budget}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Custom Request Modal */}
      <CustomRequestModal
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          fetchCustomRequests();
        }}
        user={user ? { id: user.id, email: user.email || "" } : null}
      />
    </div>
  );
};

export default Account;