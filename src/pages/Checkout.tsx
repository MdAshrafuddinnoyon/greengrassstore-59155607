import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput, validatePhoneNumber } from "@/components/ui/phone-input";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  Truck, 
  Shield, 
  CreditCard, 
  ChevronRight,
  Loader2,
  ArrowLeft,
  Package
} from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_URL = "https://wa.me/+971547751901";

const Checkout = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const navigate = useNavigate();
  const { shippingSettings } = useSiteSettings();
  const { items, updateQuantity, removeItem, clearCart, createCheckout, isLoading } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "whatsapp" | "home_delivery">("online");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  
  // Dynamic shipping calculation based on admin settings
  const freeShippingThreshold = shippingSettings.freeShippingThreshold;
  const shippingCost = shippingSettings.shippingCost;
  const shipping = shippingSettings.freeShippingEnabled && subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const amountForFreeShipping = freeShippingThreshold - subtotal;
  
  const total = subtotal + shipping;
  const currency = items[0]?.price.currencyCode || "AED";

  const handleShopifyCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      }
    } catch (error) {
      toast.error(isArabic ? "فشل في إنشاء الطلب" : "Failed to create checkout");
    }
  };

  const generateOrderMessage = (paymentType: string) => {
    const itemsList = items.map((item, index) => 
      `${index + 1}. ${item.product.node.title}
   ${item.selectedOptions.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
   Qty: ${item.quantity} × ${currency} ${parseFloat(item.price.amount).toFixed(2)} = ${currency} ${(parseFloat(item.price.amount) * item.quantity).toFixed(2)}`
    ).join('\n\n');

    return `🛒 *New Order - Green Grass Store*

💳 *Payment Method:* ${paymentType}

👤 *Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email || "Not provided"}
Address: ${customerInfo.address || "Not provided"}
City: ${customerInfo.city || "Not provided"}

📦 *Order Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: ${currency} ${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? "FREE" : `${currency} ${shipping.toFixed(2)}`}
*Total: ${currency} ${total.toFixed(2)}*

📝 *Notes:* ${customerInfo.notes || "None"}

---
Please confirm my order. Thank you!`;
  };


  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error(isArabic ? "يرجى إدخال الاسم ورقم الهاتف" : "Please enter name and phone number");
      return;
    }
    
    if (!validatePhoneNumber(customerInfo.phone)) {
      toast.error(isArabic ? "يرجى إدخال رقم هاتف صحيح" : "Please enter a valid phone number");
      return;
    }

    const message = generateOrderMessage("📱 WhatsApp Order");
    const encodedMessage = encodeURIComponent(message);
    window.open(`${WHATSAPP_URL}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const handleHomeDeliveryOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error(isArabic ? "يرجى إدخال الاسم ورقم الهاتف والعنوان" : "Please enter name, phone and address");
      return;
    }
    
    if (!validatePhoneNumber(customerInfo.phone)) {
      toast.error(isArabic ? "يرجى إدخال رقم هاتف صحيح" : "Please enter a valid phone number");
      return;
    }

    try {
      // Create order in Supabase
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const orderItems = items.map(item => ({
        name: item.product.node.title,
        options: item.selectedOptions.map(o => o.value).join(', '),
        quantity: item.quantity,
        price: parseFloat(item.price.amount),
        total: parseFloat(item.price.amount) * item.quantity
      }));

      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get current user for linking order
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email || user?.email || '',
        customer_phone: customerInfo.phone,
        customer_address: `${customerInfo.address}, ${customerInfo.city}`,
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: 0,
        total: total,
        payment_method: 'home_delivery',
        notes: customerInfo.notes,
        status: 'pending',
        user_id: user?.id || null
      });

      if (error) throw error;

      toast.success(isArabic ? "تم تأكيد طلبك! رقم الطلب: " + orderNumber : "Order confirmed! Order #: " + orderNumber);
      clearCart();
      navigate('/track-order?order=' + orderNumber);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(isArabic ? "حدث خطأ في إنشاء الطلب" : "Error creating order");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50" dir={isArabic ? "rtl" : "ltr"}>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {isArabic ? "سلة التسوق فارغة" : "Your Cart is Empty"}
            </h1>
            <p className="text-gray-500 mb-6">
              {isArabic 
                ? "لم تقم بإضافة أي منتجات إلى سلة التسوق بعد"
                : "You haven't added any products to your cart yet"
              }
            </p>
            <Link to="/shop">
              <Button className="bg-[#2d5a3d] hover:bg-[#234830]">
                <Package className="w-4 h-4 mr-2" />
                {isArabic ? "تسوق الآن" : "Shop Now"}
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      
      <main className="flex-1 pb-24 lg:pb-0">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                {isArabic ? "الرئيسية" : "Home"}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link to="/shop" className="text-gray-500 hover:text-gray-700">
                {isArabic ? "المتجر" : "Shop"}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">
                {isArabic ? "إتمام الطلب" : "Checkout"}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isArabic ? "إتمام الطلب" : "Checkout"}
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items & Customer Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm"
              >
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#2d5a3d]" />
                  {isArabic ? "المنتجات" : "Cart Items"} ({totalItems})
                </h2>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.variantId} className="py-3 sm:py-4 flex gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                          {item.product.node.title}
                        </h3>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            {item.selectedOptions.map(opt => opt.value).join(' • ')}
                          </p>
                        )}
                        <p className="font-semibold text-[#2d5a3d] mt-1 text-sm sm:text-base">
                          {currency} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm"
              >
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                  {isArabic ? "معلومات العميل" : "Customer Information"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  {isArabic 
                    ? "مطلوب للطلب عبر واتساب"
                    : "Required for WhatsApp order"
                  }
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 block">
                      {isArabic ? "الاسم" : "Full Name"} *
                    </label>
                    <Input
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder={isArabic ? "أدخل اسمك" : "Enter your name"}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 block">
                      {isArabic ? "رقم الهاتف" : "Phone"} *
                    </label>
                    <PhoneInput
                      value={customerInfo.phone}
                      onChange={(phone) => setCustomerInfo({ ...customerInfo, phone })}
                      placeholder="XX XXX XXXX"
                      defaultCountry="+971"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 block">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder={isArabic ? "بريدك الإلكتروني" : "your@email.com"}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 block">
                      {isArabic ? "المدينة" : "City"}
                    </label>
                    <Input
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      placeholder={isArabic ? "دبي، أبوظبي..." : "Dubai, Abu Dhabi..."}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 block">
                      {isArabic ? "العنوان" : "Address"}
                    </label>
                    <Input
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder={isArabic ? "عنوان التوصيل الكامل" : "Full delivery address"}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 block">
                      {isArabic ? "ملاحظات" : "Notes"}
                    </label>
                    <Input
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder={isArabic ? "ملاحظات إضافية للتوصيل" : "Additional delivery notes"}
                      className="text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-4"
              >
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  {isArabic ? "ملخص الطلب" : "Order Summary"}
                </h2>
                
                <div className="space-y-2 sm:space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {isArabic ? "المجموع الفرعي" : "Subtotal"}
                    </span>
                    <span className="font-medium text-xs sm:text-sm">{currency} {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {isArabic ? "الشحن" : "Shipping"}
                    </span>
                    <span className={`font-medium text-xs sm:text-sm ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? (isArabic ? "مجاني" : "FREE") : `${currency} ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && shippingSettings.freeShippingEnabled && amountForFreeShipping > 0 && (
                    <p className="text-[10px] sm:text-xs text-amber-600 bg-amber-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                      {isArabic 
                        ? `أضف ${currency} ${amountForFreeShipping.toFixed(2)} للحصول على شحن مجاني`
                        : `Add ${currency} ${amountForFreeShipping.toFixed(2)} more for free shipping`
                      }
                    </p>
                  )}
                  <hr />
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>{isArabic ? "الإجمالي" : "Total"}</span>
                    <span className="text-[#2d5a3d]">{currency} {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {isArabic ? "طريقة الدفع" : "Payment Method"}
                  </h3>
                  

                  {/* Online Payment Option */}
                  <label 
                    className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "online" 
                        ? "border-[#2d5a3d] bg-[#2d5a3d]/5" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="w-4 h-4 text-[#2d5a3d] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">
                          {isArabic ? "الدفع الإلكتروني" : "Pay Online"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">
                        {isArabic ? "بطاقة ائتمان / Apple Pay" : "Credit Card / Apple Pay"}
                      </p>
                    </div>
                  </label>

                  {/* WhatsApp Order Option */}
                  <label 
                    className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "whatsapp" 
                        ? "border-[#25D366] bg-[#25D366]/5" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "whatsapp"}
                      onChange={() => setPaymentMethod("whatsapp")}
                      className="w-4 h-4 text-[#25D366] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="font-medium text-sm sm:text-base">
                          {isArabic ? "طلب عبر واتساب" : "Order via WhatsApp"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">
                        {isArabic ? "تواصل معنا مباشرة للطلب" : "Contact us directly"}
                      </p>
                    </div>
                  </label>

                  {/* Home Delivery Option */}
                  <label 
                    className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "home_delivery" 
                        ? "border-amber-500 bg-amber-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "home_delivery"}
                      onChange={() => setPaymentMethod("home_delivery")}
                      className="w-4 h-4 text-amber-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">
                          {isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">
                        {isArabic ? "ادفع نقداً عند استلام الطلب" : "Pay when you receive"}
                      </p>
                    </div>
                  </label>

                  {/* Place Order Button */}
                  <Button
                    onClick={
                      paymentMethod === "online" ? handleShopifyCheckout : 
                      paymentMethod === "home_delivery" ? handleHomeDeliveryOrder :
                      handleWhatsAppOrder
                    }
                    disabled={isLoading}
                    className={`w-full h-11 sm:h-14 text-sm sm:text-lg font-semibold ${
                      paymentMethod === "whatsapp" 
                        ? "bg-[#25D366] hover:bg-[#128C7E] text-white"
                        : paymentMethod === "home_delivery"
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-[#2d5a3d] hover:bg-[#234830] text-white"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                    ) : paymentMethod === "online" ? (
                      <>
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {isArabic ? "الدفع الآن" : "Pay Now"}
                      </>
                    ) : paymentMethod === "home_delivery" ? (
                      <>
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {isArabic ? "تأكيد الطلب" : "Confirm Order"}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-2">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {isArabic ? "طلب عبر واتساب" : "Order via WhatsApp"}
                      </>
                    )}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <span>{isArabic ? "توصيل مجاني فوق 200 درهم" : "Free delivery above AED 200"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <span>{isArabic ? "دفع آمن 100%" : "100% Secure Payment"}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;