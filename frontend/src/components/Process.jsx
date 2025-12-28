import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { UserCircle, Home, Search, CheckCircle } from 'lucide-react'

const Process = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const steps = [
    {
      icon: UserCircle,
      title: "Set up your profile",
      description: "(including photos) in minutes",
      color: "from-[#008737] to-[#085558]"
    },
    {
      icon: Home,
      title: "Describe your home and routine",
      description: "so rehomes can see if it's right for their pet",
      color: "from-[#085558] to-[#063630]"
    },
    {
      icon: Search,
      title: "Start your search",
      description: "Browse and connect with perfect matches",
      color: "from-[#063630] to-[#008737]"
    }
  ]

  const benefits = [
    {
      title: "Safe & Verified",
      description: "All pets are health-checked and behavior-assessed",
      icon: "✓"
    },
    {
      title: "Easy Process",
      description: "Streamlined adoption process with clear steps",
      icon: "✓"
    },
    {
      title: "Post-Adoption Support",
      description: "Continued guidance and resources after adoption",
      icon: "✓"
    },
    {
      title: "Community Network",
      description: "Connect with other pet owners and experts",
      icon: "✓"
    }
  ]

  return (
    <section id="process" className="py-16 lg:py-24 px-4 sm:px-6 relative overflow-hidden bg-white" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-6"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">Simple & Transparent</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063630] mb-4 lg:mb-6">
            Adopt or Rehome a pet in just
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558] mb-6 lg:mb-8">
            3 Easy Steps
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-[#008737] to-[#085558] mx-auto rounded-full"></div>
        </motion.div>

        {/* Steps Section */}
        <div className="relative mb-20 lg:mb-32">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008737]/20 to-transparent transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-white border-2 border-[#008737] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-[#008737]">{index + 1}</span>
                  </div>
                </div>

                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#008737]/10 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    {/* Icon Container */}
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <step.icon className="h-10 w-10 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl lg:text-2xl font-bold text-[#063630] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#063630]/80 text-base lg:text-lg mb-6">
                      {step.description}
                    </p>

                    {/* Action Button */}
                    <button className="mt-auto text-[#008737] font-semibold hover:text-[#085558] transition-colors flex items-center gap-2">
                      Learn more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-[#EDEDED] to-white rounded-3xl p-8 lg:p-12 shadow-xl border border-[#008737]/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-[#008737]/20 flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-[#008737]">{benefit.icon}</span>
                </div>
                
                {/* Content */}
                <div>
                  <h4 className="text-lg font-bold text-[#063630] mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-[#063630]/70 text-sm lg:text-base">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-10 lg:mt-12 pt-8 lg:pt-10 border-t border-[#008737]/10 text-center"
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-[#063630] mb-4">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-[#063630]/80 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of happy families who found their perfect companion through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#008737] to-[#085558] text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Adoption Process
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 border-[#008737] text-[#008737] px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-[#008737]/5 transition-all duration-300"
              >
                Learn More About Rehoming
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Process