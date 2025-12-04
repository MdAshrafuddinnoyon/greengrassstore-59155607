import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertCircle, Truck, CreditCard } from "lucide-react";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#2d5a3d] to-[#1a3d28] text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <RotateCcw className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Return & Refund Policy</h1>
              <p className="text-lg text-white/80">
                We want you to be completely satisfied with your purchase. Here's everything you need to know about returns.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <Clock className="w-10 h-10 mx-auto mb-3 text-[#2d5a3d]" />
                <h3 className="font-bold text-gray-900">7 Days</h3>
                <p className="text-gray-600 text-sm">Return Window</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <Package className="w-10 h-10 mx-auto mb-3 text-[#2d5a3d]" />
                <h3 className="font-bold text-gray-900">Original Packaging</h3>
                <p className="text-gray-600 text-sm">Required</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <CreditCard className="w-10 h-10 mx-auto mb-3 text-[#2d5a3d]" />
                <h3 className="font-bold text-gray-900">5-7 Days</h3>
                <p className="text-gray-600 text-sm">Refund Processing</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12">
              {/* UAE Consumer Rights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">UAE Consumer Protection Law</h3>
                    <p className="text-gray-600 text-sm">
                      In accordance with UAE Federal Law No. 15 of 2020 on Consumer Protection, consumers have the right to return products within a reasonable period. Our policy exceeds these minimum requirements to ensure your satisfaction.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Eligibility */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  Eligible for Return
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Items in original, unused condition",
                    "Items in original packaging",
                    "Items returned within 7 days of delivery",
                    "Items with tags and labels attached",
                    "Damaged or defective items (photo proof required)",
                    "Wrong item delivered",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Not Eligible */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <XCircle className="w-7 h-7 text-red-600" />
                  Not Eligible for Return
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Live plants showing signs of customer damage",
                    "Items without original packaging",
                    "Items returned after 7 days",
                    "Customized or personalized items",
                    "Sale items marked as 'Final Sale'",
                    "Items damaged by misuse",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Return Process */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">How to Return</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: "Contact Us", desc: "Email or WhatsApp us with your order number and reason for return" },
                    { step: "2", title: "Get Approval", desc: "Receive return authorization within 24 hours" },
                    { step: "3", title: "Ship or Drop", desc: "Ship the item or drop at our store with return label" },
                    { step: "4", title: "Get Refund", desc: "Refund processed within 5-7 business days" },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#2d5a3d] text-white flex items-center justify-center text-xl font-bold">
                        {item.step}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Refund Information */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Refund Information</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Refund Method</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Credit/Debit Card: Refunded to original card</li>
                      <li>• Cash on Delivery: Bank transfer or store credit</li>
                      <li>• Apple Pay/Samsung Pay: Original payment method</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Processing Time</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Refund approval: 1-2 business days</li>
                      <li>• Bank processing: 5-7 business days</li>
                      <li>• Store credit: Instant</li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Shipping Costs */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Truck className="w-7 h-7 text-[#2d5a3d]" />
                  Return Shipping
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Defective/Wrong Item:</strong> Free return shipping – we'll arrange pickup</li>
                    <li><strong>Change of Mind:</strong> Customer bears return shipping costs (AED 25-50 depending on location)</li>
                    <li><strong>Store Drop-off:</strong> No shipping cost – bring items to our Dubai or Abu Dhabi store</li>
                  </ul>
                </div>
              </motion.section>

              {/* Contact for Returns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#2d5a3d] text-white rounded-2xl p-8 text-center"
              >
                <h3 className="text-2xl font-bold mb-4">Need to Return an Item?</h3>
                <p className="text-white/80 mb-6">
                  Contact our customer service team to initiate your return.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:returns@greengrassstore.com"
                    className="px-6 py-3 bg-white text-[#2d5a3d] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Email: returns@greengrassstore.com
                  </a>
                  <a
                    href="https://wa.me/971501234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20BD5A] transition-colors"
                  >
                    WhatsApp: +971 50 123 4567
                  </a>
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

export default ReturnPolicy;
