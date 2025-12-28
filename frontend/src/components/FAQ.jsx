import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { ChevronDown, HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react'

const FAQ = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How can I adopt a dog from The Paw House?",
      answer: "Our adoption process is simple and transparent. Browse available dogs, fill out an adoption application, schedule a meet-and-greet, and complete the adoption paperwork. Our team guides you through every step."
    },
    {
      question: "Are the dogs vaccinated and healthy?",
      answer: "Yes! All dogs are fully vaccinated, dewormed, neutered/spayed, and receive comprehensive health check-ups from certified veterinarians. We provide complete medical records."
    },
    {
      question: "Can I adopt a dog if I live in an apartment?",
      answer: "Absolutely! We help match you with dogs suited for your living space. We consider energy levels, size, and temperament to ensure a perfect fit for apartment living."
    },
    {
      question: "What is the adoption fee and what does it cover?",
      answer: "Adoption fees range from Rs. 5,000 to Rs. 15,000 depending on the dog. This covers vaccinations, neutering/spaying, microchipping, health check-ups, and a starter pack with essentials."
    },
    {
      question: "Can I meet the dog before adopting?",
      answer: "Yes! We encourage multiple meet-and-greet sessions - both virtual and in-person - to ensure it's the right match for you and your family. We also offer trial adoptions."
    },
    {
      question: "Do you provide post-adoption support?",
      answer: "Yes! We provide 6 months of post-adoption support including training guidance, nutrition advice, and behavioral consultations. Our team is available 24/7 for emergencies."
    },
    {
      question: "What if the adoption doesn't work out?",
      answer: "We offer a 30-day trial period. If things don't work out, we'll take the dog back and help you find a better match. Our priority is finding the right forever home."
    },
    {
      question: "How long does the adoption process take?",
      answer: "Typically 3-7 days from application to bringing your new friend home. We prioritize thorough matching over speed to ensure lifelong happiness for both pet and family."
    }
  ]

  const supportChannels = [
    {
      icon: Phone,
      title: "Call Support",
      description: "+977 9876543210",
      action: "Available 24/7"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@thepawhouse.com",
      action: "Response within 2 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team",
      action: "Available 9AM-9PM"
    }
  ]

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#EDEDED]" ref={ref}>
      <div className="container mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-6"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">Need Help?</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063630] mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">Questions</span>
          </h2>
          <p className="text-lg lg:text-xl text-[#063630]/80 max-w-3xl mx-auto mb-8">
            Everything you need to know about adopting dogs with The Paw House. Can't find your answer? Contact our support team.
          </p>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 lg:mb-16 max-w-4xl mx-auto">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-[#008737]/10 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full flex items-center justify-center mb-4">
                    <channel.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#063630] mb-2">{channel.title}</h4>
                  <p className="text-[#063630]/80 mb-2">{channel.description}</p>
                  <p className="text-[#008737] text-sm font-medium">{channel.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 lg:space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#008737]/10"
              >
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className="w-full p-6 lg:p-8 text-left flex justify-between items-center gap-6 group"
                >
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold text-[#063630] mb-2">
                      {faq.question}
                    </h3>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-[#063630]/70 leading-relaxed overflow-hidden text-base lg:text-lg"
                        >
                          {faq.answer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <div className="w-10 h-10 bg-[#008737]/10 rounded-full flex items-center justify-center group-hover:bg-[#008737]/20 transition-colors">
                      <ChevronDown className="h-5 w-5 lg:h-6 lg:w-6 text-[#008737]" />
                    </div>
                  </motion.div>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Still Have Questions? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 lg:mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-[#008737] to-[#085558] rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-white/90 mb-6 lg:mb-8 max-w-2xl mx-auto text-lg">
                Our support team is here to help you with any questions about adoption, rehoming, or pet care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#008737] px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Schedule a Call
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FAQ