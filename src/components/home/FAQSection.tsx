import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do you deliver across UAE?",
    answer: "Yes, we deliver to all Emirates including Dubai, Abu Dhabi, Sharjah, Ajman, Fujairah, Ras Al Khaimah, and Umm Al Quwain. Free delivery on orders over 200 AED."
  },
  {
    question: "How do I care for indoor plants?",
    answer: "Most indoor plants need indirect sunlight, watering once a week, and occasional fertilizing. Each plant comes with specific care instructions. Our team is also available via WhatsApp to answer any care questions."
  },
  {
    question: "Can I return or exchange products?",
    answer: "Yes, we offer a 7-day return policy for undamaged items. Plants can be exchanged if they arrive damaged. Please contact us within 24 hours of delivery for plant-related issues."
  },
  {
    question: "Do you offer custom plant arrangements?",
    answer: "Absolutely! We specialize in custom plant arrangements for homes, offices, and events. Submit a custom request through our website or contact us on WhatsApp to discuss your requirements."
  },
  {
    question: "Are your plants real or artificial?",
    answer: "We offer both real and artificial plants. Real plants are freshly sourced and come with care guides. Our artificial plants are premium quality and look incredibly realistic."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards through our secure checkout, as well as Cash on Delivery (COD) for orders within UAE. You can also order via WhatsApp."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-16 md:py-20 bg-[#f8f8f5]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
            Got Questions?
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg px-6 border-none shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
