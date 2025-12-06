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
import { Loader2, MessageSquare, Bot, Store, Save, RefreshCw } from "lucide-react";

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

export const SiteSettingsManager = () => {
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
  }, []);

  const saveSettings = async (key: string, value: object) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: JSON.parse(JSON.stringify(value)) })
        .eq('setting_key', key);

      if (error) throw error;
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
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
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
                    value={storeInfo.name}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-email">Email</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone</Label>
                  <Input
                    id="store-phone"
                    value={storeInfo.phone}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Address</Label>
                  <Input
                    id="store-address"
                    value={storeInfo.address}
                    onChange={(e) => 
                      setStoreInfo(prev => ({ ...prev, address: e.target.value }))
                    }
                  />
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('store_info', storeInfo)}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Store Info
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
