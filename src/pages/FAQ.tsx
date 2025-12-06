import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Truck, RefreshCw, CreditCard, ShieldCheck, Phone, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FAQItem {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category: string;
  order: number;
}

interface FAQCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  order: number;
}

const defaultCategories: FAQCategory[] = [
  { id: '1', name: 'Shipping & Delivery', nameAr: 'الشحن والتوصيل', icon: 'truck', order: 1 },
  { id: '2', name: 'Returns & Exchange', nameAr: 'الإرجاع والاستبدال', icon: 'refresh', order: 2 },
  { id: '3', name: 'Payment', nameAr: 'الدفع', icon: 'credit-card', order: 3 },
  { id: '4', name: 'Product Quality', nameAr: 'جودة المنتجات', icon: 'shield', order: 4 },
  { id: '5', name: 'Support & Contact', nameAr: 'الدعم والتواصل', icon: 'phone', order: 5 },
];

const defaultFaqs: FAQItem[] = [
  { id: '1', question: 'What areas do you deliver to?', questionAr: 'ما هي مناطق التوصيل؟', answer: 'We deliver across all UAE including Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.', answerAr: 'نقوم بالتوصيل إلى جميع أنحاء الإمارات العربية المتحدة.', category: '1', order: 1 },
  { id: '2', question: 'How long does delivery take?', questionAr: 'كم تستغرق عملية التوصيل؟', answer: 'Delivery typically takes 2-5 business days within Dubai and 3-7 business days for other Emirates.', answerAr: 'عادة ما يستغرق التوصيل 2-5 أيام عمل داخل دبي.', category: '1', order: 2 },
  { id: '3', question: 'What is your return policy?', questionAr: 'ما هي سياسة الإرجاع؟', answer: 'You can return products within 14 days of receiving your order. Products must be in their original condition.', answerAr: 'يمكنك إرجاع المنتجات خلال 14 يومًا من تاريخ الاستلام.', category: '2', order: 1 },
  { id: '4', question: 'What payment methods do you accept?', questionAr: 'ما هي طرق الدفع المتاحة؟', answer: 'We accept Credit/Debit cards, Cash on Delivery, Apple Pay, and Tabby for installments.', answerAr: 'نقبل بطاقات الائتمان/الخصم والدفع عند الاستلام.', category: '3', order: 1 },
  { id: '5', question: 'Are the plants real or artificial?', questionAr: 'هل النباتات حقيقية أم اصطناعية؟', answer: 'We offer high-quality artificial plants that look like real ones.', answerAr: 'نقدم نباتات اصطناعية عالية الجودة تبدو وكأنها حقيقية.', category: '4', order: 1 },
  { id: '6', question: 'How can I contact you?', questionAr: 'كيف يمكنني التواصل معكم؟', answer: 'You can contact us via WhatsApp at +971547751901 or through our Contact Us page.', answerAr: 'يمكنك التواصل معنا عبر واتساب على +971547751901.', category: '5', order: 1 },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'truck': <Truck className="w-5 h-5" />,
  'refresh': <RefreshCw className="w-5 h-5" />,
  'credit-card': <CreditCard className="w-5 h-5" />,
  'shield': <ShieldCheck className="w-5 h-5" />,
  'phone': <Phone className="w-5 h-5" />,
};

const FAQ = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FAQCategory[]>(defaultCategories);
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFaqs);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .in('setting_key', ['faq_categories', 'faq_items']);

        if (error) throw error;

        data?.forEach((setting) => {
          if (setting.setting_key === 'faq_categories') {
            const cats = setting.setting_value as unknown as FAQCategory[];
            if (Array.isArray(cats) && cats.length > 0) {
              setCategories(cats);
            }
          } else if (setting.setting_key === 'faq_items') {
            const items = setting.setting_value as unknown as FAQItem[];
            if (Array.isArray(items) && items.length > 0) {
              setFaqs(items);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedFaqs = categories.map(cat => ({
    ...cat,
    faqs: faqs.filter(faq => faq.category === cat.id).sort((a, b) => a.order - b.order)
  })).filter(cat => cat.faqs.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2d5a3d] to-[#1a3d2a] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                {isArabic 
                  ? "ابحث عن إجابات لأسئلتك الأكثر شيوعًا حول منتجاتنا وخدماتنا"
                  : "Find answers to your most common questions about our products and services"
                }
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-8">
                {groupedFaqs.map((category, categoryIndex) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2d5a3d]/10 rounded-lg flex items-center justify-center text-[#2d5a3d]">
                          {categoryIcons[category.icon] || <HelpCircle className="w-5 h-5" />}
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {isArabic ? category.nameAr : category.name}
                        </h2>
                      </div>
                    </div>

                    {/* FAQs */}
                    <Accordion type="single" collapsible className="px-2">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem key={faq.id} value={`item-${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="px-4 py-4 text-left hover:no-underline">
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              {isArabic ? faq.questionAr : faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                              {isArabic ? faq.answerAr : faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 text-center bg-gradient-to-br from-[#2d5a3d] to-[#1a3d2a] rounded-2xl p-8 md:p-12 text-white"
            >
              <h3 className="text-2xl font-bold mb-3">
                {isArabic ? "لم تجد إجابتك؟" : "Didn't find your answer?"}
              </h3>
              <p className="text-white/80 mb-6">
                {isArabic 
                  ? "تواصل معنا مباشرة وسنساعدك في أقرب وقت ممكن"
                  : "Contact us directly and we'll help you as soon as possible"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/+971547751901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-colors"
                >
                  {isArabic ? "واتساب" : "WhatsApp"}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                >
                  {isArabic ? "صفحة الاتصال" : "Contact Page"}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
