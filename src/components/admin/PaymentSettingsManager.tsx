import { useState, useEffect } from "react";
<<<<<<< HEAD
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Save, 
  CreditCard, 
  Building2, 
  Globe, 
  ExternalLink,
  CheckCircle,
<<<<<<< HEAD
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { MediaPicker } from "./MediaPicker";


const PaymentSettingsManager = () => {
  const { paymentGateways: contextPaymentGateways, refetch } = useSiteSettings();
  // Defensive: fallback to empty array if undefined/null
  const paymentGateways = Array.isArray(contextPaymentGateways) ? contextPaymentGateways : [];
  // Always include PayPal, Payoneer, Direct Bank, Credit/Debit Card, and COD gateways
  const ensureGateway = (arr, type, defaults) => {
    return arr.some(g => g.type === type)
      ? arr
      : [...arr, defaults];
  };

  let gatewaysList = paymentGateways;
  gatewaysList = ensureGateway(gatewaysList, 'paypal', {
    type: 'paypal',
    displayName: 'PayPal',
    enabled: false,
    config: { clientId: '', secret: '' },
    instructions: 'Pay with PayPal.'
  });
  gatewaysList = ensureGateway(gatewaysList, 'payoneer', {
    type: 'payoneer',
    displayName: 'Payoneer',
    enabled: false,
    config: { email: '' },
    instructions: 'Pay with Payoneer.'
  });
  gatewaysList = ensureGateway(gatewaysList, 'bank_transfer', {
    type: 'bank_transfer',
    displayName: 'Direct Bank Transfer',
    enabled: false,
    config: { bankName: '', accountNumber: '', iban: '', swift: '' },
    instructions: 'Transfer directly to our bank account.'
  });
  gatewaysList = ensureGateway(gatewaysList, 'stripe', {
    type: 'stripe',
    displayName: 'Credit/Debit Card',
    enabled: false,
    config: { publishableKey: '', secretKey: '' },
    instructions: 'Pay with credit or debit card.'
  });
  gatewaysList = ensureGateway(gatewaysList, 'cod', {
    type: 'cod',
    displayName: 'Cash on Delivery',
    enabled: true,
    config: {},
    instructions: 'Pay with cash upon delivery.'
  });
  const [gateways, setGateways] = useState<PaymentGatewaySettings[]>(gatewaysList);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let updated = paymentGateways;
    updated = ensureGateway(updated, 'paypal', {
      type: 'paypal',
      displayName: 'PayPal',
      enabled: false,
      config: { clientId: '', secret: '' },
      instructions: 'Pay with PayPal.'
    });
    updated = ensureGateway(updated, 'payoneer', {
      type: 'payoneer',
      displayName: 'Payoneer',
      enabled: false,
      config: { email: '' },
      instructions: 'Pay with Payoneer.'
    });
    updated = ensureGateway(updated, 'bank_transfer', {
      type: 'bank_transfer',
      displayName: 'Direct Bank Transfer',
      enabled: false,
      config: { bankName: '', accountNumber: '', iban: '', swift: '' },
      instructions: 'Transfer directly to our bank account.'
    });
    updated = ensureGateway(updated, 'stripe', {
      type: 'stripe',
      displayName: 'Credit/Debit Card',
      enabled: false,
      config: { publishableKey: '', secretKey: '' },
      instructions: 'Pay with credit or debit card.'
    });
    updated = ensureGateway(updated, 'cod', {
      type: 'cod',
      displayName: 'Cash on Delivery',
      enabled: true,
      config: {},
      instructions: 'Pay with cash upon delivery.'
    });
    setGateways(updated);
  }, [paymentGateways]);

  const saveGateways = async () => {
=======
  AlertCircle
} from "lucide-react";

interface PayPalSettings {
  enabled: boolean;
  mode: 'sandbox' | 'live';
  clientId: string;
  clientSecret: string;
}

interface PayoneerSettings {
  enabled: boolean;
  programId: string;
  apiUsername: string;
  apiPassword: string;
}

interface BankTransferSettings {
  enabled: boolean;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  instructions: string;
}

interface StripeSettings {
  enabled: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

export const PaymentSettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [paypalSettings, setPaypalSettings] = useState<PayPalSettings>({
    enabled: false,
    mode: 'sandbox',
    clientId: "",
    clientSecret: ""
  });

  const [payoneerSettings, setPayoneerSettings] = useState<PayoneerSettings>({
    enabled: false,
    programId: "",
    apiUsername: "",
    apiPassword: ""
  });

  const [bankSettings, setBankSettings] = useState<BankTransferSettings>({
    enabled: false,
    bankName: "",
    accountName: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    instructions: ""
  });

  const [stripeSettings, setStripeSettings] = useState<StripeSettings>({
    enabled: false,
    publishableKey: "",
    secretKey: "",
    webhookSecret: ""
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
        if (setting.setting_key === 'paypal_settings') {
          setPaypalSettings(value as unknown as PayPalSettings);
        } else if (setting.setting_key === 'payoneer_settings') {
          setPayoneerSettings(value as unknown as PayoneerSettings);
        } else if (setting.setting_key === 'bank_transfer_settings') {
          setBankSettings(value as unknown as BankTransferSettings);
        } else if (setting.setting_key === 'stripe_settings') {
          setStripeSettings(value as unknown as StripeSettings);
        }
      });
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (key: string, value: object) => {
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
<<<<<<< HEAD
        .eq('setting_key', 'payment_gateways')
=======
        .eq('setting_key', key)
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
<<<<<<< HEAD
          .update({ setting_value: JSON.parse(JSON.stringify(gateways)) })
          .eq('setting_key', 'payment_gateways');
=======
          .update({ setting_value: JSON.parse(JSON.stringify(value)) })
          .eq('setting_key', key);
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
<<<<<<< HEAD
          .insert({ setting_key: 'payment_gateways', setting_value: JSON.parse(JSON.stringify(gateways)) });
        if (error) throw error;
      }
      toast.success('Payment gateways saved successfully');
      refetch();
    } catch (error) {
      console.error('Error saving gateways:', error);
      toast.error('Failed to save gateways');
=======
          .insert({ setting_key: key, setting_value: JSON.parse(JSON.stringify(value)) });
        if (error) throw error;
      }
      
      toast.success('Payment settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    } finally {
      setSaving(false);
    }
  };

