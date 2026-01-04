import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  User,
  Home,
  Calendar,
  Shield,
  DollarSign,
  Heart,
  PawPrint,
  Users,
  FileText,
  MessageCircle,
  ChevronDown,
  CheckCircle,
  Clock,
  Award,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react';

const AdoptionFAQs = () => {
  const [openFaqs, setOpenFaqs] = useState({});

  const toggleFaq = (index) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Main FAQ Categories
  const faqCategories = [
    {
      id: 'eligibility',
      title: 'Eligibility & Requirements',
      icon: User,
      color: 'from-[#008737] to-[#085558]',
      questions: [
        {
          q: 'What are the basic requirements to adopt a dog?',
          a: 'You must be at least 21 years old, have valid ID, provide proof of address, and consent to a home check. Renters need landlord permission.'
        },
        {
          q: 'Do I need a garden to adopt a dog?',
          a: 'Not necessarily. Many dogs adapt well to apartment living with regular walks. We assess each dog\'s exercise needs individually.'
        },
        {
          q: 'Can I adopt if I work full-time?',
          a: 'Yes, many adopters work full-time. We help match you with dogs who are comfortable alone or can arrange dog walking/daycare.'
        },
        {
          q: 'Is there an age restriction for adoption?',
          a: 'Primary adopters must be 21+, but we welcome family adoptions with children of any age (matched appropriately).'
        }
      ]
    },
    {
      id: 'process',
      title: 'Adoption Process',
      icon: FileText,
      color: 'from-[#085558] to-[#0a7a8c]',
      questions: [
        {
          q: 'How long does the adoption process take?',
          a: 'Typically 2-4 weeks from application to adoption. This allows for proper matching, home checks, and transition planning.'
        },
        {
          q: 'What does the home check involve?',
          a: 'A virtual or in-person visit to ensure your home is safe and suitable. We look for secure fencing, hazards, and overall environment.'
        },
        {
          q: 'Can I meet multiple dogs before deciding?',
          a: 'Yes, we encourage multiple meetings to ensure the right match. Your happiness and the dog\'s well-being are our priorities.'
        },
        {
          q: 'What if the adoption doesn\'t work out?',
          a: 'We offer a trial period and lifelong support. If rehoming becomes necessary, we take the dog back at any time.'
        }
      ]
    },
    {
      id: 'costs',
      title: 'Costs & Fees',
      icon: DollarSign,
      color: 'from-[#0a7a8c] to-[#0c5f6b]',
      questions: [
        {
          q: 'How much does it cost to adopt?',
          a: 'Our adoption fees range from £150-£300 depending on the dog\'s age and needs. This includes vaccinations, microchipping, and neutering.'
        },
        {
          q: 'What does the adoption fee cover?',
          a: 'Veterinary care (vaccinations, microchip, neutering), behavioral assessment, 4 weeks insurance, and ongoing support.'
        },
        {
          q: 'Are there any hidden costs?',
          a: 'No hidden fees. We provide full transparency about all costs upfront during your consultation.'
        },
        {
          q: 'Do you offer payment plans?',
          a: 'Yes, we can arrange payment plans for adoption fees. Contact us to discuss options.'
        }
      ]
    },
    {
      id: 'post-adoption',
      title: 'Post-Adoption Support',
      icon: Heart,
      color: 'from-[#0c5f6b] to-[#063630]',
      questions: [
        {
          q: 'What support do you offer after adoption?',
          a: 'Lifetime support including behavioral advice, training resources, 24/7 helpline, and access to our vet partners.'
        },
        {
          q: 'Is there a trial period?',
          a: 'Yes, a 4-week trial period to ensure you and your new dog are perfectly matched.'
        },
        {
          q: 'What if I need help with training?',
          a: 'We offer free initial training sessions and discounted rates with our partner trainers.'
        },
        {
          q: 'Can I return a dog after adoption?',
          a: 'Yes, we have a lifelong return policy. We\'ll take any dog back, no questions asked.'
        }
      ]
    }
  ];

  // Quick Links
  const quickLinks = [
    {
      title: 'Start Adoption Process',
      description: 'Begin your journey to find a canine companion',
      icon: Search,
      link: '/adopt',
      color: 'bg-gradient-to-r from-[#008737] to-[#085558]'
    },
    {
      title: 'Contact Our Team',
      description: 'Speak with an adoption specialist',
      icon: MessageCircle,
      link: '/contact',
      color: 'bg-gradient-to-r from-[#085558] to-[#0a7a8c]'
    },
    {
      title: 'View Available Dogs',
      description: 'Browse our current residents',
      icon: PawPrint,
      link: '/adopt/browse',
      color: 'bg-gradient-to-r from-[#0a7a8c] to-[#0c5f6b]'
    }
  ];

  // Stats
  const stats = [
    { value: '500+', label: 'Dogs Rehomed', icon: Heart },
    { value: '98%', label: 'Success Rate', icon: Award },
    { value: '24/7', label: 'Support Available', icon: Clock },
    { value: '4 weeks', label: 'Trial Period', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#008737]/10 to-[#085558]/10 rounded-2xl mb-6">
            <HelpCircle className="h-8 w-8 text-[#008737]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#063630] mb-4">
            Adoption FAQs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about adopting a dog through The Paw House.
            Can't find what you're looking for? Contact our team.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-[#008737]/10 to-[#085558]/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-[#008737]" />
                  </div>
                  <div className="text-2xl font-bold text-[#063630]">{stat.value}</div>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full px-6 py-4 pl-12 rounded-xl border border-gray-200 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 focus:outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Main FAQ Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* FAQ Categories */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {faqCategories.map((category, catIndex) => {
                  const CategoryIcon = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      {/* Category Header */}
                      <div className={`p-6 bg-gradient-to-r ${category.color} text-white`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <CategoryIcon className="h-6 w-6" />
                          </div>
                          <h2 className="text-xl font-bold">{category.title}</h2>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="divide-y divide-gray-100">
                        {category.questions.map((faq, index) => {
                          const faqIndex = `${catIndex}-${index}`;
                          const isOpen = openFaqs[faqIndex];
                          return (
                            <div key={index} className="border-b border-gray-100 last:border-b-0">
                              <button
                                onClick={() => toggleFaq(faqIndex)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <h3 className="font-semibold text-[#063630] pr-8">
                                  {faq.q}
                                </h3>
                                <ChevronDown 
                                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                                    isOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                              
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
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
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl text-[#063630] mb-6 pb-4 border-b border-gray-100">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  {quickLinks.map((link, index) => {
                    const LinkIcon = link.icon;
                    return (
                      <Link
                        key={index}
                        to={link.link}
                        className="block group"
                      >
                        <div className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-transparent">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${link.color} text-white`}>
                              <LinkIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#063630] group-hover:text-[#008737]">
                                {link.title}
                              </h4>
                              <p className="text-sm text-gray-600">{link.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-r from-[#008737] to-[#085558] rounded-2xl p-6 text-white">
                <h3 className="font-bold text-xl mb-4">Still Have Questions?</h3>
                <p className="text-white/90 mb-6">
                  Our adoption team is here to help you find the perfect match.
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+18005551234"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call: (800) 555-1234</span>
                  </a>
                  <a
                    href="mailto:adopt@thepawhouse.com"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email: adopt@thepawhouse.com</span>
                  </a>
                  <Link
                    to="/contact"
                    className="block w-full bg-white text-[#008737] text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-4"
                  >
                    Contact Form
                  </Link>
                </div>
              </div>

              {/* Emergency Info */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-amber-600" />
                  <h4 className="font-bold text-amber-800">Important Notes</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <span className="text-sm text-amber-700">All adoptions include a 4-week trial period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <span className="text-sm text-amber-700">Home checks are mandatory for all adoptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <span className="text-sm text-amber-700">Lifetime return policy - we take dogs back anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <span className="text-sm text-amber-700">All dogs are vaccinated, microchipped & neutered</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-[#008737]/5 to-[#085558]/5 rounded-2xl p-8 max-w-4xl mx-auto">
              <Users className="h-12 w-12 text-[#008737] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#063630] mb-4">
                Ready to Meet Your New Best Friend?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Thousands of dogs have found loving homes through our careful matching process. 
                Your perfect companion is waiting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/adopt"
                  className="px-8 py-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  Browse Available Dogs
                </Link>
                <Link
                  to="/adoption-process"
                  className="px-8 py-3 border-2 border-[#085558] text-[#085558] rounded-full font-semibold hover:bg-[#085558] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  View Adoption Process
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionFAQs;