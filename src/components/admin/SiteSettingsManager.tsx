import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
<<<<<<< HEAD
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { Loader2, MessageSquare, Bot, Store, Save, RefreshCw, Truck, RotateCcw, CreditCard, MapPin, Plus, Trash2, Percent } from "lucide-react";

interface WhatsAppSettings {
  phone: string;
  enabled: boolean;
  welcomeMessage: string;
}

interface SalesAgentSettings {
  enabled: boolean;
  name: string;
  responses: Record<string, string>;
}

interface StoreInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface FooterFeature {
  id: string;
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  enabled: boolean;
}

interface TaxSettings {
  enabled: boolean;
  rate: number;
  label: string;
  includedInPrice: boolean;
}

interface ShippingSettings {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  shippingCost: number;
  shippingLabel: string;
  shippingLabelAr: string;
}

const iconOptions = [
  { value: 'truck', label: 'Truck (Delivery)', icon: Truck },
  { value: 'rotate', label: 'Rotate (Returns)', icon: RotateCcw },
  { value: 'credit-card', label: 'Credit Card (Payment)', icon: CreditCard },
  { value: 'map-pin', label: 'Map Pin (Location)', icon: MapPin },
  { value: 'percent', label: 'Percent (Discount)', icon: Percent },
];

export const SiteSettingsManager = () => {
<<<<<<< HEAD
  const { whatsapp, salesAgent, storeInfo, footerFeatures, paymentBanner, shippingSettings: contextShippingSettings, loading: contextLoading, refetch } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  
  // Local state for editing
  const [whatsappSettings, setWhatsappSettings] = useState(whatsapp);
  const [salesAgentSettings, setSalesAgentSettings] = useState(salesAgent);
  const [storeInfoLocal, setStoreInfoLocal] = useState(storeInfo);
  const [footerFeaturesLocal, setFooterFeaturesLocal] = useState(footerFeatures);
  // Defensive default for paymentBanner
  const defaultPaymentBanner = {
    enabled: false,
    title: '',
    titleAr: '',
    link: '',
    imageUrl: ''
  };
  const [paymentBannerLocal, setPaymentBannerLocal] = useState(paymentBanner && typeof paymentBanner === 'object' ? { ...defaultPaymentBanner, ...paymentBanner } : defaultPaymentBanner);
  const [taxSettings, setTaxSettings] = useState({
=======
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>({
    phone: "+971547751901",
    enabled: true,
    welcomeMessage: "Hello! Welcome to Green Grass Store. How can we help you today?"
  });

  const [salesAgentSettings, setSalesAgentSettings] = useState<SalesAgentSettings>({
    enabled: true,
    name: "Sales Assistant",
    responses: {}
  });

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "Green Grass Store",
    email: "info@greengrassstore.com",
    phone: "+971547751901",
    address: "Dubai, UAE"
  });

  const [footerFeatures, setFooterFeatures] = useState<FooterFeature[]>([
    { id: '1', icon: 'truck', title: 'Free Delivery', titleAr: 'توصيل مجاني', description: 'Free Delivery On Orders Over 300 AED', descriptionAr: 'توصيل مجاني للطلبات فوق 300 درهم', enabled: true },
    { id: '2', icon: 'rotate', title: 'Hassle-Free Returns', titleAr: 'إرجاع سهل', description: 'Within 7 days of delivery.', descriptionAr: 'خلال 7 أيام من التسليم', enabled: true },
    { id: '3', icon: 'credit-card', title: 'Easy Installments', titleAr: 'أقساط سهلة', description: 'Pay Later with tabby.', descriptionAr: 'ادفع لاحقاً مع تابي', enabled: true },
    { id: '4', icon: 'map-pin', title: 'Visit Us In-Store', titleAr: 'زورنا في المتجر', description: 'In Abu Dhabi and Dubai.', descriptionAr: 'في أبوظبي ودبي', enabled: true },
  ]);

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    enabled: false,
    rate: 5,
    label: "VAT",
    includedInPrice: true
  });
<<<<<<< HEAD
  const [shippingSettings, setShippingSettings] = useState(contextShippingSettings);

  // Update local state when context data changes
  useEffect(() => {
    setWhatsappSettings(whatsapp);
  }, [whatsapp]);

  useEffect(() => {
    setSalesAgentSettings(salesAgent);
  }, [salesAgent]);

  useEffect(() => {
    setStoreInfoLocal(storeInfo);
  }, [storeInfo]);

  useEffect(() => {
    setFooterFeaturesLocal(footerFeatures);
  }, [footerFeatures]);

  useEffect(() => {
    setShippingSettings(contextShippingSettings);
  }, [contextShippingSettings]);

  useEffect(() => {
    setPaymentBannerLocal(paymentBanner && typeof paymentBanner === 'object' ? { ...defaultPaymentBanner, ...paymentBanner } : defaultPaymentBanner);
  }, [paymentBanner]);

  const fetchSettings = async () => {
    await refetch();
  };

=======

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingEnabled: true,
    freeShippingThreshold: 200,
    shippingCost: 25,
    shippingLabel: "Shipping",
    shippingLabelAr: "الشحن"
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
        if (setting.setting_key === 'whatsapp') {
          setWhatsappSettings(value as unknown as WhatsAppSettings);
        } else if (setting.setting_key === 'sales_agent') {
          setSalesAgentSettings(value as unknown as SalesAgentSettings);
        } else if (setting.setting_key === 'store_info') {
          setStoreInfo(value as unknown as StoreInfo);
        } else if (setting.setting_key === 'footer_features') {
          setFooterFeatures(value as unknown as FooterFeature[]);
        } else if (setting.setting_key === 'tax_settings') {
          setTaxSettings(value as unknown as TaxSettings);
        } else if (setting.setting_key === 'shipping_settings') {
          setShippingSettings(value as unknown as ShippingSettings);
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Real-time subscription for site settings
    const channel = supabase
      .channel('admin-site-settings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  const saveSettings = async (key: string, value: object) => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: JSON.parse(JSON.stringify(value)), updated_at: new Date().toISOString() })
          .eq('setting_key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ setting_key: key, setting_value: JSON.parse(JSON.stringify(value)) });
        if (error) throw error;
      }
      toast.success('Settings saved successfully');
<<<<<<< HEAD
      await refetch();
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addFooterFeature = () => {
<<<<<<< HEAD
    setFooterFeaturesLocal(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        icon: 'truck',
        title: 'New Feature',
        titleAr: 'ميزة جديدة',
        description: 'Feature description',
        descriptionAr: 'وصف الميزة',
        enabled: true
      }
    ]);
  };

  const removeFooterFeature = (id: string) => {
    setFooterFeaturesLocal(prev => prev.filter(f => f.id !== id));
  };

  const updateFooterFeature = (id: string, field: keyof FooterFeature, value: string | boolean) => {
    setFooterFeaturesLocal(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  if (contextLoading) {
=======
    setFooterFeatures([...footerFeatures, {
      id: Date.now().toString(),
      icon: 'truck',
      title: 'New Feature',
      titleAr: 'ميزة جديدة',
      description: 'Feature description',
      descriptionAr: 'وصف الميزة',
      enabled: true
    }]);
  };

  const removeFooterFeature = (id: string) => {
    setFooterFeatures(footerFeatures.filter(f => f.id !== id));
  };

  const updateFooterFeature = (id: string, field: keyof FooterFeature, value: string | boolean) => {
    setFooterFeatures(footerFeatures.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  if (loading) {
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="sales-agent" className="gap-2">
            <Bot className="w-4 h-4" />
            Sales Agent
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2">
            <Store className="w-4 h-4" />
            Store Info
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Truck className="w-4 h-4" />
            Footer Features
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <Percent className="w-4 h-4" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </TabsTrigger>
        </TabsList>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                WhatsApp Settings
              </CardTitle>
              <CardDescription>
                Configure WhatsApp chat widget and order functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Show WhatsApp chat button</p>
                </div>
                <Switch
                  checked={whatsappSettings.enabled}
                  onCheckedChange={(checked) => 
                    setWhatsappSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-phone">WhatsApp Phone Number</Label>
                <Input
                  id="whatsapp-phone"
                  value={whatsappSettings.phone}
                  onChange={(e) => 
                    setWhatsappSettings(prev => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+971XXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +971 for UAE)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  value={whatsappSettings.welcomeMessage}
                  onChange={(e) => 
                    setWhatsappSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => saveSettings('whatsapp', whatsappSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save WhatsApp Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Agent Settings */}
        <TabsContent value="sales-agent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Sales Agent Settings
              </CardTitle>
              <CardDescription>
                Configure the AI-powered sales assistant chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Sales Agent</Label>
                  <p className="text-sm text-muted-foreground">Show sales assistant chat</p>
                </div>
                <Switch
                  checked={salesAgentSettings.enabled}
                  onCheckedChange={(checked) => 
                    setSalesAgentSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  value={salesAgentSettings.name}
                  onChange={(e) => 
                    setSalesAgentSettings(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Sales Assistant"
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Custom Responses</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add custom keyword-based responses for the sales agent
                </p>
                
                <div className="space-y-3">
                  {Object.entries(salesAgentSettings.responses).map(([keyword, response], index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <Input 
                        value={keyword} 
                        placeholder="Keyword"
                        onChange={(e) => {
                          const newResponses = { ...salesAgentSettings.responses };
                          delete newResponses[keyword];
                          newResponses[e.target.value] = response;
                          setSalesAgentSettings(prev => ({ ...prev, responses: newResponses }));
                        }}
                      />
                      <Input 
                        value={response} 
                        placeholder="Response"
                        className="col-span-2"
                        onChange={(e) => {
                          setSalesAgentSettings(prev => ({
                            ...prev,
                            responses: { ...prev.responses, [keyword]: e.target.value }
                          }));
                        }}
                      />
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSalesAgentSettings(prev => ({
                        ...prev,
                        responses: { ...prev.responses, '': '' }
                      }));
                    }}
                  >
                    Add Response
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('sales_agent', salesAgentSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Sales Agent Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Info */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Store Information
              </CardTitle>
              <CardDescription>
                Basic store information for invoices and contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
<<<<<<< HEAD
                    value={storeInfoLocal.name}
                    onChange={(e) => 
                      setStoreInfoLocal(prev => ({ ...prev, name: e.target.value }))
=======
                    value={storeInfo.name}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, name: e.target.value }))
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-email">Email</Label>
                  <Input
                    id="store-email"
                    type="email"
<<<<<<< HEAD
                    value={storeInfoLocal.email}
                    onChange={(e) => 
                      setStoreInfoLocal(prev => ({ ...prev, email: e.target.value }))
=======
                    value={storeInfo.email}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, email: e.target.value }))
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone</Label>
                  <Input
                    id="store-phone"
<<<<<<< HEAD
                    value={storeInfoLocal.phone}
                    onChange={(e) => 
                      setStoreInfoLocal(prev => ({ ...prev, phone: e.target.value }))
=======
                    value={storeInfo.phone}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, phone: e.target.value }))
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Address</Label>
                  <Input
                    id="store-address"
<<<<<<< HEAD
                    value={storeInfoLocal.address}
                    onChange={(e) => 
                      setStoreInfoLocal(prev => ({ ...prev, address: e.target.value }))
=======
                    value={storeInfo.address}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, address: e.target.value }))
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                    }
                  />
                </div>
              </div>

              <Button 
<<<<<<< HEAD
                onClick={() => saveSettings('store_info', storeInfoLocal)}
=======
                onClick={() => saveSettings('store_info', storeInfo)}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Store Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Features */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Footer Features
              </CardTitle>
              <CardDescription>
                Manage footer feature icons and text (Free Delivery, Returns, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
<<<<<<< HEAD
              {footerFeaturesLocal.map((feature, index) => (
=======
              {footerFeatures.map((feature, index) => (
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                <div key={feature.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Feature #{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(c) => updateFooterFeature(feature.id, 'enabled', c)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeFooterFeature(feature.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select 
                        value={feature.icon} 
                        onValueChange={(v) => updateFooterFeature(feature.id, 'icon', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <span className="flex items-center gap-2">
                                <opt.icon className="w-4 h-4" />
                                {opt.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title (EN)</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFooterFeature(feature.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title (AR)</Label>
                      <Input
                        value={feature.titleAr}
                        onChange={(e) => updateFooterFeature(feature.id, 'titleAr', e.target.value)}
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (EN)</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) => updateFooterFeature(feature.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description (AR)</Label>
                      <Input
                        value={feature.descriptionAr}
                        onChange={(e) => updateFooterFeature(feature.id, 'descriptionAr', e.target.value)}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addFooterFeature} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>

              <Button 
<<<<<<< HEAD
                onClick={() => saveSettings('footer_features', footerFeaturesLocal)}
=======
                onClick={() => saveSettings('footer_features', footerFeatures)}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Footer Features
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-primary" />
                Tax Settings
              </CardTitle>
              <CardDescription>
                Configure VAT and tax settings for checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Tax</Label>
                  <p className="text-sm text-muted-foreground">Apply tax to orders</p>
                </div>
                <Switch
                  checked={taxSettings.enabled}
                  onCheckedChange={(checked) => 
                    setTaxSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Label</Label>
                  <Input
                    value={taxSettings.label}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="VAT"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxSettings.rate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Tax Included in Price</Label>
                  <p className="text-sm text-muted-foreground">Prices already include tax</p>
                </div>
                <Switch
                  checked={taxSettings.includedInPrice}
                  onCheckedChange={(checked) => 
                    setTaxSettings(prev => ({ ...prev, includedInPrice: checked }))
                  }
                />
              </div>

              <Button 
                onClick={() => saveSettings('tax_settings', taxSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Shipping Settings
              </CardTitle>
              <CardDescription>
                Configure free shipping threshold and shipping costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Free Shipping</Label>
                  <p className="text-sm text-muted-foreground">Offer free shipping above threshold</p>
                </div>
                <Switch
                  checked={shippingSettings.freeShippingEnabled}
                  onCheckedChange={(checked) => 
                    setShippingSettings(prev => ({ ...prev, freeShippingEnabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Free Shipping Threshold (AED)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) || 0 }))}
                    placeholder="200"
                  />
                  <p className="text-xs text-muted-foreground">Orders above this amount get free shipping</p>
                </div>
                <div className="space-y-2">
                  <Label>Shipping Cost (AED)</Label>
                  <Input
                    type="number"
                    value={shippingSettings.shippingCost}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, shippingCost: parseFloat(e.target.value) || 0 }))}
                    placeholder="25"
                  />
                  <p className="text-xs text-muted-foreground">Shipping cost for orders below threshold</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Shipping Label (English)</Label>
                  <Input
                    value={shippingSettings.shippingLabel}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, shippingLabel: e.target.value }))}
                    placeholder="Shipping"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shipping Label (Arabic)</Label>
                  <Input
                    value={shippingSettings.shippingLabelAr}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, shippingLabelAr: e.target.value }))}
                    placeholder="الشحن"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  <strong>Preview:</strong> {shippingSettings.freeShippingEnabled 
                    ? `Free shipping for orders above AED ${shippingSettings.freeShippingThreshold}. Orders below will be charged AED ${shippingSettings.shippingCost}.`
                    : `All orders will be charged AED ${shippingSettings.shippingCost} for shipping.`
                  }
                </p>
              </div>

              <Button 
                onClick={() => saveSettings('shipping_settings', shippingSettings)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
<<<<<<< HEAD

        <TabsContent value="payment-banner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Banner
              </CardTitle>
              <CardDescription>
                Configure a promotional or trust banner shown on the Account page (and reusable on Checkout).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Enable Banner</Label>
                  <p className="text-sm text-muted-foreground">Show payment banner on account page</p>
                </div>
                <Switch
                  checked={paymentBannerLocal.enabled}
                  onCheckedChange={(checked) => setPaymentBannerLocal(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={paymentBannerLocal.title}
                    onChange={(e) => setPaymentBannerLocal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Secure checkout"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (AR)</Label>
                  <Input
                    value={paymentBannerLocal.titleAr}
                    dir="rtl"
                    onChange={(e) => setPaymentBannerLocal(prev => ({ ...prev, titleAr: e.target.value }))}
                    placeholder="دفع آمن"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                    value={paymentBannerLocal.link}
                    onChange={(e) => setPaymentBannerLocal(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="/checkout"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Banner Image URL</Label>
                  <Input
                    value={paymentBannerLocal.imageUrl}
                    onChange={(e) => setPaymentBannerLocal(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://.../banner.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Use Media Library to copy a public URL and paste here.</p>
                </div>
              </div>

              {paymentBannerLocal?.enabled && paymentBannerLocal.imageUrl && (
                <div className="relative space-y-2">
                  <Label>Preview</Label>
                  <div className="rounded-xl overflow-hidden border bg-muted">
                    <img src={paymentBannerLocal.imageUrl} alt="Payment banner preview" className="w-full max-h-64 object-cover" />
                  </div>
                </div>
              )}

              <Button
                onClick={() => saveSettings('payment_banner', paymentBannerLocal)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Payment Banner
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
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
