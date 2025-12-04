import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Crown, Gift, Percent, Truck, Star, Sparkles, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIPProgram = () => {
  const tiers = [
    {
      name: "Green",
      spend: "0 - 999 AED",
      color: "from-green-400 to-green-600",
      benefits: ["5% off all purchases", "Birthday reward", "Early access to sales"],
    },
    {
      name: "Gold",
      spend: "1,000 - 4,999 AED",
      color: "from-yellow-400 to-amber-500",
      benefits: ["10% off all purchases", "Free delivery", "Exclusive previews", "Priority support"],
    },
    {
      name: "Platinum",
      spend: "5,000+ AED",
      color: "from-gray-300 to-gray-500",
      benefits: ["15% off all purchases", "Free express delivery", "VIP events access", "Personal plant consultant", "Exclusive gifts"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2d5a3d] via-[#3d7a52] to-[#1a3d28] text-white py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Exclusive Membership</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                Green Grass <span className="text-yellow-400">VIP</span> Program
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Join our exclusive VIP program and enjoy premium benefits, special discounts, and personalized service.
              </p>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-6 text-lg rounded-xl">
                Join VIP Program
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-[#2d5a3d] font-semibold text-sm uppercase tracking-wider">Exclusive Benefits</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">Why Join Our VIP Program?</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Percent, title: "Exclusive Discounts", desc: "Up to 15% off on all purchases" },
                { icon: Truck, title: "Free Delivery", desc: "Free shipping on all orders" },
                { icon: Gift, title: "Birthday Rewards", desc: "Special gift on your birthday" },
                { icon: Clock, title: "Early Access", desc: "Shop new arrivals before anyone" },
              ].map((benefit, idx) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#2d5a3d]/10 flex items-center justify-center group-hover:bg-[#2d5a3d] transition-colors">
                    <benefit.icon className="w-8 h-8 text-[#2d5a3d] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-[#2d5a3d] font-semibold text-sm uppercase tracking-wider">Membership Tiers</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">Choose Your Level</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                The more you shop, the more you earn. Progress through tiers based on your annual spending.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {tiers.map((tier, idx) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative bg-white rounded-3xl shadow-lg overflow-hidden ${idx === 2 ? 'ring-2 ring-[#2d5a3d]' : ''}`}
                >
                  {idx === 2 && (
                    <div className="absolute top-4 right-4 bg-[#2d5a3d] text-white text-xs font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </div>
                  )}
                  <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                        <p className="text-sm text-gray-500">Annual Spend: {tier.spend}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mt-8">
                      {tier.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#2d5a3d]/10 flex items-center justify-center flex-shrink-0">
                            <Star className="w-3 h-3 text-[#2d5a3d]" />
                          </div>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full mt-8 ${idx === 2 ? 'bg-[#2d5a3d] hover:bg-[#234830]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    >
                      {idx === 0 ? 'Start Here' : 'Upgrade Now'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-[#f8f7f4]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-[#2d5a3d] font-semibold text-sm uppercase tracking-wider">Simple Process</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">How It Works</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Sign Up", desc: "Create your free VIP account in seconds" },
                { step: "02", title: "Shop & Earn", desc: "Every purchase moves you closer to the next tier" },
                { step: "03", title: "Enjoy Benefits", desc: "Unlock exclusive perks and rewards" },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-[#2d5a3d]/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-[#2d5a3d] to-[#1a3d28] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Ready to Become a VIP?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join today and start earning rewards with your very first purchase.
              </p>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10 py-6 text-lg rounded-xl">
                Join Now – It's Free
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VIPProgram;
