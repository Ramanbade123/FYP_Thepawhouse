import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const adopterFaqs = [
  {
    question: "How do I adopt a dog?",
    answer: "Browse our available dogs, click 'Apply for Adoption' on a dog's profile, and fill out the application form. The rehomer or shelter will review it and get back to you to arrange a meet-and-greet."
  },
  {
    question: "Is there an adoption fee?",
    answer: "Adoption fees vary depending on the rehomer or shelter. Some individuals may not charge a fee, while shelters typically charge a fee that covers vaccinations, microchipping, and spay/neuter surgeries."
  },
  {
    question: "How long does the application process take?",
    answer: "It typically takes 1-3 days for a rehomer to review an application. To speed up the process, ensure your profile is complete and you've provided thorough answers to the application questions."
  }
];

const rehomerFaqs = [
  {
    question: "How do I list a dog for rehoming?",
    answer: "Log in to your Rehomer dashboard, go to 'My Dogs', and click 'Add New Dog'. Provide high-quality photos, detailed medical history, and accurate behavioral characteristics to find the best match."
  },
  {
    question: "What happens after I approve an application?",
    answer: "Once approved, you should contact the adopter via our messaging system to schedule a meet-and-greet. If all goes well, you can finalize the adoption and mark the dog as 'Adopted' in your dashboard."
  },
  {
    question: "How do I review an adoption application?",
    answer: "Go to the 'Applications' tab to see all submitted forms. You can view the adopter's profile, experience level, and responses. If you have questions, use the messaging system to interview them before deciding."
  }
];

const HelpAndSupport = ({ role }) => {
  const [openFaq, setOpenFaq] = useState(null);
  
  const faqs = role === 'rehomer' ? rehomerFaqs : adopterFaqs;

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-8">
      {/* Header section */}
      <div className="bg-gradient-to-br from-[#085558] text-white to-[#008737] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6 text-white">
            <HelpCircle className="h-4 w-4" /> Help Center
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
            How can we help you today?
          </h1>
          <p className="text-white/90 text-lg">
            Find answers to common questions, learn how to use The Paw House, or get in touch with our support team.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl shadow-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-black/10 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Contact / Quick Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#063630] mb-4">Contact Support</h3>
            <p className="text-sm text-gray-500 mb-6">Need immediate assistance? Our team is here to help.</p>
            
            <div className="space-y-4">
              <a href="mailto:support@thepawhouse.com" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#008737]/10 flex items-center justify-center group-hover:bg-[#008737] transition-colors">
                  <Mail className="h-5 w-5 text-[#008737] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#063630]">Email Us</p>
                  <p className="text-xs text-gray-500 hover:text-[#008737]">support@thepawhouse.com</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#008737]/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#008737]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#063630]">Call Us (Mon-Fri)</p>
                  <p className="text-xs text-gray-500">1-800-PAWHOUSE</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 bg-gradient-to-b from-white to-gray-50">
            <h3 className="text-lg font-bold text-[#063630] mb-4">Community Guidelines</h3>
            <p className="text-sm text-gray-600 mb-4">
              To ensure a safe environment for humans and pets, please review our platform policies.
            </p>
            <button className="flex items-center gap-2 text-sm font-semibold text-[#008737] hover:text-[#085558] transition-colors">
              Read Guidelines <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right column: FAQs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#063630] mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm mb-6">Everything you need to know about adopting and rehoming pets.</p>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                    openFaq === idx ? 'border-[#008737] bg-[#008737]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                  >
                    <span className={`font-semibold text-sm md:text-base pr-4 ${openFaq === idx ? 'text-[#085558]' : 'text-gray-700'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'bg-[#008737] rotate-180' : 'bg-gray-100'}`}>
                      <ChevronDown className={`h-4 w-4 ${openFaq === idx ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 pt-1 text-gray-600 text-sm md:text-base leading-relaxed border-t border-[#008737]/10 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MessageSquare className="h-6 w-6 text-[#085558]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#063630]">Still have questions?</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Can't find the answer you're looking for? Message the site administrator through your user dashboard logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
