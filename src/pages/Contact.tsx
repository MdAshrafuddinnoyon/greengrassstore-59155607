import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Stores",
      details: [
        "Dubai: Al Quoz Industrial Area 3",
        "Abu Dhabi: Musaffah Industrial Area",
      ],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+971 54 775 1901"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@greengrassstore.com"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Sat - Thu: 9:00 AM - 9:00 PM", "Friday: 2:00 PM - 9:00 PM"],
    },
  ];

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
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Get In Touch</h1>
              <p className="text-xl text-white/90">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <section className="py-16 -mt-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2d5a3d]/10 flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-[#2d5a3d]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#2d5a3d] font-semibold text-sm uppercase tracking-wider">Send Message</span>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mt-2 mb-8">Contact Form</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 123 4567"
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        required
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      required
                      className="min-h-[150px] rounded-xl border-gray-200 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#2d5a3d] hover:bg-[#234830] text-white font-semibold rounded-xl text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Map & Quick Contact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.7395738558244!2d55.26!3d25.20!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzAwLjAiTiA1NcKwMTUnMzYuMCJF!5e0!3m2!1sen!2sae!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Store Location"
                  />
                </div>

                {/* Quick Connect */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Connect</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://wa.me/971547751901"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-semibold">WhatsApp</span>
                    </a>
                    <a
                      href="tel:+971547751901"
                      className="flex items-center gap-3 p-4 bg-[#2d5a3d] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Phone className="w-6 h-6" />
                      <span className="font-semibold">Call Us</span>
                    </a>
                    <a
                      href="https://www.instagram.com/greengrass_decor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="w-6 h-6" />
                      <span className="font-semibold">Instagram</span>
                    </a>
                    <a
                      href="https://www.facebook.com/greengrassstore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Facebook className="w-6 h-6" />
                      <span className="font-semibold">Facebook</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Have Questions?
              </h2>
              <p className="text-gray-600 mb-6">
                Check out our frequently asked questions for quick answers.
              </p>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 text-[#2d5a3d] font-semibold hover:underline"
              >
                Visit FAQ Page →
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
