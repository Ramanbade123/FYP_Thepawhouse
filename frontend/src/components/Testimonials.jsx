import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, ChevronLeft, ChevronRight, Users, Award, Shield, Heart } from 'lucide-react'
import { useState } from 'react'

const Testimonials = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      name: "Ram Bahadur",
      role: "From Kathmandu",
      content: "Adopted 'Kali' two years ago. She's the most loyal companion who guards our home and brings joy to our family every day.",
      rating: 5,
      image: "👨‍👩‍👧",
      location: "Kathmandu",
      date: "2 years ago"
    },
    {
      name: "Sita Sharma",
      role: "Dog Parent",
      content: "The Paw House helped us rescue 'Sheru' from the streets. Now he's healthy, happy, and part of our family. The support was amazing!",
      rating: 5,
      image: "👩‍👦",
      location: "Pokhara",
      date: "1 year ago"
    },
    {
      name: "Krishna Gurung",
      role: "Volunteer & Adopter",
      content: "As a volunteer, I've seen firsthand how they transform street dogs into loving family pets. Adopted 'Bhairav' myself!",
      rating: 5,
      image: "👨‍💼",
      location: "Dharan",
      date: "3 years ago"
    },
    {
      name: "The Thapa Family",
      role: "Three-time Adopters",
      content: "We've adopted three Nepali dogs through The Paw House. Each process was smooth and transparent. Our home is full of love!",
      rating: 5,
      image: "👨‍👩‍👧‍👦",
      location: "Lalitpur",
      date: "Ongoing"
    }
  ]

  const stats = [
    { icon: Users, value: "500+", label: "Happy Dogs" },
    { icon: Award, value: "4.9/5", label: "Rating" },
    { icon: Shield, value: "100%", label: "Verified" },
    { icon: Heart, value: "50+", label: "Cities" }
  ]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <Quote className="h-4 w-4" />
            <span className="text-sm font-semibold">Success Stories</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063630] mb-4">
            Happy Families, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">Happy Pets</span>
          </h2>
          <p className="text-lg lg:text-xl text-[#063630]/80 max-w-2xl mx-auto mb-8 lg:mb-12">
            Read what fellow pet parents say about their adopted companions and our adoption process.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-[#008737]/10"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#008737] to-[#085558] rounded-full flex items-center justify-center mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#063630] mb-1">{stat.value}</h3>
                  <p className="text-[#063630]/70 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative mb-12 lg:mb-16">
          {/* Navigation Arrows */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-10 p-3 lg:p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-shadow border border-[#008737]/10 hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 text-[#008737]" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-10 p-3 lg:p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-shadow border border-[#008737]/10 hidden md:flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 text-[#008737]" />
          </motion.button>

          {/* Testimonial Cards Container - FIXED OVERLAP */}
          <div className="relative h-[400px] lg:h-[450px] overflow-hidden">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex
              const isNext = index === (activeIndex + 1) % testimonials.length
              const isPrev = index === (activeIndex - 1 + testimonials.length) % testimonials.length

              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    opacity: isActive ? 1 : isNext || isPrev ? 0.3 : 0,
                    x: isActive ? 0 : isNext ? '100%' : isPrev ? '-100%' : 0,
                    display: isActive || isNext || isPrev ? 'block' : 'none'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className="absolute inset-0"
                  style={{
                    zIndex: isActive ? 30 : isNext || isPrev ? 20 : 10
                  }}
                >
                  <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl p-8 lg:p-12 h-full border border-[#008737]/10 mx-4 lg:mx-auto max-w-3xl">
                    {/* Quote Icon */}
                    <div className="absolute top-6 lg:top-8 right-6 lg:right-8 text-[#848AFF]/10">
                      <Quote className="h-12 w-12 lg:h-16 lg:w-16" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 lg:h-6 lg:w-6 ${
                              i < testimonial.rating
                                ? 'fill-[#FFD700] text-[#FFD700]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-3 text-[#063630]/60 text-sm lg:text-base">{testimonial.date}</span>
                    </div>

                    {/* Content */}
                    <p className="text-lg lg:text-xl text-[#063630]/80 mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-[#008737]/10">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="text-3xl lg:text-4xl">{testimonial.image}</div>
                        </div>
                        <div>
                          <h4 className="text-lg lg:text-xl font-bold text-[#063630]">
                            {testimonial.name}
                          </h4>
                          <p className="text-[#008737] font-medium text-sm lg:text-base">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-[#063630]/60 text-sm lg:text-base">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 lg:gap-3 mb-12 lg:mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 lg:h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 lg:w-12 bg-gradient-to-r from-[#008737] to-[#085558]'
                  : 'w-2 lg:w-3 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-4 md:hidden mb-8">
          <button
            onClick={prevSlide}
            className="p-3 bg-white rounded-full shadow-md border border-[#008737]/10"
          >
            <ChevronLeft className="h-5 w-5 text-[#008737]" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 bg-white rounded-full shadow-md border border-[#008737]/10"
          >
            <ChevronRight className="h-5 w-5 text-[#008737]" />
          </button>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-[#063630] to-[#05221C] rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Share Your Success Story?</h3>
            <p className="text-white/80 mb-6 lg:mb-8 max-w-2xl mx-auto text-lg">
              Adopt a pet and become part of our growing community of happy pet parents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#063630] px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Adopt a Dog Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Share Your Story
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials