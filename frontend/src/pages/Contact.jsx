import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  CheckCircle,
  PawPrint,
  ArrowRight // ADD THIS IMPORT
} from 'lucide-react';

const Contact = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [formState, setFormState] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('loading');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 5000);
    }, 1500);
  };

  const contactDetails = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Direct line to our rescue team",
      value: "+977 9876543210",
      link: "tel:+9779876543210"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions",
      value: "support@thepawhouse.com",
      link: "mailto:support@thepawhouse.com"
    },
    {
      icon: MapPin,
      title: "Adoption Center",
      description: "Visit our furry friends",
      value: "Bhaktapur, Nepal",
      link: "#"
    },
    {
      icon: Clock,
      title: "Working Hours",
      description: "We are available",
      value: "Daily: 9AM - 6PM",
      link: "#"
    }
  ];

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-[#063630] to-[#05221C] text-white">
        <div className="absolute inset-0 opacity-5">
          <PawPrint className="absolute top-10 left-10 w-32 h-32 rotate-12" />
          <PawPrint className="absolute bottom-10 right-10 w-48 h-48 -rotate-12" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <MessageSquare className="h-4 w-4 text-[#008737]" />
            <span className="text-sm font-semibold text-white">Get in Touch</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#c6f7d9]">We'd Love To Hear From You</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Whether you're looking to adopt, volunteer, or just have a question about dog care, our team in Nepal is here to help.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-32 container mx-auto px-4" ref={ref}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Contact Info & Cards - SIMPLE DESIGN */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Contact Information</h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Our support team typically responds within 24 hours. For emergencies regarding injured street dogs, please call our 24/7 hotline directly.
              </p>
            </motion.div>

            {/* SIMPLE VERTICAL LAYOUT */}
            <div className="space-y-6">
              {contactDetails.map((detail, idx) => (
                <motion.a
                  key={idx}
                  href={detail.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-white p-6 rounded-3xl shadow-xl border border-[#008737]/5 hover:shadow-2xl transition-all block group"
                >
                  <div className="flex items-center gap-5">
                    {/* Icon with colored background */}
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#008737]/10 to-[#085558]/10">
                        <detail.icon className="h-6 w-6 text-[#008737]" />
                      </div>
                    </div>
                    
                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-[#063630] mb-1">{detail.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{detail.description}</p>
                      <p className="font-bold text-[#008737] text-lg break-words leading-tight">
                        {detail.value}
                      </p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 rounded-full bg-[#008737]/10">
                        <ArrowRight className="h-4 w-4 text-[#008737]" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl border border-white relative overflow-hidden">
              {formState === 'success' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-gray-600 text-lg max-w-sm">
                    Thank you for reaching out. A member of our team will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setFormState('idle')}
                    className="mt-8 text-[#008737] font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}

              <h3 className="text-2xl lg:text-3xl font-bold mb-8">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl bg-[#EDEDED] border-2 border-transparent focus:border-[#008737] focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 rounded-2xl bg-[#EDEDED] border-2 border-transparent focus:border-[#008737] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-[#EDEDED] border-2 border-transparent focus:border-[#008737] focus:bg-white transition-all outline-none appearance-none">
                    <option>General Inquiry</option>
                    <option>Adoption Question</option>
                    <option>Volunteering</option>
                    <option>Donation Support</option>
                    <option>Report a Dog in Need</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Your Message</label>
                  <textarea 
                    required
                    rows="5"
                    placeholder="How can we help you and our furry friends?"
                    className="w-full px-6 py-4 rounded-2xl bg-[#EDEDED] border-2 border-transparent focus:border-[#008737] focus:bg-white transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formState === 'loading'}
                  type="submit"
                  className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-xl ${
                    formState === 'loading' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#008737] to-[#085558] text-white hover:shadow-2xl'
                  }`}
                >
                  {formState === 'loading' ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="pb-20 lg:pb-32 px-4 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="h-[400px] lg:h-[500px] bg-white rounded-[40px] shadow-2xl border-8 border-white overflow-hidden relative group"
        >
          {/* This would be a Google Map in production */}
          <div className="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-white rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="h-10 w-10 text-[#008737]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Visit our Adoption Center</h3>
            <p className="text-gray-500 max-w-sm">Bhaktapur Road, Kathmandu Valley, Nepal. <br/> Open for visitors daily.</p>
            <button className="mt-8 px-8 py-3 bg-[#063630] text-white rounded-xl font-bold shadow-lg hover:bg-[#008737] transition-colors">
              Open in Google Maps
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;