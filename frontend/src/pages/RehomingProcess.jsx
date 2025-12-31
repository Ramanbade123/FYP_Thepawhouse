import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Home,
  FileText,
  UserCheck,
  Calendar,
  Heart,
  CheckCircle,
  PawPrint,
  Shield,
  Users,
  MessageCircle,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  HandHeart,
  XCircle
} from 'lucide-react';

const RehomingProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  // Step data for rehoming process
  const steps = [
    {
      number: 1,
      title: "Contact Us & Initial Assessment",
      icon: Phone,
      color: "from-[#085558] to-[#0a7a8c]",
      details: [
        "Reach out to us via phone, email, or our online form",
        "Share basic information about your dog and your situation",
        "Our team will conduct a confidential initial assessment",
        "We'll explain the entire rehoming process in detail"
      ],
      duration: "1-2 days",
      keyInfo: "All conversations are confidential and non-judgmental"
    },
    {
      number: 2,
      title: "Complete Rehoming Profile",
      icon: FileText,
      color: "from-[#0a7a8c] to-[#0c5f6b]",
      details: [
        "Fill out our detailed rehoming application form",
        "Provide information about your dog's personality, health, and habits",
        "Upload recent photos and videos of your dog",
        "Share veterinary records and medical history",
        "Include details about training, socialization, and daily routine"
      ],
      duration: "2-3 days",
      keyInfo: "Complete profiles help us find the perfect match faster"
    },
    {
      number: 3,
      title: "Meet & Assessment Session",
      icon: UserCheck,
      color: "from-[#0c5f6b] to-[#0e4a52]",
      details: [
        "Schedule a meet-up with our rehoming specialist",
        "We'll assess your dog's temperament and behavior",
        "Discuss your dog's needs and ideal new home environment",
        "Take professional photos for the adoption listing",
        "Create a comprehensive behavioral profile"
      ],
      duration: "3-5 days",
      keyInfo: "This helps us match your dog with the most suitable adopters"
    },
    {
      number: 4,
      title: "Finding the Right Match",
      icon: Heart,
      color: "from-[#0e4a52] to-[#063630]",
      details: [
        "We list your dog on our secure adoption platform",
        "Our team pre-screens all potential adopters",
        "You'll review profiles of interested families",
        "We arrange virtual or in-person meet-and-greets",
        "You have final say in choosing the new family"
      ],
      duration: "1-3 weeks",
      keyInfo: "You remain involved in the selection process"
    },
    {
      number: 5,
      title: "Transition & Support",
      icon: HandHeart,
      color: "from-[#063630] to-[#008737]",
      details: [
        "We facilitate the transition with a detailed handover plan",
        "Provide the new family with all your dog's information",
        "Arrange a trial period with ongoing support",
        "Offer post-adoption check-ins for 3 months",
        "Provide resources for both you and the new family"
      ],
      duration: "Ongoing support",
      keyInfo: "We ensure a smooth transition for everyone involved"
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

  const handleStepClick = (stepNumber) => {
    setActiveStep(stepNumber);
  };

  // Benefits of rehoming with us
  const benefits = [
    {
      icon: Shield,
      title: "Safe & Secure Process",
      description: "Thorough vetting of all potential adopters to ensure your dog's safety"
    },
    {
      icon: Award,
      title: "No Rehoming Fees",
      description: "We never charge fees to rehome your dog with us"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Professional support from our experienced rehoming specialists"
    },
    {
      icon: Clock,
      title: "Flexible Timeline",
      description: "You control the pace and are involved in every decision"
    }
  ];

  // FAQ Section
  const faqs = [
    {
      question: "How long does the rehoming process take?",
      answer: "Typically 2-4 weeks, depending on your dog's needs and finding the perfect match."
    },
    {
      question: "Can I meet the potential adopters?",
      answer: "Yes, you'll have the opportunity to meet and approve the final adopter."
    },
    {
      question: "What if I change my mind during the process?",
      answer: "You can pause or stop the process at any time, no questions asked."
    },
    {
      question: "Will my dog go to a foster home?",
      answer: "Your dog stays with you until the adoption is finalized, unless you request otherwise."
    }
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
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#085558]/10 to-[#0a7a8c]/10 rounded-2xl mb-6">
            <Home className="h-8 w-8 text-[#085558]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#063630] mb-4">
            Rehoming Your Dog
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A compassionate, secure process to find your dog a loving new home. 
            We're here to support you every step of the way.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-3 bg-gradient-to-r from-[#085558]/10 to-[#0a7a8c]/10 rounded-lg w-fit mb-4">
                  <benefit.icon className="h-6 w-6 text-[#085558]" />
                </div>
                <h3 className="font-bold text-lg text-[#063630] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          
          {/* Step Progress Bar */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#063630] mb-3">
                Our 5-Step Rehoming Process
              </h2>
              <p className="text-gray-600">
                Designed with compassion and care for both you and your dog
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                      step.number <= activeStep 
                        ? `bg-gradient-to-r ${step.color} shadow-lg scale-110`
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.number <= activeStep ? (
                      <CheckCircle className="h-7 w-7" />
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
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8 w-4/5 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#085558] to-[#008737]"
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
              transition={{ duration: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${steps[activeStep - 1].color}`}>
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
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                    <Clock className="h-4 w-4 text-[#085558]" />
                    <span className="text-sm font-medium text-gray-700">
                      {steps[activeStep - 1].duration}
                    </span>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-[#085558]/5 to-[#0a7a8c]/5 rounded-xl">
                  <div className="flex items-start gap-2">
                    <PawPrint className="h-5 w-5 text-[#085558] mt-0.5" />
                    <p className="text-gray-700 font-medium">
                      {steps[activeStep - 1].keyInfo}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {steps[activeStep - 1].details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[activeStep - 1].color}`} />
                      </div>
                      <p className="text-gray-700 flex-1">{detail}</p>
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
                          : 'bg-gradient-to-r from-[#085558] to-[#0a7a8c] text-white hover:shadow-lg'
                      }`}
                    >
                      Next Step
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-[#063630] mb-6">Common Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#085558]/10 rounded-lg">
                          <MessageCircle className="h-5 w-5 text-[#085558]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#063630] mb-2">{faq.question}</h4>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar - All Steps Overview & Contact */}
            <div className="lg:col-span-1 space-y-8">
              {/* Steps Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-32">
                <h3 className="font-bold text-xl text-[#063630] mb-6 pb-4 border-b border-gray-100">
                  Rehoming Journey
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
                            <StepIcon className="h-5 w-5 text-white" />
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
                              {step.title.split(' ').slice(0, 3).join(' ')}...
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3 mb-3">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <h4 className="font-bold text-red-800">Emergency Rehoming?</h4>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    If you need to rehome your dog urgently due to safety concerns, contact us immediately.
                  </p>
                  <a
                    href="tel:+18005551234"
                    className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Call Emergency Line
                  </a>
                </div>
              </div>

              {/* Contact Form CTA */}
              <div className="bg-gradient-to-r from-[#085558] to-[#0a7a8c] rounded-2xl p-6 text-white">
                <h3 className="font-bold text-xl mb-4">Start the Conversation</h3>
                <p className="text-white/90 mb-6">
                  Ready to discuss rehoming your dog? Our team is here to help.
                </p>
                <div className="space-y-4">
                  <Link
                    to="/contact"
                    className="block w-full bg-white text-[#085558] text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Contact Form
                  </Link>
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2">Or reach us directly:</p>
                    <div className="flex items-center justify-center gap-4">
                      <a href="tel:+18005551234" className="hover:text-white/80 transition-colors">
                        <Phone className="h-5 w-5" />
                      </a>
                      <a href="mailto:rehome@thepawhouse.com" className="hover:text-white/80 transition-colors">
                        <Mail className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
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
            <div className="bg-gradient-to-r from-[#085558]/5 to-[#0a7a8c]/5 rounded-2xl p-8 max-w-4xl mx-auto">
              <Heart className="h-12 w-12 text-[#085558] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#063630] mb-4">
                Making the Right Decision for Your Dog
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Rehoming is a difficult decision, but you're doing what's best for your dog. 
                We're here to make sure they find a loving home where they'll be cherished.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-gradient-to-r from-[#085558] to-[#0a7a8c] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Start Rehoming Process
                </Link>
                <Link
                  to="/rehoming-faq"
                  className="px-8 py-3 border-2 border-[#085558] text-[#085558] rounded-full font-semibold hover:bg-[#085558] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  View Full FAQ
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RehomingProcess;