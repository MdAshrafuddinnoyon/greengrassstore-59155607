import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { items, updateQuantity, removeItem, clearCart, createCheckout, isLoading } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "whatsapp">("online");
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
  const shipping = subtotal >= 200 ? 0 : 25;
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

    const message = generateOrderMessage("📱 WhatsApp Order");
    const encodedMessage = encodeURIComponent(message);
    window.open(`${WHATSAPP_URL}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
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
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#2d5a3d]" />
                  {isArabic ? "المنتجات" : "Cart Items"} ({totalItems})
                </h2>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.variantId} className="py-4 flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.product.node.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.selectedOptions.map(opt => opt.value).join(' • ')}
                        </p>
                        <p className="font-semibold text-[#2d5a3d] mt-1">
                          {currency} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-1 border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
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
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-4">
                  {isArabic ? "معلومات العميل" : "Customer Information"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {isArabic 
                    ? "مطلوب للطلب عبر واتساب"
                    : "Required for WhatsApp order"
                  }
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      {isArabic ? "الاسم" : "Full Name"} *
                    </label>
                    <Input
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder={isArabic ? "أدخل اسمك" : "Enter your name"}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      {isArabic ? "رقم الهاتف" : "Phone"} *
                    </label>
                    <Input
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder={isArabic ? "بريدك الإلكتروني" : "your@email.com"}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      {isArabic ? "المدينة" : "City"}
                    </label>
                    <Input
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      placeholder={isArabic ? "دبي، أبوظبي..." : "Dubai, Abu Dhabi..."}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      {isArabic ? "العنوان" : "Address"}
                    </label>
                    <Input
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder={isArabic ? "عنوان التوصيل الكامل" : "Full delivery address"}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      {isArabic ? "ملاحظات" : "Notes"}
                    </label>
                    <Input
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder={isArabic ? "ملاحظات إضافية للتوصيل" : "Additional delivery notes"}
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
                className="bg-white rounded-2xl p-6 shadow-sm sticky top-4"
              >
                <h2 className="text-lg font-semibold mb-4">
                  {isArabic ? "ملخص الطلب" : "Order Summary"}
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {isArabic ? "المجموع الفرعي" : "Subtotal"}
                    </span>
                    <span className="font-medium">{currency} {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {isArabic ? "الشحن" : "Shipping"}
                    </span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? (isArabic ? "مجاني" : "FREE") : `${currency} ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      {isArabic 
                        ? `أضف ${currency} ${(200 - subtotal).toFixed(2)} للحصول على شحن مجاني`
                        : `Add ${currency} ${(200 - subtotal).toFixed(2)} more for free shipping`
                      }
                    </p>
                  )}
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{isArabic ? "الإجمالي" : "Total"}</span>
                    <span className="text-[#2d5a3d]">{currency} {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-gray-900">
                    {isArabic ? "طريقة الدفع" : "Payment Method"}
                  </h3>
                  

                  {/* Online Payment Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
                      className="w-4 h-4 text-[#2d5a3d]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">
                          {isArabic ? "الدفع الإلكتروني" : "Pay Online"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {isArabic ? "بطاقة ائتمان / Apple Pay / Google Pay" : "Credit Card / Apple Pay / Google Pay"}
                      </p>
                    </div>
                  </label>

                  {/* WhatsApp Order Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
                      className="w-4 h-4 text-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="font-medium">
                          {isArabic ? "طلب عبر واتساب" : "Order via WhatsApp"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {isArabic ? "تواصل معنا مباشرة للطلب" : "Contact us directly to place order"}
                      </p>
                    </div>
                  </label>

                  {/* Place Order Button */}
                  <Button
                    onClick={
                      paymentMethod === "online" ? handleShopifyCheckout : handleWhatsAppOrder
                    }
                    disabled={isLoading}
                    className={`w-full h-14 text-lg font-semibold ${
                      paymentMethod === "whatsapp" 
                        ? "bg-[#25D366] hover:bg-[#128C7E] text-white"
                        : "bg-[#2d5a3d] hover:bg-[#234830] text-white"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : paymentMethod === "online" ? (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {isArabic ? "الدفع الآن" : "Pay Now"}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {isArabic ? "طلب عبر واتساب" : "Order via WhatsApp"}
                      </>
                    )}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{isArabic ? "توصيل مجاني فوق 200 درهم" : "Free delivery above AED 200"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
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