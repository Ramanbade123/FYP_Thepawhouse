
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Bone, 
  Stethoscope, 
  Scissors, 
  Brain, 
  Activity, 
  ShieldAlert, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Sun,
  CloudRain,
  Thermometer,
  Apple,
  Info,
  Calendar,
  Zap,
 MapPin,
 Phone,
 Users
} from 'lucide-react';


const CareGuide = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [activeTab, setActiveTab] = useState('nutrition');

  const categories = [
    { id: 'nutrition', label: 'Nutrition', icon: Apple, color: 'from-[#008737] to-[#085558]' },
    { id: 'health', label: 'Health', icon: Stethoscope, color: 'from-[#085558] to-[#063630]' },
    { id: 'training', label: 'Training', icon: Brain, color: 'from-[#063630] to-[#008737]' },
    { id: 'grooming', label: 'Grooming', icon: Scissors, color: 'from-[#008737] to-[#085558]' }
  ];

  const content = {
    nutrition: {
      title: "Fueling Your Furry Friend",
      subtitle: "Proper nutrition is the foundation of a long, healthy life for your dog in Nepal's climate.",
      tips: [
        "Consistent Schedule: Feed your dog twice a day at the same time to avoid digestive issues.",
        "Local Produce: Boiled pumpkin, carrots, and sweet potatoes are great healthy add-ons.",
        "Hydration: Always provide fresh water, especially during hot Kathmandu summers.",
        "Avoid Toxic Foods: Never feed chocolate, grapes, onions, or spicy masala food common in Nepali kitchens."
      ],
      stats: { label: "Daily Water", value: "30-50ml", sub: "per kg of body weight" }
    },
    health: {
      title: "Staying Strong & Healthy",
      subtitle: "Preventative care saves lives. Keep your vaccinations up to date and monitor behavior.",
      tips: [
        "Regular Checkups: Visit a vet at least once every six months for a routine screen.",
        "Vaccinations: Ensure annual rabies and DHPP boosters are mandatory in city areas.",
        "Parasite Control: Regular deworming and flea/tick prevention is crucial for street-exposed dogs.",
        "Watch for Lethargy: Inactivity or loss of appetite can be early signs of Parvo or Distemper."
      ],
      stats: { label: "Vet Visits", value: "2/Year", sub: "Recommended minimum" }
    },
    training: {
      title: "Building Mental Bonds",
      subtitle: "A well-trained dog is a happy dog. Training should be based on positive reinforcement.",
      tips: [
        "Positive Reinforcement: Use treats and praise, never physical punishment or shouting.",
        "Socialization: Introduce your dog to different people and pets in local parks early.",
        "Consistency: Use the same commands every time (e.g., 'Bas', 'Aa', 'Chhod').",
        "Short Sessions: Keep training sessions to 10-15 minutes to maintain high engagement."
      ],
      stats: { label: "Focus Span", value: "15 min", sub: "Ideal session length" }
    },
    grooming: {
      title: "Paws, Coats, and Ears",
      subtitle: "Regular grooming prevents skin issues and keeps your home clean and dander-free.",
      tips: [
        "Brushing: Brush long-haired breeds daily to prevent mats and skin infections.",
        "Nail Trimming: Trim nails every 3-4 weeks to avoid discomfort and posture issues.",
        "Ear Cleaning: Check ears weekly for redness, mites, or unusual odors.",
        "Dental Care: Brush teeth regularly or use high-quality dental chews."
      ],
      stats: { label: "Brushing", value: "3-5x", sub: "Times per week" }
    }
  };

  return (
    <div className="bg-[#EDEDED] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-[#063630] to-[#05221C] text-white">
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -left-24 w-[600px] h-[600px] border-4 border-dashed border-white rounded-full"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20"
          >
            <Heart className="h-4 w-4 text-[#008737]" />
            <span className="text-sm font-semibold text-[#c6f7d9]">The Ultimate Care Companion</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#c6f7d9]mb-6 tracking-tight"
          >
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#c6f7d9]">The Paw Care Guide</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to know to give your canine companion the healthy, happy, and fulfilling life they deserve in Nepal.
          </motion.p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 lg:py-28 container mx-auto px-4" ref={ref}>
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 lg:mb-24">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-bold transition-all duration-300 shadow-xl border ${
                activeTab === cat.id 
                  ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                  : 'bg-white text-[#063630] hover:bg-gray-50 border-gray-100'
              }`}
            >
              <cat.icon className="h-6 w-6" />
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Dynamic Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Text Side */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-4xl lg:text-6xl font-bold text-[#063630] mb-8 leading-tight">
                  {content[activeTab].title}
                </h2>
                <p className="text-2xl text-[#063630]/70 mb-12 leading-relaxed">
                  {content[activeTab].subtitle}
                </p>
              </motion.div>

              <div className="space-y-8 mb-12">
                {content[activeTab].tips.map((tip, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-start gap-6 group"
                  >
                    <div className="mt-1 p-2 bg-[#008737]/10 rounded-xl group-hover:bg-[#008737] transition-colors duration-300">
                      <CheckCircle2 className="h-7 w-7 text-[#008737] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="text-xl text-[#063630] font-medium leading-relaxed">
                      {tip}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 10 }}
                className="flex items-center gap-3 text-[#008737] font-extrabold text-xl hover:text-[#085558] transition-colors"
              >
                <span>Download Full {categories.find(c => c.id === activeTab)?.label} PDF</span>
                <ArrowRight className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Visual Side */}
            <div className="relative">
              <motion.div 
                layoutId="visual-card"
                className="bg-white rounded-[40px] p-12 lg:p-16 shadow-2xl border border-[#008737]/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Bone className="h-64 w-64 text-[#008737]" />
                </div>
                
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-10 rounded-[35px] bg-gradient-to-br ${categories.find(c => c.id === activeTab)?.color} mb-12 shadow-2xl ring-8 ring-white/20`}
                  >
                    {React.createElement(categories.find(c => c.id === activeTab).icon, { className: "h-20 w-20 text-white" })}
                  </motion.div>
                  
                  <h3 className="text-3xl font-black text-[#063630] mb-6 uppercase tracking-widest">Recommended Standard</h3>
                  
                  <div className="bg-[#EDEDED] px-12 py-10 rounded-[30px] inline-block mb-6 shadow-inner">
                    <span className="text-7xl lg:text-8xl font-black text-[#008737] tracking-tighter">
                      {content[activeTab].stats.value}
                    </span>
                    <p className="text-lg font-bold text-[#063630]/60 mt-3 uppercase tracking-widest">
                      {content[activeTab].stats.label}
                    </p>
                  </div>
                  
                  <p className="text-xl text-[#063630]/60 font-medium italic">
                    {content[activeTab].stats.sub}
                  </p>
                </div>
              </motion.div>
              
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-6 bg-[#085558] text-white px-8 py-6 rounded-3xl shadow-2xl hidden md:flex items-center gap-4"
              >
                <Activity className="h-10 w-10 text-[#c6f7d9]" />
                <div className="text-left">
                  <div className="font-black text-2xl">Daily Vitality</div>
                  <div className="text-sm opacity-80">Tracked Metrics</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

        {/* Seasonal Care Section (Nepal Specific) */}
        <section className="py-24 lg:py-40 bg-[#063630] text-white relative overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#008737]/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#085558]/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 lg:mb-24">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8"
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#c6f7d9]">
                Caring Through the Seasons
                </span>
            </motion.h2>
            <p className="text-white/90 max-w-3xl mx-auto text-lg lg:text-xl xl:text-2xl leading-relaxed px-4">
                Nepal's climate varies drastically from the Terai to the Himalayas. Adjust your dog's care routine based on the local conditions.
            </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
                {
                icon: Sun,
                title: "Summer (Mar - June)",
                color: "text-amber-400",
                content: "Avoid walking during peak sun hours (11 AM - 4 PM). Provide plenty of cool water and never leave your dog in a parked vehicle.",
                tips: ["Watch for heavy panting/heatstroke", "Frozen fruit treats are helpful", "Check paw pads for hot road burns"]
                },
                {
                icon: CloudRain,
                title: "Monsoon (July - Sep)",
                color: "text-blue-400",
                content: "Keep paws dry to prevent fungal infections. Check for ticks and leeches after walks in grassy or rural areas across Nepal.",
                tips: ["Dry fur thoroughly after rain", "Watch for skin rashes from dampness", "Avoid stagnant puddle water"]
                },
                {
                icon: Thermometer,
                title: "Winter (Oct - Feb)",
                color: "text-cyan-400",
                content: "Local breeds are hardy, but short-haired dogs may need a sweater in higher altitudes. Ensure their bed is off the cold floor.",
                tips: ["Warm bedding is essential", "Monitor for dry/cracked paws", "Slightly increase food for warmth"]
                }
            ].map((season, i) => (
                <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl p-6 md:p-8 lg:p-12 rounded-[32px] lg:rounded-[40px] border border-white/10 hover:border-white/20 transition-all shadow-2xl flex flex-col h-full"
                >
                {/* Icon Container - Centered */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-10 mx-auto">
                    <season.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                
                {/* Season Title - Now using solid white color */}
                <h3 className={`text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-center text-white leading-tight`}>
                    {season.title}
                </h3>
                
                {/* Content */}
                <p className="text-white text-base lg:text-lg leading-relaxed mb-6 lg:mb-10 flex-grow">
                    {season.content}
                </p>
                
                {/* Tips Section */}
                <div className="space-y-3 lg:space-y-4 pt-6 lg:pt-8 border-t border-white/10">
                    {season.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#c6f7d9] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-white text-sm lg:text-base font-medium leading-relaxed">{tip}</span>
                    </div>
                    ))}
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </section>

        {/* Emergency Section */}
        <section className="py-24 lg:py-40 container mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#008737] to-[#085558] rounded-[50px] p-8 md:p-12 lg:p-24 text-white shadow-[0_40px_100px_rgba(0,135,55,0.2)] relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 md:p-12 lg:p-24 opacity-10 rotate-12">
            <ShieldAlert className="h-[200px] w-[200px] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px]" />
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 md:mb-12">
                <div className="p-4 md:p-5 bg-white/20 rounded-2xl md:rounded-3xl backdrop-blur-md shadow-lg border border-white/20">
                <ShieldAlert className="h-8 w-8 md:h-12 md:w-12 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                Emergency Protocol
                </h2>
            </div>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 md:mb-16 font-medium leading-relaxed max-w-5xl">
                Knowing what to do in the first 5 minutes of an emergency can save your pet's life. Keep these procedures handy.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-12 md:mb-16">
                <motion.div 
                whileHover={{ x: 10 }}
                className="bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-[30px] md:rounded-[35px] border border-white/10 shadow-xl"
                >
                <div className="flex items-center gap-4 mb-4">
                    <Zap className="h-6 w-6 md:h-7 md:w-7 text-yellow-300" />
                    <h4 className="font-black text-xl md:text-2xl uppercase tracking-widest">CHOKING & TOXINS</h4>
                </div>
                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                    Do not induce vomiting unless specifically instructed by a licensed vet. Remove obstructions only if they are clearly visible and easily reachable.
                </p>
                </motion.div>
                <motion.div 
                whileHover={{ x: 10 }}
                className="bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-[30px] md:rounded-[35px] border border-white/10 shadow-xl"
                >
                <div className="flex items-center gap-4 mb-4">
                    <Activity className="h-6 w-6 md:h-7 md:w-7 text-red-300" />
                    <h4 className="font-black text-xl md:text-2xl uppercase tracking-widest">ROAD ACCIDENTS</h4>
                </div>
                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                    Approach injured dogs with extreme care as pain may cause biting. Gently slide the dog onto a flat surface to prevent spinal aggravation.
                </p>
                </motion.div>
            </div>

            {/* Center aligned buttons */}
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
                <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#008737] px-8 md:px-12 py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3 w-full sm:w-auto min-w-[280px]"
                >
                <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                Find Nearest 24/7 Vet
                </motion.button>
            </div>
            </div>
        </motion.div>
        </section>

      {/* Community Tip / Footer Info */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 justify-center text-center md:text-left">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-6 bg-[#EDEDED] rounded-3xl"
            >
              <Info className="h-12 w-12 text-[#008737]" />
            </motion.div>
            <div className="max-w-2xl">
              <h4 className="text-3xl font-black text-[#063630] mb-3">Did you know?</h4>
              <p className="text-2xl text-[#063630]/70 leading-relaxed font-medium">Proper care and early socialization can extend a dog's life by up to <span className="text-[#008737] font-black">5 years</span>. Start your journey today!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareGuide;
