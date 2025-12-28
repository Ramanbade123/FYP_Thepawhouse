import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PawPrint, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail("");
    }
  };

  const quickLinksLeft = [
    { title: "Adopt a pet", href: "#" },
    { title: "Adopt FAQs", href: "#" },
    { title: "Care Guide", href: "#" },
    { title: "Contact", href: "#" }
  ];

  const quickLinksRight = [
    { title: "Rehome a pet", href: "#" },
    { title: "Rehome FAQs", href: "#" },
    { title: "About Us", href: "#" },
    { title: "Blog", href: "#" }
  ];

  const socialMedia = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" }
  ];

  return (
    <footer
      ref={ref}
      className="bg-gradient-to-b from-[#063630] to-[#05221C] text-white pt-12 lg:pt-16 pb-8 relative overflow-hidden"
    >
      {/* Decorative Paw Prints */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], rotate: [0, 360] }}
            transition={{ duration: 6 + i, repeat: Infinity }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          >
            <PawPrint className="h-8 w-8" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8 lg:mb-12">

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg lg:text-xl font-bold mb-6 pb-3 border-b border-white text-white">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-3">
                {quickLinksLeft.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-white hover:text-white transition-colors text-sm lg:text-base py-1 hover:translate-x-1 duration-200"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
              <div className="space-y-3">
                {quickLinksRight.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-white hover:text-white transition-colors text-sm lg:text-base py-1 hover:translate-x-1 duration-200"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg lg:text-xl font-bold mb-6 pb-3 border-b border-white text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Bhaktapur, Nepal</p>
                  <p className="text-white text-sm">Headquarters & Adoption Center</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white flex-shrink-0" />
                <a href="tel:+9779876543210" className="text-white hover:text-white transition-colors">
                  +977 9876543210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white flex-shrink-0" />
                <a href="mailto:support@thepawhouse.com" className="text-white hover:text-white transition-colors text-sm lg:text-base break-all">
                  support@thepawhouse.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg lg:text-xl font-bold mb-6 pb-3 border-b border-white text-white">Stay Updated</h3>
            <p className="text-white mb-4 text-sm lg:text-base leading-relaxed">
              Join our newsletter for adoption stories, pet care tips, and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-xl bg-[#05221C] border border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white text-sm lg:text-base pr-12"
                />
                <Send className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Subscribe Now</span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mt-6">
          {socialMedia.map((item, index) => {
            const Icon = item.icon;
            return (
              <a key={index} href={item.href} className="text-white hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-white/20 pt-4 text-center text-white text-sm lg:text-base">
          &copy; {currentYear} The Paw House. All rights reserved.
        </div>

        {/* Back to Top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 p-3 lg:p-4 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
