import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, RefreshCw, Image as ImageIcon, Gift, Tag, Sparkles, Grid, Package, Instagram, X, Plus } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
<<<<<<< HEAD
import { plantsProducts, potsProducts, plantersProducts, vasesProducts, homecareProducts } from "@/data/products";
// Build a map of categoryId to products for use in the category config UI
function getProductsByCategory(categories: {id: string, name: string}[]) {
  // Combine all product arrays
  const allProducts = [
    ...plantsProducts,
    ...potsProducts,
    ...plantersProducts,
    ...vasesProducts,
    ...homecareProducts,
  ];
  // Only include products with featured: true
  const map: { [catId: string]: { id: string, name: string }[] } = {};
  categories.forEach(cat => {
    map[cat.id] = allProducts.filter(p => {
      const isFeatured = p.featured === true;
      if (!isFeatured) return false;
      if (cat.slug && p.category && typeof p.category === 'string') {
        return p.category.toLowerCase().replace(/\s+/g, '-') === cat.slug;
      }
      return p.category === cat.name;
    }).map(p => ({ id: p.id, name: p.name }));
  });
  return map;
}
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066

interface HeroSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonTextAr: string;
  secondaryButtonLink: string;
  backgroundImage: string;
}

interface GiftSectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
<<<<<<< HEAD
  itemsLimit: number;
  categorySlug: string; // নতুন ক্যাটাগরি সিলেক্টর
  backgroundImage: string; // ব্যাকগ্রাউন্ড ইমেজ
}


// Remove duplicate/conflicting interface above. Use the one below with categoryConfigs.
interface CategoryConfig {
  image: string;
  buttonText: string;
  buttonLink: string;
  selectedProducts: string[];
}

interface FeaturedCategorySectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  categoriesLimit: number;
  productsPerCategory: number;
  showBadges: boolean;
  selectedCategories: string[];
  layout: 'grid' | 'carousel';
  showCategoryBanner: boolean;
  categoryConfigs: {
    [categoryId: string]: CategoryConfig;
  };
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
}

interface PromoSectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  discountText: string;
  discountTextAr: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonTextAr: string;
  secondaryButtonLink: string;
  backgroundImage: string;
  backgroundColor: string;
}

interface FeaturedCategorySectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  categoriesLimit: number;
  productsPerCategory: number;
  showBadges: boolean;
  selectedCategories: string[];
<<<<<<< HEAD
  layout: 'grid' | 'carousel';
  showCategoryBanner: boolean;
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
}

interface CollectionSectionSettings {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  productsLimit: number;
  showFeaturedOnly: boolean;
<<<<<<< HEAD
  layout: 'grid-3' | 'grid-4' | 'grid-5';
  showQuickView: boolean;
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
}

interface InstagramSectionSettings {
  enabled: boolean;
  username: string;
  profileUrl: string;
  title: string;
  images: string[];
}

export const HomepageSectionsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

<<<<<<< HEAD
  // Build productsByCategory for use in select dropdowns (after categories is defined)
  const productsByCategory = getProductsByCategory(categories);

