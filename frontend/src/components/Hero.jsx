import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PawPrint, Heart, Home, Users, Shield } from 'lucide-react'

const Hero = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative overflow-hidden bg-[#EDEDED]">
      <div className="container mx-auto max-w-7xl relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-8"
            >
              <div className="w-2 h-2 bg-[#008737] rounded-full"></div>
              <span className="text-sm font-semibold">Trusted by 5,000+ Families</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#063630] leading-tight mb-6">
                Give a Dog a
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">
                  Forever Home
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg lg:text-xl text-[#063630]/80 mb-10 lg:mb-12 leading-relaxed max-w-2xl"
            >
              Pet adoption and rehoming are both vital aspects of animal welfare, offering hope and a fresh start to pets in need. Open your heart and your home to a shelter pet.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-16"
            >
              {/* Adopt Now Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-r from-[#008737] to-[#085558] text-white px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="relative !text-white z-10">Adopt Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#085558] to-[#008737] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none z-0"></div>
              </motion.button>

              {/* Rehome Now Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white border-2 border-[#008737] text-[#008737] px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[#008737]/5"
              >
                <Home className="h-5 w-5 lg:h-6 lg:w-6" />
                <span>Rehome Now</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 lg:pt-10 border-t border-[#008737]/10"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#008737] mb-2">5,000+</div>
                <div className="text-[#063630]/80 text-sm lg:text-base">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#008737] mb-2">2,500+</div>
                <div className="text-[#063630]/80 text-sm lg:text-base">Pets Adopted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#008737] mb-2">98%</div>
                <div className="text-[#063630]/80 text-sm lg:text-base">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[600px]">
                <img 
                  src="https://i.pinimg.com/736x/d5/a5/fc/d5a5fca31979331a01249873a80d3d40.jpg" 
                  alt="Happy dog ready for adoption"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/40 via-transparent to-transparent"></div>
              </div>

              {/* Floating Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-[#008737]/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#008737]/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-[#008737]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#063630]">100% Safe</div>
                    <div className="text-sm text-[#063630]/70">Vaccinated & Healthy</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-[#008737]/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#085558]/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#085558]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#063630]">24/7 Support</div>
                    <div className="text-sm text-[#063630]/70">Expert Guidance</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
