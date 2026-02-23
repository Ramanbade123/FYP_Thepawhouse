import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Home, FileText, Heart, DollarSign, Users, MessageCircle,
  ChevronDown, CheckCircle, Clock, Award, Phone, Mail,
  HelpCircle, PawPrint, Shield, XCircle, Search
} from 'lucide-react';

const RehomingFAQs = () => {
  const [openFaqs, setOpenFaqs] = useState({});

  const toggleFaq = (index) => {
    setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqCategories = [
    {
      id: 'general', title: 'General Rehoming', icon: Home,
      color: 'from-[#085558] to-[#0a7a8c]',
      questions: [
        { q: 'What does it mean to rehome a dog?', a: 'Rehoming means finding a loving new family for your dog when you\'re no longer able to care for them. It\'s a compassionate choice that puts your dog\'s wellbeing first.' },
        { q: 'Is rehoming my dog the right decision?', a: 'Sometimes life circumstances make rehoming the kindest option. Our team is completely non-judgemental and will support you in making the best decision for both you and your dog.' },
        { q: 'Can I rehome any breed or age of dog?', a: 'Yes. We work with all breeds and ages. Older dogs or certain breeds may take a little longer to place, but we\'re fully committed to finding the right match for every dog.' },
        { q: 'What if I just need temporary help with my dog?', a: 'We offer foster and short-term care solutions for situations like hospitalisation or family emergencies. Please contact us to discuss your specific circumstances.' },
      ]
    },
    {
      id: 'process', title: 'The Rehoming Process', icon: FileText,
      color: 'from-[#0a7a8c] to-[#0c5f6b]',
      questions: [
        { q: 'How does the rehoming process work?', a: 'It\'s a 5-step process: initial contact, completing your dog\'s profile, a meet and assessment session, finding the right match, and a supported transition to their new home.' },
        { q: 'How long does the rehoming process take?', a: 'Typically 2-4 weeks, depending on your dog\'s needs and the availability of suitable adopters. We never rush the process.' },
        { q: 'Can I meet potential adopters before deciding?', a: 'Absolutely. You have full involvement in the selection process. We arrange meet-and-greets and you have the final say in choosing the right family for your dog.' },
        { q: 'What if I change my mind during the process?', a: 'You can pause or withdraw from the process at any stage with no questions asked. Your comfort and your dog\'s wellbeing are always our top priority.' },
      ]
    },
    {
      id: 'dog-welfare', title: 'Your Dog\'s Welfare', icon: Heart,
      color: 'from-[#0c5f6b] to-[#0e4a52]',
      questions: [
        { q: 'Will my dog go to a foster home while waiting?', a: 'Your dog stays with you until the adoption is finalised, unless you specifically request temporary fostering. This reduces stress for your dog during the process.' },
        { q: 'How do you screen potential adopters?', a: 'Every potential adopter is thoroughly vetted — we review their application, conduct home checks, and assess lifestyle compatibility before any introduction is made.' },
        { q: 'What information do you need about my dog?', a: 'Veterinary records, vaccination history, behavioural traits, daily routine, diet, any medical conditions, and how they interact with children, other pets, and strangers.' },
        { q: 'Can I specify requirements for the new home?', a: 'Yes. You can outline preferences such as no young children, a garden required, or experience with the breed. We take your wishes seriously when finding a match.' },
      ]
    },
    {
      id: 'costs', title: 'Costs & Practicalities', icon: DollarSign,
      color: 'from-[#0e4a52] to-[#063630]',
      questions: [
        { q: 'Is there a fee to rehome my dog?', a: 'No. We never charge owners to rehome their dog through us. Our rehoming service is entirely free for people who need to find a new home for their pet.' },
        { q: 'Do I need to provide vet records?', a: 'Yes, sharing veterinary records helps us provide accurate health information to potential adopters and ensures continuity of care for your dog.' },
        { q: 'What happens to my dog\'s belongings?', a: 'We encourage you to send familiar items — bedding, toys, a favourite blanket — to help your dog settle into their new home more comfortably.' },
        { q: 'Can I stay in contact after rehoming?', a: 'This is arranged case by case depending on the wishes of both parties. Some adopters are happy to send updates; others prefer a clean transition for the dog.' },
      ]
    },
    {
      id: 'support', title: 'Support & After-Care', icon: Users,
      color: 'from-[#063630] to-[#008737]',
      questions: [
        { q: 'What support is available after I rehome my dog?', a: 'We offer emotional support and guidance to owners after rehoming. It can be a difficult time and our team is here to talk through any feelings you may have.' },
        { q: 'Is there a trial period after rehoming?', a: 'Yes. New adopters go through a 4-week trial period. If the match isn\'t working out for any reason, we step in to help reassess the situation.' },
        { q: 'What happens if the adoption breaks down?', a: 'We take your dog back at any point, no questions asked. We then reassess and find a more suitable placement for them.' },
        { q: 'Can I volunteer or donate to support other dogs?', a: 'Absolutely — your experience gives you a unique perspective. Many of our volunteers have been through the rehoming process. Contact us to get involved.' },
      ]
    },
  ];

  const quickLinks = [
    { title: 'Start Rehoming Process', description: 'Begin the process with our team', icon: Home, link: '/rehoming-process', color: 'bg-gradient-to-r from-[#085558] to-[#0a7a8c]' },
    { title: 'Contact Our Team', description: 'Speak with a rehoming specialist', icon: MessageCircle, link: '/contact', color: 'bg-gradient-to-r from-[#0a7a8c] to-[#0c5f6b]' },
    { title: 'Adoption Process', description: 'Learn how adoptions work', icon: PawPrint, link: '/adoption-process', color: 'bg-gradient-to-r from-[#0c5f6b] to-[#063630]' },
  ];

  const stats = [
    { value: '500+', label: 'Dogs Rehomed',        icon: Heart  },
    { value: '100%', label: 'Non-judgemental',     icon: Award  },
    { value: '24/7', label: 'Support Available',   icon: Clock  },
    { value: 'Free', label: 'No Rehoming Fees',    icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#085558]/10 to-[#0a7a8c]/10 rounded-2xl mb-6">
            <HelpCircle className="h-8 w-8 text-[#085558]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#063630] mb-4">Rehoming FAQs</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Honest answers to common questions about rehoming your dog through The Paw House. Can't find what you're looking for? Contact our team.</p>
        </motion.div>

        {/* Stats */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-[#085558]/10 to-[#0a7a8c]/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-[#085558]" />
                  </div>
                  <div className="text-2xl font-bold text-[#063630]">{stat.value}</div>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input type="text" placeholder="Search for answers..." className="w-full px-6 py-4 pl-12 rounded-xl border border-gray-200 focus:border-[#085558] focus:ring-2 focus:ring-[#085558]/20 focus:outline-none transition-all" />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* FAQ Categories */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {faqCategories.map((category, catIndex) => {
                  const CategoryIcon = category.icon;
                  return (
                    <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: catIndex * 0.1 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className={`p-6 bg-gradient-to-r ${category.color} text-white`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <CategoryIcon className="h-6 w-6 text-white" />
                          </div>
                          <h2 className="text-xl font-bold text-white">{category.title}</h2>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {category.questions.map((faq, index) => {
                          const faqIndex = `${catIndex}-${index}`;
                          const isOpen = openFaqs[faqIndex];
                          return (
                            <div key={index} className="border-b border-gray-100 last:border-b-0">
                              <button onClick={() => toggleFaq(faqIndex)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <h3 className="font-semibold text-[#063630] pr-8">{faq.q}</h3>
                                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                    <div className="px-6 pb-4 pt-2">
                                      <p className="text-gray-600">{faq.a}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl text-[#063630] mb-6 pb-4 border-b border-gray-100">Quick Actions</h3>
                <div className="space-y-4">
                  {quickLinks.map((link, index) => {
                    const LinkIcon = link.icon;
                    return (
                      <Link key={index} to={link.link} className="block group">
                        <div className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-transparent">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${link.color} text-white`}>
                              <LinkIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#063630] group-hover:text-[#085558]">{link.title}</h4>
                              <p className="text-sm text-gray-600">{link.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-gradient-to-r from-[#085558] to-[#0a7a8c] rounded-2xl p-6">
                <h3 className="font-bold text-xl mb-4 text-white">Need to Talk?</h3>
                <p className="text-white/90 mb-6">Our rehoming team is here to help — completely confidential and judgement-free.</p>
                <div className="space-y-4">
                  <a href="tel:+9779876543210" className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Phone className="h-5 w-5 text-white" /><span className="text-white">+977 9876543210</span>
                  </a>
                  <a href="mailto:rehome@thepawhouse.com" className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Mail className="h-5 w-5 text-white" /><span className="text-white">rehome@thepawhouse.com</span>
                  </a>
                  <Link to="/contact" className="block w-full bg-white text-[#085558] text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-4">Contact Form</Link>
                </div>
              </div>

              {/* Emergency box */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h4 className="font-bold text-red-800">Emergency Rehoming?</h4>
                </div>
                <p className="text-sm text-red-700 mb-4">If you need to rehome your dog urgently due to safety concerns, contact us immediately.</p>
                <a href="tel:+9779876543210" className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors" style={{ color: '#ffffff' }}>Call Emergency Line</a>
              </div>

              {/* Notes */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-amber-600" />
                  <h4 className="font-bold text-amber-800">Important Notes</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'We never charge owners to rehome their dog',
                    'Your dog stays with you until adoption is finalised',
                    'You have final say in choosing the new family',
                    'Lifetime return policy — we take dogs back anytime',
                  ].map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <span className="text-sm text-amber-700">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-16 text-center">
            <div className="bg-gradient-to-r from-[#085558]/5 to-[#0a7a8c]/5 rounded-2xl p-8 max-w-4xl mx-auto">
              <Heart className="h-12 w-12 text-[#085558] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#063630] mb-4">Making the Right Decision for Your Dog</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Rehoming is never easy, but you're putting your dog first. We'll make sure they find a home where they'll truly be cherished.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="px-8 py-3 bg-gradient-to-r from-[#085558] to-[#0a7a8c] rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2" style={{ color: '#ffffff' }}>
                  <MessageCircle className="h-5 w-5" /> Start Rehoming Process
                </Link>
                <Link to="/rehoming-process" className="px-8 py-3 border-2 border-[#085558] text-[#085558] rounded-full font-semibold hover:bg-[#085558] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5" /> View Rehoming Process
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RehomingFAQs;