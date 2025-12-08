import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Leaf, Heart, Globe2, Award } from "lucide-react";
import gardenFlowers from "@/assets/garden-flowers.jpg";
import womanPlant from "@/assets/woman-plant.jpg";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img
              src={gardenFlowers}
              alt="Green Grass Store"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">About Green Grass</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Bringing nature into every home across the UAE with premium plants, pots, and home decor since 2018.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#2d5a3d] font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3 mb-6">
                  A Passion for Plants & Beautiful Spaces
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in Dubai in 2018, Green Grass Store began with a simple mission: to make high-quality plants and home decor accessible to everyone in the UAE.
                  </p>
                  <p>
                    What started as a small nursery has grown into a beloved destination for plant enthusiasts, interior designers, and anyone looking to add a touch of nature to their space.
                  </p>
                  <p>
                    Today, we offer an extensive collection of indoor and outdoor plants, premium pots and planters, and carefully curated home accessories – all selected to help you create your perfect green oasis.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={womanPlant}
                  alt="Our Story"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-8 -left-8 bg-[#2d5a3d] text-white p-6 rounded-xl shadow-lg">
                  <span className="text-4xl font-bold">6+</span>
                  <p className="text-sm text-white/80">Years of Excellence</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-[#2d5a3d] font-semibold text-sm uppercase tracking-wider">Our Values</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">What We Stand For</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Leaf, title: "Sustainability", desc: "Eco-friendly practices in everything we do" },
                { icon: Heart, title: "Quality", desc: "Only the finest plants and products" },
                { icon: Globe2, title: "UAE Focused", desc: "Curated for the local climate" },
                { icon: Award, title: "Excellence", desc: "Award-winning customer service" },
              ].map((value, idx) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#2d5a3d]/10 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-[#2d5a3d]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10K+", label: "Happy Customers" },
                { value: "500+", label: "Products" },
                { value: "2", label: "Store Locations" },
                { value: "24/7", label: "Support" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <span className="text-5xl md:text-6xl font-bold text-[#2d5a3d]">{stat.value}</span>
                  <p className="text-gray-600 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#2d5a3d]">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Ready to Transform Your Space?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Visit our stores in Dubai and Abu Dhabi or shop online for the best selection of plants and home decor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-white text-[#2d5a3d] font-semibold rounded-xl hover:bg-gray-100 transition-colors text-center"
                >
                  Shop Now
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center"
                >
                  Contact Us
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

export default About;
