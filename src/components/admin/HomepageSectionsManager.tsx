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
import { Loader2, Save, RefreshCw, Image as ImageIcon, Gift, Tag, Sparkles } from "lucide-react";

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
  backgroundImage: string;
  backgroundColor: string;
}

export const HomepageSectionsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    buttonLink: "/shop?category=gifts"
  });

  const [promoSettings, setPromoSettings] = useState<PromoSectionSettings>({
    enabled: true,
    title: "November Sale",
    titleAr: "تخفيضات نوفمبر",
    subtitle: "Up to 50% Off",
    subtitleAr: "خصم يصل إلى 50%",
    discountText: "Limited Time Offer",
    discountTextAr: "عرض لفترة محدودة",
    buttonText: "Shop Sale",
    buttonTextAr: "تسوق التخفيضات",
    buttonLink: "/shop?category=sale",
    backgroundImage: "",
    backgroundColor: "#2d5a3d"
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      data?.forEach((setting) => {
        const value = setting.setting_value as Record<string, unknown>;
        if (setting.setting_key === 'hero_section') {
          setHeroSettings(value as unknown as HeroSettings);
        } else if (setting.setting_key === 'gift_section') {
          setGiftSettings(value as unknown as GiftSectionSettings);
        } else if (setting.setting_key === 'promo_section') {
          setPromoSettings(value as unknown as PromoSectionSettings);
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
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
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', key)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: JSON.parse(JSON.stringify(value)) })
          .eq('setting_key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ setting_key: key, setting_value: JSON.parse(JSON.stringify(value)) });
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
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="hero" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="gift" className="gap-2">
            <Gift className="w-4 h-4" />
            Gift
          </TabsTrigger>
          <TabsTrigger value="promo" className="gap-2">
            <Tag className="w-4 h-4" />
            Promo/Sale
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
                  <Label>Button Text (EN)</Label>
                  <Input
                    value={heroSettings.buttonText}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Text (AR)</Label>
                  <Input
                    value={heroSettings.buttonTextAr}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, buttonTextAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input
                    value={heroSettings.buttonLink}
                    onChange={(e) => setHeroSettings(prev => ({ ...prev, buttonLink: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Image URL</Label>
                <Input
                  value={heroSettings.backgroundImage}
                  onChange={(e) => setHeroSettings(prev => ({ ...prev, backgroundImage: e.target.value }))}
                  placeholder="https://... or leave empty for default"
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
                  <Label>Subtitle/Discount (EN)</Label>
                  <Input
                    value={promoSettings.subtitle}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Up to 50% Off"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle/Discount (AR)</Label>
                  <Input
                    value={promoSettings.subtitleAr}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={promoSettings.backgroundColor}
                      onChange={(e) => setPromoSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={promoSettings.backgroundColor}
                      onChange={(e) => setPromoSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <Input
                    value={promoSettings.buttonLink}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, buttonLink: e.target.value }))}
                  />
                </div>
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