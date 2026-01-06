import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PawPrint, Heart, Users, Target, Shield, Globe, Star, Award, MapPin, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe every dog deserves love, care, and a second chance at happiness."
    },
    {
      icon: Shield,
      title: "Responsibility",
      description: "We ensure all dogs are vaccinated, neutered, and healthy before adoption."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a network of dog lovers across Nepal to support responsible pet ownership."
    },
    {
      icon: Target,
      title: "Impact",
      description: "Reducing street dog population through adoption and sterilization programs."
    }
  ]

  const locations = [
    { city: "Kathmandu", dogs: "450+" },
    { city: "Pokhara", dogs: "320+" },
    { city: "Lalitpur", dogs: "280+" },
    { city: "Bhaktapur", dogs: "180+" },
    { city: "Dharan", dogs: "150+" },
    { city: "Butwal", dogs: "120+" }
  ]

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-[#f7fdf9] to-white" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-[#008737]/10 to-[#085558]/10 rounded-full opacity-30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -30, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#085558]/10 to-[#008737]/10 rounded-full opacity-30 blur-3xl"
        />
      </div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(i) * 15, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          className={`absolute text-[#008737]/10`}
          style={{
            top: `${15 + i * 15}%`,
            left: `${5 + i * 15}%`,
            fontSize: '3rem'
          }}
        >
          🐕
        </motion.div>
      ))}

      <div className="container mx-auto max-w-6xl relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <PawPrint className="h-20 w-20 text-[#008737]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full opacity-10 blur-lg"></div>
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#063630] mb-6">
            Our Story: <span className="text-gradient bg-gradient-to-r from-[#008737] to-[#085558] bg-clip-text text-transparent">Transforming Lives</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Founded in 2025, The Paw House began with a simple mission: to give every 
            dog a chance at a loving home. What started as a small rescue 
            effort has grown into Nepal's most trusted dog adoption network.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-white to-[#f7fdf9] rounded-3xl p-10 shadow-xl border border-[#e6f7ec]"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-[#008737] to-[#085558] rounded-2xl mr-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#063630]">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              To create a Nepal where no dog sleeps hungry on the streets, and every 
              family has access to healthy, vaccinated canine companions through 
              ethical adoption practices.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Star className="h-5 w-5 text-[#008737] mr-3" />
                <span className="text-gray-700">Rescue abandoned and street dogs</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-[#008737] mr-3" />
                <span className="text-gray-700">Provide medical care and rehabilitation</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-[#008737] mr-3" />
                <span className="text-gray-700">Match dogs with loving forever homes</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-[#008737] mr-3" />
                <span className="text-gray-700">Educate communities on responsible pet ownership</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-white to-[#f7fdf9] rounded-3xl p-10 shadow-xl border border-[#e6f7ec]"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-[#085558] to-[#008737] rounded-2xl mr-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#063630]">Our Vision</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              To establish a sustainable model of animal welfare that makes Nepal a 
              pioneer in street dog rehabilitation and responsible pet adoption in 
              South Asia.
            </p>
            <div className="bg-gradient-to-br from-[#008737]/5 to-[#085558]/5 rounded-2xl p-6">
              <h3 className="font-bold text-[#063630] mb-4">By 2028, we aim to:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#008737] mb-2">10K+</div>
                  <div className="text-gray-600 text-sm">Dogs Rehomed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#008737] mb-2">50+</div>
                  <div className="text-gray-600 text-sm">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#008737] mb-2">100%</div>
                  <div className="text-gray-600 text-sm">Sterilization Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#008737] mb-2">24/7</div>
                  <div className="text-gray-600 text-sm">Rescue Service</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold text-center text-[#063630] mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e6f7ec]"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-[#008737] to-[#085558] rounded-2xl">
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#063630] mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Locations Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-[#008737] mr-3" />
              <h2 className="text-4xl font-bold text-[#063630]">Where We Work</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We operate across major cities in Nepal, reaching dogs in need wherever they are
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="bg-gradient-to-br from-white to-[#f7fdf9] rounded-2xl p-6 shadow-lg border border-[#e6f7ec] text-center"
              >
                <div className="text-2xl font-bold text-[#063630] mb-2">{location.city}</div>
                <div className="text-[#008737] font-semibold">{location.dogs} dogs</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutUs