import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User,
  Search,
  FileText,
  Home,
  MessageCircle,
  Heart,
  CheckCircle,
  ArrowRight,
  PawPrint,
  Shield,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdoptionProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  // Step data matching the image
  const steps = [
    {
      number: 1,
      title: "Create your profile and search for a pet",
      icon: User,
      color: "from-[#008737] to-[#085558]",
      details: [
        "Set up your profile (including photos) in minutes",
        "Develop your home and outline six reference sets to see if it's right for the pet",
        "Start your search"
      ]
    },
    {
      number: 2,
      title: "Let us know when you find a pet you're interested in",
      icon: Search,
      color: "from-[#085558] to-[#0a7a8c]",
      details: [
        "Make your expression using our application service",
        "If we find that you're a good match, we'll approve your application",
        "We'll review your profile and pass it on to the rescue center",
        "We'll contact you with more information at this stage"
      ]
    },
    {
      number: 3,
      title: "The rescue will review your application",
      icon: FileText,
      color: "from-[#0a7a8c] to-[#0c5f6b]",
      details: [
        "The rescue will decide if they want to take your application to the next stage",
        "A member of our team can contact you to discuss and answer any questions you may have"
      ]
    },
    {
      number: 4,
      title: "Have a home check and chat to the rescue",
      icon: Home,
      color: "from-[#0c5f6b] to-[#0e4a52]",
      details: [
        "You can chat with the rescue; We suggest you ask lots of questions about the pet's personality, diet, health and habits",
        "We'll arrange a home check to make our recommendation to the rescue",
        "Equally, if you change your mind at any stage, you can take your time. Now is a good time to say"
      ]
    },
    {
      number: 5,
      title: "Adopt your new pet",
      icon: Heart,
      color: "from-[#0e4a52] to-[#063630]",
      details: [
        "Once your home check is approved",
        "Get in touch with the rescue to arrange to meet and collect your pet",
        "Prepare your home with the essentials - bed, food, toys etc.",
        "Be patient and understanding because settling in takes time",
        "Go home and enjoy life with the right pet for your family",
        "Take your pet to their new home"
      ]
    }
  ];

  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // FIXED: Correct function name and remove TypeScript annotation
  const handleStepClick = (stepNumber) => {
    setActiveStep(stepNumber);
  };

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
            <PawPrint className="h-8 w-8 text-[#008737]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#063630] mb-4">
            Our Adoption Process
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A simple, transparent journey to finding your perfect canine companion. 
            We guide you through every step with care and support.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          
          {/* Step Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                      step.number <= activeStep 
                        ? `bg-gradient-to-r ${step.color} shadow-lg scale-110`
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.number <= activeStep ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <span className={`mt-2 text-sm font-medium ${
                    step.number === activeStep ? 'text-[#063630]' : 'text-gray-500'
                  }`}>
                    Step {step.number}
                  </span>
                </div>
              ))}
              
              {/* Progress Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 w-4/5 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#008737] to-[#085558]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step Details Card */}
            <motion.div 
              key={activeStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  {/* FIXED: Correct template string syntax */}
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${steps[activeStep - 1].color}`}>
                    {/* FIXED: Correct icon rendering */}
                    {(() => {
                      const Icon = steps[activeStep - 1].icon;
                      return <Icon className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500">STEP {activeStep}</span>
                    <h2 className="text-2xl font-bold text-[#063630]">
                      {steps[activeStep - 1].title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {steps[activeStep - 1].details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[activeStep - 1].color}`} />
                      </div>
                      <p className="text-gray-700">{detail}</p>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-100">
                  <button
                    onClick={handlePrevStep}
                    disabled={activeStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#085558] hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous Step
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">
                      Step {activeStep} of {steps.length}
                    </span>
                    <button
                      onClick={handleNextStep}
                      disabled={activeStep === steps.length}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        activeStep === steps.length
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#008737] to-[#085558] text-white hover:shadow-lg'
                      }`}
                    >
                      Next Step
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-[#008737]/5 to-[#085558]/5 p-6 rounded-xl">
                  <Shield className="h-8 w-8 text-[#008737] mb-3" />
                  <h3 className="font-bold text-[#063630] mb-2">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">All adoptions are thoroughly vetted to ensure pet safety</p>
                </div>
                <div className="bg-gradient-to-r from-[#085558]/5 to-[#0a7a8c]/5 p-6 rounded-xl">
                  <Calendar className="h-8 w-8 text-[#085558] mb-3" />
                  <h3 className="font-bold text-[#063630] mb-2">Flexible Timeline</h3>
                  <p className="text-sm text-gray-600">Take your time at each stage, no pressure to rush</p>
                </div>
                <div className="bg-gradient-to-r from-[#0a7a8c]/5 to-[#0c5f6b]/5 p-6 rounded-xl">
                  <Users className="h-8 w-8 text-[#0a7a8c] mb-3" />
                  <h3 className="font-bold text-[#063630] mb-2">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Our team is always here to answer your questions</p>
                </div>
              </div>
            </motion.div>

            {/* Sidebar - All Steps Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-32">
                <h3 className="font-bold text-xl text-[#063630] mb-6 pb-4 border-b border-gray-100">
                  Adoption Journey
                </h3>
                
                <div className="space-y-4">
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    return (
                      <button
                        key={step.number}
                        onClick={() => handleStepClick(step.number)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                          step.number === activeStep
                            ? `bg-gradient-to-r ${step.color} text-white transform scale-[1.02] shadow-md`
                            : 'hover:bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            step.number === activeStep 
                              ? 'bg-white/20' 
                              : `bg-gradient-to-r ${step.color}`
                          }`}>
                            <StepIcon className={`h-5 w-5 ${
                              step.number === activeStep ? 'text-white' : 'text-white'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold ${
                                step.number === activeStep ? 'text-white' : 'text-[#063630]'
                              }`}>
                                Step {step.number}
                              </span>
                              {step.number < activeStep && (
                                <CheckCircle className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${
                              step.number === activeStep ? 'text-white/90' : 'text-gray-600'
                            }`}>
                              {step.title.split(' ').slice(0, 5).join(' ')}...
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* CTA Section */}
                <div className="mt-8 p-5 bg-gradient-to-r from-[#008737]/10 to-[#085558]/10 rounded-xl">
                  <h4 className="font-bold text-[#063630] mb-3">Ready to Start?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Begin your journey to finding a loving companion today.
                  </p>
                  <Link
                    to="/adopt"
                    className="block w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Browse Available Dogs
                  </Link>
                  <Link
                    to="/contact"
                    className="block w-full text-center py-3 mt-3 text-[#085558] font-medium hover:text-[#008737] transition-colors"
                  >
                    Have Questions?
                  </Link>
                </div>
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
              <Heart className="h-12 w-12 text-[#008737] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#063630] mb-4">
                Every Dog Deserves a Loving Home
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our process ensures that every adoption is a perfect match, giving dogs 
                a second chance at happiness and families a loyal companion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/adopt"
                  className="px-8 py-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  Start Searching
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 border-2 border-[#085558] text-[#085558] rounded-full font-semibold hover:bg-[#085558] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contact Our Team
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionProcess;