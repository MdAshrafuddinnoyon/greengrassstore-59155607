import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "সব প্রোডাক্ট", href: "/shop" },
    { name: "নতুন আগমন", href: "/new-arrivals" },
    { name: "বেস্ট সেলার", href: "/best-sellers" },
    { name: "সেল", href: "/sale" },
  ],
  company: [
    { name: "আমাদের সম্পর্কে", href: "/about" },
    { name: "যোগাযোগ", href: "/contact" },
    { name: "ক্যারিয়ার", href: "/careers" },
    { name: "ব্লগ", href: "/blog" },
  ],
  help: [
    { name: "FAQs", href: "/faqs" },
    { name: "শিপিং", href: "/shipping" },
    { name: "রিটার্ন", href: "/returns" },
    { name: "সাইজ গাইড", href: "/size-guide" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              আমাদের সাথে যুক্ত থাকুন
            </h3>
            <p className="text-background/70 mb-6">
              নতুন কালেকশন, এক্সক্লুসিভ অফার এবং স্টাইল টিপস পেতে সাবস্ক্রাইব করুন।
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="আপনার ইমেইল"
                className="flex-1 px-4 py-3 bg-background/10 border border-background/20 rounded-lg text-background placeholder:text-background/50 focus:outline-none focus:border-background/40 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
              >
                সাবস্ক্রাইব
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">GreenGrass</span>
            </a>
            <p className="text-background/70 text-sm mb-6 max-w-xs">
              প্রকৃতি থেকে অনুপ্রাণিত, সাস্টেইনেবল ফ্যাশনের একটি নতুন অধ্যায়।
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              শপ
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              কোম্পানি
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              সাহায্য
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              যোগাযোগ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>১২৩ গ্রিন স্ট্রিট, ঢাকা ১২০৫, বাংলাদেশ</span>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-3 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +৮৮০ ১২৩৪ ৫৬৭৮৯০
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@greengrass.com"
                  className="flex items-center gap-3 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  hello@greengrass.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>© ২০২৫ GreenGrass। সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-background transition-colors">
                প্রাইভেসি পলিসি
              </a>
              <a href="/terms" className="hover:text-background transition-colors">
                শর্তাবলী
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