<<<<<<< HEAD
=======
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Gateway Settings
          </CardTitle>
          <CardDescription>
            Configure payment methods for your checkout. When enabled, these options will appear dynamically on the checkout page.
          </CardDescription>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <div className="space-y-6">
            {gateways.map((gateway, idx) => (
              <Card key={gateway.type} className="border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {gateway.type === 'paypal' && <Globe className="w-6 h-6 text-blue-600" />}
                      {gateway.type === 'stripe' && <CreditCard className="w-6 h-6 text-purple-600" />}
                      {gateway.type === 'payoneer' && <Globe className="w-6 h-6 text-orange-600" />}
                      {gateway.type === 'bank_transfer' && <Building2 className="w-6 h-6 text-green-600" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{gateway.displayName}</CardTitle>
                      <CardDescription>
                        {gateway.type === 'paypal' && 'Accept payments via PayPal'}
                        {gateway.type === 'stripe' && 'Accept credit/debit card payments'}
                        {gateway.type === 'payoneer' && 'Accept international payments'}
                        {gateway.type === 'bank_transfer' && 'Accept wire transfers and direct deposits'}
                        {gateway.type === 'cod' && 'Customer pays with cash upon delivery'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {gateway.enabled ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="w-3 h-3 mr-1" /> Inactive
                      </Badge>
                    )}
                    <Switch
                      checked={gateway.enabled}
                      onCheckedChange={checked => {
                        const updated = [...gateways];
                        updated[idx] = { ...gateway, enabled: checked };
                        setGateways(updated);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      value={gateway.displayName}
                      onChange={e => {
                        const updated = [...gateways];
                        updated[idx] = { ...gateway, displayName: e.target.value };
                        setGateways(updated);
                      }}
                      placeholder="Gateway Name"
                      disabled={gateway.type === 'cod'}
                    />
                  </div>
                                    {gateway.type === 'cod' && (
                                      <div className="space-y-2 md:col-span-2">
                                        <Label>Instructions</Label>
                                        <Textarea
                                          value={gateway.instructions || ''}
                                          onChange={e => {
                                            const updated = [...gateways];
                                            updated[idx] = { ...gateway, instructions: e.target.value };
                                            setGateways(updated);
                                          }}
                                          placeholder="Instructions for Cash on Delivery (shown to customer)"
                                          rows={2}
                                        />
                                      </div>
                                    )}
                  {gateway.type === 'paypal' && (
                    <>
                      <div className="space-y-2">
                        <Label>Client ID</Label>
                        <Input
                          value={gateway.config.clientId || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, clientId: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="Enter PayPal Client ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secret</Label>
                        <Input
                          type="password"
                          value={gateway.config.secret || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, secret: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="Enter PayPal Secret"
                        />
                      </div>
                    </>
                  )}
                  {gateway.type === 'stripe' && (
                    <>
                      <div className="space-y-2">
                        <Label>Publishable Key</Label>
                        <Input
                          value={gateway.config.publishableKey || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, publishableKey: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="pk_..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input
                          type="password"
                          value={gateway.config.secretKey || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, secretKey: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="sk_..."
                        />
                      </div>
                    </>
                  )}
                  {gateway.type === 'payoneer' && (
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={gateway.config.email || ''}
                        onChange={e => {
                          const updated = [...gateways];
                          updated[idx] = { ...gateway, config: { ...gateway.config, email: e.target.value } };
                          setGateways(updated);
                        }}
                        placeholder="Payoneer Email"
                      />
                    </div>
                  )}
                  {gateway.type === 'bank_transfer' && (
                    <>
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={gateway.config.bankName || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, bankName: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="Bank Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input
                          value={gateway.config.accountNumber || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, accountNumber: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="Account Number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>IBAN</Label>
                        <Input
                          value={gateway.config.iban || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, iban: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="IBAN"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SWIFT</Label>
                        <Input
                          value={gateway.config.swift || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, config: { ...gateway.config, swift: e.target.value } };
                            setGateways(updated);
                          }}
                          placeholder="SWIFT Code"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Instructions</Label>
                        <Textarea
                          value={gateway.instructions || ''}
                          onChange={e => {
                            const updated = [...gateways];
                            updated[idx] = { ...gateway, instructions: e.target.value };
                            setGateways(updated);
                          }}
                          placeholder="Payment instructions for customers"
                          rows={2}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
            <Button onClick={saveGateways} disabled={saving} className="w-full mt-6">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Payment Gateway Settings
            </Button>
          </div>
=======
          <Tabs defaultValue="paypal" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="paypal" className="gap-2">
                <Globe className="w-4 h-4" />
                PayPal
              </TabsTrigger>
              <TabsTrigger value="stripe" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Stripe
              </TabsTrigger>
              <TabsTrigger value="payoneer" className="gap-2">
                <Globe className="w-4 h-4" />
                Payoneer
              </TabsTrigger>
              <TabsTrigger value="bank" className="gap-2">
                <Building2 className="w-4 h-4" />
                Bank Transfer
              </TabsTrigger>
            </TabsList>

            {/* PayPal Settings */}
            <TabsContent value="paypal">
              <Card className="border-blue-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .76-.642h6.207c2.063 0 3.562.435 4.455 1.292.756.727 1.14 1.713 1.172 3.004a.37.37 0 0 1-.363.378c-.09 0-.173-.032-.236-.092-.524-.52-1.247-.86-2.16-1.013-.574-.096-1.202-.145-1.868-.145H9.27a.77.77 0 0 0-.76.641l-1.05 5.872c-.024.135.001.273.072.39a.513.513 0 0 0 .417.214h2.75c2.893 0 4.63-.916 5.297-2.791.062-.175.11-.36.145-.558a.362.362 0 0 1 .356-.298c.207 0 .374.173.367.38-.025.66-.148 1.29-.369 1.864-.818 2.134-2.75 3.22-5.742 3.22H8.302l-.892 4.9a.771.771 0 0 1-.76.643H6.25"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">PayPal</CardTitle>
                        <CardDescription>Accept payments via PayPal</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {paypalSettings.enabled ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" /> Inactive
                        </Badge>
                      )}
                      <Switch
                        checked={paypalSettings.enabled}
                        onCheckedChange={(checked) => 
                          setPaypalSettings(prev => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="paypal-mode" 
                          checked={paypalSettings.mode === 'sandbox'}
                          onChange={() => setPaypalSettings(prev => ({ ...prev, mode: 'sandbox' }))}
                          className="w-4 h-4"
                        />
                        <span>Sandbox (Testing)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="paypal-mode" 
                          checked={paypalSettings.mode === 'live'}
                          onChange={() => setPaypalSettings(prev => ({ ...prev, mode: 'live' }))}
                          className="w-4 h-4"
                        />
                        <span>Live (Production)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="paypal-client-id"
                        value={paypalSettings.clientId}
                        onChange={(e) => 
                          setPaypalSettings(prev => ({ ...prev, clientId: e.target.value }))
                        }
                        placeholder="Enter PayPal Client ID"
                      />
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://developer.paypal.com/dashboard" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Client Secret</Label>
                    <Input
                      id="paypal-secret"
                      type="password"
                      value={paypalSettings.clientSecret}
                      onChange={(e) => 
                        setPaypalSettings(prev => ({ ...prev, clientSecret: e.target.value }))
                      }
                      placeholder="Enter PayPal Client Secret"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings('paypal_settings', paypalSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save PayPal Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stripe Settings */}
            <TabsContent value="stripe">
              <Card className="border-purple-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#635BFF" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Stripe</CardTitle>
                        <CardDescription>Accept credit/debit card payments</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {stripeSettings.enabled ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" /> Inactive
                        </Badge>
                      )}
                      <Switch
                        checked={stripeSettings.enabled}
                        onCheckedChange={(checked) => 
                          setStripeSettings(prev => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-publishable">Publishable Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stripe-publishable"
                        value={stripeSettings.publishableKey}
                        onChange={(e) => 
                          setStripeSettings(prev => ({ ...prev, publishableKey: e.target.value }))
                        }
                        placeholder="pk_..."
                      />
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret">Secret Key</Label>
                    <Input
                      id="stripe-secret"
                      type="password"
                      value={stripeSettings.secretKey}
                      onChange={(e) => 
                        setStripeSettings(prev => ({ ...prev, secretKey: e.target.value }))
                      }
                      placeholder="sk_..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripe-webhook">Webhook Secret (Optional)</Label>
                    <Input
                      id="stripe-webhook"
                      type="password"
                      value={stripeSettings.webhookSecret}
                      onChange={(e) => 
                        setStripeSettings(prev => ({ ...prev, webhookSecret: e.target.value }))
                      }
                      placeholder="whsec_..."
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings('stripe_settings', stripeSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Stripe Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payoneer Settings */}
            <TabsContent value="payoneer">
              <Card className="border-orange-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Payoneer</CardTitle>
                        <CardDescription>Accept international payments</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {payoneerSettings.enabled ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" /> Inactive
                        </Badge>
                      )}
                      <Switch
                        checked={payoneerSettings.enabled}
                        onCheckedChange={(checked) => 
                          setPayoneerSettings(prev => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payoneer-program">Program ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="payoneer-program"
                        value={payoneerSettings.programId}
                        onChange={(e) => 
                          setPayoneerSettings(prev => ({ ...prev, programId: e.target.value }))
                        }
                        placeholder="Enter Payoneer Program ID"
                      />
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://payoneer.com/developers" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoneer-username">API Username</Label>
                    <Input
                      id="payoneer-username"
                      value={payoneerSettings.apiUsername}
                      onChange={(e) => 
                        setPayoneerSettings(prev => ({ ...prev, apiUsername: e.target.value }))
                      }
                      placeholder="Enter API Username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoneer-password">API Password</Label>
                    <Input
                      id="payoneer-password"
                      type="password"
                      value={payoneerSettings.apiPassword}
                      onChange={(e) => 
                        setPayoneerSettings(prev => ({ ...prev, apiPassword: e.target.value }))
                      }
                      placeholder="Enter API Password"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings('payoneer_settings', payoneerSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Payoneer Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bank Transfer Settings */}
            <TabsContent value="bank">
              <Card className="border-green-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Direct Bank Transfer</CardTitle>
                        <CardDescription>Accept wire transfers and direct deposits</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {bankSettings.enabled ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" /> Inactive
                        </Badge>
                      )}
                      <Switch
                        checked={bankSettings.enabled}
                        onCheckedChange={(checked) => 
                          setBankSettings(prev => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={bankSettings.bankName}
                        onChange={(e) => 
                          setBankSettings(prev => ({ ...prev, bankName: e.target.value }))
                        }
                        placeholder="e.g., Emirates NBD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input
                        id="account-name"
                        value={bankSettings.accountName}
                        onChange={(e) => 
                          setBankSettings(prev => ({ ...prev, accountName: e.target.value }))
                        }
                        placeholder="Business Account Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        value={bankSettings.accountNumber}
                        onChange={(e) => 
                          setBankSettings(prev => ({ ...prev, accountNumber: e.target.value }))
                        }
                        placeholder="Account Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swift-code">SWIFT/BIC Code</Label>
                      <Input
                        id="swift-code"
                        value={bankSettings.swiftCode}
                        onChange={(e) => 
                          setBankSettings(prev => ({ ...prev, swiftCode: e.target.value }))
                        }
                        placeholder="SWIFT Code"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      value={bankSettings.iban}
                      onChange={(e) => 
                        setBankSettings(prev => ({ ...prev, iban: e.target.value }))
                      }
                      placeholder="AE..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-instructions">Payment Instructions</Label>
                    <Textarea
                      id="bank-instructions"
                      value={bankSettings.instructions}
                      onChange={(e) => 
                        setBankSettings(prev => ({ ...prev, instructions: e.target.value }))
                      }
                      placeholder="Additional instructions for customers making bank transfers..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings('bank_transfer_settings', bankSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Bank Transfer Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        </CardContent>
      </Card>
    </div>
  );
};
<<<<<<< HEAD

export default PaymentSettingsManager;
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