=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    enabled: true,
    title: "Bring Nature",
    titleAr: "أحضر الطبيعة",
    subtitle: "Into Your Home",
    subtitleAr: "إلى منزلك",
    description: "Discover our premium collection of plants, pots, and home décor designed for UAE homes.",
    descriptionAr: "اكتشف مجموعتنا المميزة من النباتات والأواني وديكور المنزل المصممة لمنازل الإمارات.",
    buttonText: "Shop Now",
    buttonTextAr: "تسوق الآن",
    buttonLink: "/shop",
    secondaryButtonText: "View Sale",
    secondaryButtonTextAr: "عرض التخفيضات",
    secondaryButtonLink: "/shop?collection=sale",
    backgroundImage: ""
  });

  const [giftSettings, setGiftSettings] = useState<GiftSectionSettings>({
    enabled: true,
    title: "Gift Garden",
    titleAr: "حديقة الهدايا",
    subtitle: "Thoughtfully curated gift sets for plant lovers",
    subtitleAr: "مجموعات هدايا منسقة بعناية لمحبي النباتات",
    buttonText: "View All Gifts",
    buttonTextAr: "عرض جميع الهدايا",
<<<<<<< HEAD
    buttonLink: "/shop?category=gifts",
    itemsLimit: 6
=======
    buttonLink: "/shop?category=gifts"
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  });

  const [promoSettings, setPromoSettings] = useState<PromoSectionSettings>({
    enabled: true,
    title: "Special Sale",
    titleAr: "عرض خاص",
    subtitle: "Up to 40% off on selected plants, pots, and accessories.",
    subtitleAr: "خصم يصل إلى 40% على النباتات والأواني والإكسسوارات المختارة.",
    discountText: "Limited Time Offer",
    discountTextAr: "عرض لفترة محدودة",
    buttonText: "Shop Sale",
    buttonTextAr: "تسوق التخفيضات",
    buttonLink: "/shop?category=sale",
    secondaryButtonText: "View All Products",
    secondaryButtonTextAr: "عرض جميع المنتجات",
    secondaryButtonLink: "/shop",
    backgroundImage: "",
    backgroundColor: "#2d5a3d"
  });

  const [featuredCategorySettings, setFeaturedCategorySettings] = useState<FeaturedCategorySectionSettings>({
    enabled: true,
    title: "Featured Categories",
    titleAr: "الفئات المميزة",
    categoriesLimit: 4,
    productsPerCategory: 6,
    showBadges: true,
<<<<<<< HEAD
    selectedCategories: [],
    layout: 'carousel',
    showCategoryBanner: true
=======
    selectedCategories: []
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  });

  const [collectionSettings, setCollectionSettings] = useState<CollectionSectionSettings>({
    enabled: true,
    title: "Our Collection",
    titleAr: "مجموعتنا",
    subtitle: "Discover our curated selection of premium plants and home décor",
    subtitleAr: "اكتشف مجموعتنا المختارة من النباتات الفاخرة وديكور المنزل",
    productsLimit: 8,
<<<<<<< HEAD
    showFeaturedOnly: false,
    layout: 'grid-4',
    showQuickView: true
=======
    showFeaturedOnly: false
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  });

  const [instagramSettings, setInstagramSettings] = useState<InstagramSectionSettings>({
    enabled: true,
    username: "@greengrassstore",
    profileUrl: "https://instagram.com/greengrassstore",
    title: "GREEN GRASS",
    images: []
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order');
<<<<<<< HEAD
      if (Array.isArray(catData)) setCategories(catData);
=======
      
      if (catData) setCategories(catData);
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066

      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      data?.forEach((setting) => {
<<<<<<< HEAD
        const value = setting?.setting_value || {};
        if (setting?.setting_key === 'hero_section') {
          setHeroSettings({ ...heroSettings, ...value });
        } else if (setting?.setting_key === 'gift_section') {
          setGiftSettings({ ...giftSettings, ...value });
        } else if (setting?.setting_key === 'promo_section') {
          setPromoSettings({ ...promoSettings, ...value });
        } else if (setting?.setting_key === 'featured_category_section') {
          // Migrate old settings if needed
          if (!('categoryConfigs' in value)) {
            setFeaturedCategorySettings({
              ...featuredCategorySettings,
              ...(value as any),
              categoryConfigs: {},
            });
          } else {
            setFeaturedCategorySettings({ ...featuredCategorySettings, ...value });
          }
        } else if (setting?.setting_key === 'collection_section') {
          setCollectionSettings({ ...collectionSettings, ...value });
        } else if (setting?.setting_key === 'instagram_section') {
          setInstagramSettings({ ...instagramSettings, ...value });
        }
      });
    } catch (error) {
      // Hide raw error from users, just log for dev
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error fetching settings:', error);
      }
=======
        const value = setting.setting_value as Record<string, unknown>;
        if (setting.setting_key === 'hero_section') {
          setHeroSettings(value as unknown as HeroSettings);
        } else if (setting.setting_key === 'gift_section') {
          setGiftSettings(value as unknown as GiftSectionSettings);
        } else if (setting.setting_key === 'promo_section') {
          setPromoSettings(value as unknown as PromoSectionSettings);
        } else if (setting.setting_key === 'featured_category_section') {
          setFeaturedCategorySettings(value as unknown as FeaturedCategorySectionSettings);
        } else if (setting.setting_key === 'collection_section') {
          setCollectionSettings(value as unknown as CollectionSectionSettings);
        } else if (setting.setting_key === 'instagram_section') {
          setInstagramSettings(value as unknown as InstagramSectionSettings);
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (key: string, value: object) => {
    setSaving(true);
    try {
<<<<<<< HEAD
      // For featured_category_section, clean up configs for only selected categories
      let toSave = value;
      if (key === 'featured_category_section') {
        const v = value as FeaturedCategorySectionSettings;
        const cleanedConfigs: { [categoryId: string]: CategoryConfig } = {};
        v.selectedCategories.forEach(catId => {
          cleanedConfigs[catId] = v.categoryConfigs?.[catId] || {
            image: '',
            buttonText: 'Shop Now',
            buttonLink: '',
            selectedProducts: [],
          };
        });
        toSave = { ...v, categoryConfigs: cleanedConfigs };
      }
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', key)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
<<<<<<< HEAD
          .update({ setting_value: JSON.parse(JSON.stringify(toSave)) })
=======
          .update({ setting_value: JSON.parse(JSON.stringify(value)) })
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
          .eq('setting_key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
<<<<<<< HEAD
          .insert({ setting_key: key, setting_value: JSON.parse(JSON.stringify(toSave)) });
=======
          .insert({ setting_key: key, setting_value: JSON.parse(JSON.stringify(value)) });
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        if (error) throw error;
      }
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 w-full">
          <TabsTrigger value="hero" className="flex-1 min-w-[50px] gap-1 text-xs sm:text-sm py-2">
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex-1 min-w-[50px] gap-1 text-xs sm:text-sm py-2">
            <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="collection" className="flex-1 min-w-[50px] gap-1 text-xs sm:text-sm py-2">
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Collection</span>
          </TabsTrigger>
          <TabsTrigger value="gift" className="flex-1 min-w-[50px] gap-1 text-xs sm:text-sm py-2">
            <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Gift</span>
          </TabsTrigger>
          <TabsTrigger value="promo" className="flex-1 min-w-[50px] gap-1 text-xs sm:text-sm py-2">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Promo</span>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex-1 min-w-[50px] gap-1 text-xs sm:text-sm py-2">
            <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Instagram</span>
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Hero Section
              </CardTitle>
              <CardDescription>
                Manage the main hero banner on homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Hero Section</Label>
                  <p className="text-sm text-muted-foreground">Show/hide hero banner</p>
                </div>
                <Switch
                  checked={heroSettings.enabled}
                  onCheckedChange={(checked) => 
                    setHeroSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={heroSettings.title}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (AR)</Label>
                  <Input
                    value={heroSettings.titleAr}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle (EN)</Label>
                  <Input
                    value={heroSettings.subtitle}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (AR)</Label>
                  <Input
                    value={heroSettings.subtitleAr}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description (EN)</Label>
                  <Textarea
                    value={heroSettings.description}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (AR)</Label>
                  <Textarea
                    value={heroSettings.descriptionAr}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Button Text (EN)</Label>
                  <Input
                    value={heroSettings.buttonText}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button Text (AR)</Label>
                  <Input
                    value={heroSettings.buttonTextAr}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, buttonTextAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button Link</Label>
                  <Input
                    value={heroSettings.buttonLink}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, buttonLink: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Secondary Button Text (EN)</Label>
                  <Input
                    value={heroSettings.secondaryButtonText || ''}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, secondaryButtonText: e.target.value }))}
                    placeholder="e.g., View Sale"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Text (AR)</Label>
                  <Input
                    value={heroSettings.secondaryButtonTextAr || ''}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, secondaryButtonTextAr: e.target.value }))}
                    dir="rtl"
                    placeholder="عرض التخفيضات"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Link</Label>
                  <Input
                    value={heroSettings.secondaryButtonLink || ''}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, secondaryButtonLink: e.target.value }))}
                    placeholder="/shop?collection=sale"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <MediaPicker
                  value={heroSettings.backgroundImage}
                  onChange={(url) => setHeroSettings(prev => ({ ...prev, backgroundImage: url }))}
                />
              </div>

              <Button 
                onClick={() => saveSettings('hero_section', heroSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Hero Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Categories Section */}
        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-primary" />
                Featured Categories Section
              </CardTitle>
              <CardDescription>
                Manage the category banners with product carousels on homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
<<<<<<< HEAD
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
=======
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                <div>
                  <Label>Enable Featured Categories</Label>
                  <p className="text-sm text-muted-foreground">Show category banners with products</p>
                </div>
<<<<<<< HEAD
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={featuredCategorySettings.enabled}
                      onCheckedChange={(checked) => 
                        setFeaturedCategorySettings(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                    <Label className="text-sm">Enabled</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={featuredCategorySettings.showFeaturedOnly}
                      onCheckedChange={(checked) => 
                        setFeaturedCategorySettings(prev => ({ ...prev, showFeaturedOnly: checked }))
                      }
                    />
                    <Label className="text-sm">Show Only Featured Products</Label>
                  </div>
                </div>
=======
                <Switch
                  checked={featuredCategorySettings.enabled}
                  onCheckedChange={(checked) => 
                    setFeaturedCategorySettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section Title (EN)</Label>
                  <Input
                    value={featuredCategorySettings.title}
                    onChange={(e) => setFeaturedCategorySettings(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Title (AR)</Label>
                  <Input
                    value={featuredCategorySettings.titleAr}
                    onChange={(e) => setFeaturedCategorySettings(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

<<<<<<< HEAD
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
=======
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                <div className="space-y-2">
                  <Label>Categories to Show</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={featuredCategorySettings.categoriesLimit}
                    onChange={(e) => setFeaturedCategorySettings(prev => ({ ...prev, categoriesLimit: parseInt(e.target.value) || 4 }))}
                  />
<<<<<<< HEAD
                  <p className="text-xs text-muted-foreground">Max categories to display</p>
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </div>
                <div className="space-y-2">
                  <Label>Products per Category</Label>
                  <Input
                    type="number"
                    min={3}
                    max={12}
                    value={featuredCategorySettings.productsPerCategory}
                    onChange={(e) => setFeaturedCategorySettings(prev => ({ ...prev, productsPerCategory: parseInt(e.target.value) || 6 }))}
                  />
<<<<<<< HEAD
                  <p className="text-xs text-muted-foreground">Products shown in each category</p>
                </div>
                <div className="space-y-2">
                  <Label>Layout Style</Label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    title="Select layout style"
                    value={featuredCategorySettings.layout}
                    onChange={(e) =>
                      setFeaturedCategorySettings(prev => ({ ...prev, layout: e.target.value as 'grid' | 'carousel' }))
                    }
                  >
                    <option value="carousel">Carousel (Scrollable)</option>
                    <option value="grid">Grid Layout</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Product display style</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={featuredCategorySettings.showBadges}
                      onCheckedChange={(checked) => 
                        setFeaturedCategorySettings(prev => ({ ...prev, showBadges: checked }))
                      }
                    />
                    <Label className="text-sm">Show Sale/New Badges</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={featuredCategorySettings.showCategoryBanner}
                      onCheckedChange={(checked) => 
                        setFeaturedCategorySettings(prev => ({ ...prev, showCategoryBanner: checked }))
                      }
                    />
                    <Label className="text-sm">Show Category Banner</Label>
                  </div>
=======
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={featuredCategorySettings.showBadges}
                    onCheckedChange={(checked) => 
                      setFeaturedCategorySettings(prev => ({ ...prev, showBadges: checked }))
                    }
                  />
                  <Label>Show Sale/New Badges</Label>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </div>
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <Label>Configure Categories</Label>
                <p className="text-sm text-muted-foreground mb-2">For each category, set banner image, button, and select products to feature.</p>
                <div className="space-y-4">
                  {featuredCategorySettings.selectedCategories.map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    if (!cat) return null;
                    // Find or create per-category config
                    const catConfig = featuredCategorySettings.categoryConfigs?.[catId] || {
                      image: '',
                      buttonText: 'Shop Now',
                      buttonLink: `/shop?category=${cat.slug}`,
                      selectedProducts: []
                    };
                    return (
                      <div key={catId} className="border rounded-lg p-4 space-y-2 bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{cat.name}</span>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setFeaturedCategorySettings(prev => ({ ...prev, selectedCategories: prev.selectedCategories.filter(id => id !== catId) }))}>Remove</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Banner Image</Label>
                            <MediaPicker
                              value={catConfig.image}
                              onChange={url => setFeaturedCategorySettings(prev => ({
                                ...prev,
                                categoryConfigs: {
                                  ...prev.categoryConfigs,
                                  [catId]: { ...catConfig, image: url }
                                }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                              value={catConfig.buttonText}
                              onChange={e => setFeaturedCategorySettings(prev => ({
                                ...prev,
                                categoryConfigs: {
                                  ...prev.categoryConfigs,
                                  [catId]: { ...catConfig, buttonText: e.target.value }
                                }
                              }))}
                            />
                            <Label>Button Link</Label>
                            <Input
                              value={catConfig.buttonLink}
                              onChange={e => setFeaturedCategorySettings(prev => ({
                                ...prev,
                                categoryConfigs: {
                                  ...prev.categoryConfigs,
                                  [catId]: { ...catConfig, buttonLink: e.target.value }
                                }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Select Products</Label>
                            <select
                              multiple
                              className="w-full h-32 border rounded"
                              title="Select products for this category"
                              value={catConfig.selectedProducts}
                              onChange={e => {
                                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                                setFeaturedCategorySettings(prev => ({
                                  ...prev,
                                  categoryConfigs: {
                                    ...prev.categoryConfigs,
                                    [catId]: { ...catConfig, selectedProducts: selected }
                                  }
                                }));
                              }}
                            >
                              {(productsByCategory[catId] || []).map(prod => (
                                <option key={prod.id} value={prod.id}>{prod.name}</option>
                              ))}
                            </select>
                            <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple products</p>
                              {/* Show selected product names */}
                              {catConfig.selectedProducts.length > 0 && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Selected Products:</span>
                                  <ul className="list-disc ml-5">
                                    {catConfig.selectedProducts.map(pid => {
                                      const prod = (productsByCategory[catId] || []).find(p => p.id === pid);
                                      return prod ? <li key={pid}>{prod.name}</li> : null;
                                    })}
                                  </ul>
                                  <Button size="sm" variant="outline" className="mt-2" onClick={() => {
                                    setFeaturedCategorySettings(prev => ({
                                      ...prev,
                                      categoryConfigs: {
                                        ...prev.categoryConfigs,
                                        [catId]: { ...catConfig, selectedProducts: [] }
                                      }
                                    }));
                                  }}>Clear Selection</Button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {categories.filter(cat => !featuredCategorySettings.selectedCategories.includes(cat.id)).map(cat => (
                      <Button key={cat.id} variant="outline" onClick={() => setFeaturedCategorySettings(prev => ({ ...prev, selectedCategories: [...prev.selectedCategories, cat.id] }))}>{cat.name}</Button>
                    ))}
                  </div>
=======
                <Label>Select Categories to Display</Label>
                <p className="text-sm text-muted-foreground mb-2">Leave empty to auto-select from active categories</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50">
                      <input
                        type="checkbox"
                        checked={featuredCategorySettings.selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeaturedCategorySettings(prev => ({
                              ...prev,
                              selectedCategories: [...prev.selectedCategories, cat.id]
                            }));
                          } else {
                            setFeaturedCategorySettings(prev => ({
                              ...prev,
                              selectedCategories: prev.selectedCategories.filter(id => id !== cat.id)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('featured_category_section', featuredCategorySettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Featured Categories Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collection Section */}
        <TabsContent value="collection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Our Collection Section
              </CardTitle>
              <CardDescription>
                Manage the product collection grid on homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Collection Section</Label>
                  <p className="text-sm text-muted-foreground">Show product collection on homepage</p>
                </div>
                <Switch
                  checked={collectionSettings.enabled}
                  onCheckedChange={(checked) => 
                    setCollectionSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={collectionSettings.title}
                    onChange={(e) => setCollectionSettings(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (AR)</Label>
                  <Input
                    value={collectionSettings.titleAr}
                    onChange={(e) => setCollectionSettings(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle (EN)</Label>
                  <Textarea
                    value={collectionSettings.subtitle}
                    onChange={(e) => setCollectionSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (AR)</Label>
                  <Textarea
                    value={collectionSettings.subtitleAr}
                    onChange={(e) => setCollectionSettings(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>

<<<<<<< HEAD
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
=======
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                <div className="space-y-2">
                  <Label>Products to Display</Label>
                  <Input
                    type="number"
                    min={4}
                    max={24}
<<<<<<< HEAD
                    step={4}
                    value={collectionSettings.productsLimit}
                    onChange={(e) => setCollectionSettings(prev => ({ ...prev, productsLimit: parseInt(e.target.value) || 8 }))}
                  />
                  <p className="text-xs text-muted-foreground">Total products shown (multiples of 4)</p>
                </div>
                <div className="space-y-2">
                  <Label>Grid Layout</Label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    title="Select collection grid layout"
                    value={collectionSettings.layout}
                    onChange={(e) =>
                      setCollectionSettings(prev => ({ ...prev, layout: e.target.value as 'grid-3' | 'grid-4' | 'grid-5' }))
                    }
                  >
                    <option value="grid-3">3 Columns (Large Cards)</option>
                    <option value="grid-4">4 Columns (Default)</option>
                    <option value="grid-5">5 Columns (Compact)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Desktop layout columns</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={collectionSettings.showFeaturedOnly}
                      onCheckedChange={(checked) => 
                        setCollectionSettings(prev => ({ ...prev, showFeaturedOnly: checked }))
                      }
                    />
                    <Label className="text-sm">Featured Products Only</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={collectionSettings.showQuickView}
                      onCheckedChange={(checked) => 
                        setCollectionSettings(prev => ({ ...prev, showQuickView: checked }))
                      }
                    />
                    <Label className="text-sm">Enable Quick View</Label>
                  </div>
=======
                    value={collectionSettings.productsLimit}
                    onChange={(e) => setCollectionSettings(prev => ({ ...prev, productsLimit: parseInt(e.target.value) || 8 }))}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={collectionSettings.showFeaturedOnly}
                    onCheckedChange={(checked) => 
                      setCollectionSettings(prev => ({ ...prev, showFeaturedOnly: checked }))
                    }
                  />
                  <Label>Show Featured Products Only</Label>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('collection_section', collectionSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Collection Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gift Section */}
        <TabsContent value="gift">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Gift Section
              </CardTitle>
              <CardDescription>
                Manage the Gift Garden section on homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Gift Section</Label>
                  <p className="text-sm text-muted-foreground">Show/hide gift section</p>
                </div>
                <Switch
                  checked={giftSettings.enabled}
                  onCheckedChange={(checked) => 
                    setGiftSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={giftSettings.title}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (AR)</Label>
                  <Input
                    value={giftSettings.titleAr}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle (EN)</Label>
                  <Textarea
                    value={giftSettings.subtitle}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (AR)</Label>
                  <Textarea
                    value={giftSettings.subtitleAr}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>

<<<<<<< HEAD

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Products to Display</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={giftSettings.itemsLimit}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, itemsLimit: Number(e.target.value) || 1 }))}
                  />
                  <p className="text-xs text-muted-foreground">Control how many gift products appear on the homepage.</p>
                </div>
                <div className="space-y-2">
                  <Label>Gift Category</Label>
                  <select
                    className="w-full border rounded px-2 py-2 text-sm"
                    title="Select gift category"
                    value={giftSettings.categorySlug || ''}
                    onChange={e => setGiftSettings(prev => ({ ...prev, categorySlug: e.target.value }))}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">Choose which category's products to display in Gift section.</p>
                </div>
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <MediaPicker
                    value={giftSettings.backgroundImage}
                    onChange={url => setGiftSettings(prev => ({ ...prev, backgroundImage: url }))}
                  />
                  <p className="text-xs text-muted-foreground">Set a custom background image for the Gift section.</p>
                </div>
              </div>

=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Button Text (EN)</Label>
                  <Input
                    value={giftSettings.buttonText}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Text (AR)</Label>
                  <Input
                    value={giftSettings.buttonTextAr}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, buttonTextAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input
                    value={giftSettings.buttonLink}
                    onChange={(e) => setGiftSettings(prev => ({ ...prev, buttonLink: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('gift_section', giftSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Gift Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Section */}
        <TabsContent value="promo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Promo/Sale Section
              </CardTitle>
              <CardDescription>
                Manage promotional banners and sale sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Promo Section</Label>
                  <p className="text-sm text-muted-foreground">Show/hide promo banner</p>
                </div>
                <Switch
                  checked={promoSettings.enabled}
                  onCheckedChange={(checked) => 
                    setPromoSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={promoSettings.title}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (AR)</Label>
                  <Input
                    value={promoSettings.titleAr}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, titleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description (EN)</Label>
                  <Textarea
                    value={promoSettings.subtitle}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (AR)</Label>
                  <Textarea
                    value={promoSettings.subtitleAr}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Label (EN)</Label>
                  <Input
                    value={promoSettings.discountText}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, discountText: e.target.value }))}
                    placeholder="Limited Time Offer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount Label (AR)</Label>
                  <Input
                    value={promoSettings.discountTextAr}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, discountTextAr: e.target.value }))}
                    placeholder="عرض لفترة محدودة"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Button Text (EN)</Label>
                  <Input
                    value={promoSettings.buttonText}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button Text (AR)</Label>
                  <Input
                    value={promoSettings.buttonTextAr}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, buttonTextAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button Link</Label>
                  <Input
                    value={promoSettings.buttonLink}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, buttonLink: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Secondary Button Text (EN)</Label>
                  <Input
                    value={promoSettings.secondaryButtonText}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, secondaryButtonText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Text (AR)</Label>
                  <Input
                    value={promoSettings.secondaryButtonTextAr}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, secondaryButtonTextAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Link</Label>
                  <Input
                    value={promoSettings.secondaryButtonLink}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, secondaryButtonLink: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <MediaPicker
                  value={promoSettings.backgroundImage}
                  onChange={(url) => setPromoSettings(prev => ({ ...prev, backgroundImage: url }))}
                />
              </div>

              <Button 
                onClick={() => saveSettings('promo_section', promoSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Promo Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instagram Section */}
        <TabsContent value="instagram">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-primary" />
                Instagram Section
              </CardTitle>
              <CardDescription>
                Manage the Instagram feed section on homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Instagram Section</Label>
                  <p className="text-sm text-muted-foreground">Show/hide Instagram feed</p>
                </div>
                <Switch
                  checked={instagramSettings.enabled}
                  onCheckedChange={(checked) => 
                    setInstagramSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instagram Username</Label>
                  <Input
                    value={instagramSettings.username}
                    onChange={(e) => setInstagramSettings(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="@yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profile URL</Label>
                  <Input
                    value={instagramSettings.profileUrl}
                    onChange={(e) => setInstagramSettings(prev => ({ ...prev, profileUrl: e.target.value }))}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={instagramSettings.title}
                  onChange={(e) => setInstagramSettings(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Custom Images (Max 6)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (instagramSettings.images.length < 6) {
                        setInstagramSettings(prev => ({ ...prev, images: [...prev.images, ''] }));
                      }
                    }}
                    disabled={instagramSettings.images.length >= 6}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Image
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leave empty to use default images. Add custom images to display your own Instagram posts.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {instagramSettings.images.map((image, index) => (
                    <div key={index} className="relative">
                      <MediaPicker
                        value={image}
                        onChange={(url) => {
                          const newImages = [...instagramSettings.images];
                          newImages[index] = url;
                          setInstagramSettings(prev => ({ ...prev, images: newImages }));
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6"
                        onClick={() => {
                          const newImages = instagramSettings.images.filter((_, i) => i !== index);
                          setInstagramSettings(prev => ({ ...prev, images: newImages }));
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('instagram_section', instagramSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Instagram Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={fetchSettings}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Settings
        </Button>
      </div>
    </div>
  );
};
