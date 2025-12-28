import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PawPrint,
  Calendar,
  MapPin,
  Heart,
  Scale,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bone,
  Shield,
  Home,
  Star
} from "lucide-react";

const Pets = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const petsPerPage = 6;

  const dogs = [
    {
      id: 1,
      name: "Buddy",
      breed: "Nepali Kukur (Local Breed)",
      age: "2 years",
      gender: "male",
      size: "Medium",
      weight: "18 kg",
      location: "Kathmandu",
      description: "Loyal and protective, great for family homes. Rescued from the streets.",
      status: "Available",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop",
      vaccinated: true,
      trained: true
    },
    {
      id: 2,
      name: "Kali",
      breed: "Mixed Breed",
      age: "1.5 years",
      gender: "female",
      size: "Medium",
      weight: "15 kg",
      location: "Pokhara",
      description: "Friendly and energetic, loves outdoor activities. Good with children.",
      status: "Available",
      image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&auto=format&fit=crop",
      vaccinated: true,
      trained: false
    },
    {
      id: 3,
      name: "Simba",
      breed: "Mongrel",
      age: "3 years",
      gender: "male",
      size: "Large",
      weight: "25 kg",
      location: "Lalitpur",
      description: "Gentle giant, requires space to roam. Previously a street dog.",
      status: "Available",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop",
      vaccinated: true,
      trained: true
    },
    {
      id: 4,
      name: "Rani",
      breed: "Pariah Dog",
      age: "2.5 years",
      gender: "female",
      size: "Small",
      weight: "12 kg",
      location: "Bhaktapur",
      description: "Adaptable and intelligent, perfect for apartment living.",
      status: "Available",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&auto=format&fit=crop",
      vaccinated: true,
      trained: false
    },
    {
      id: 5,
      name: "Bhairav",
      breed: "Nepali Mountain Dog",
      age: "4 years",
      gender: "male",
      size: "Large",
      weight: "28 kg",
      location: "Dharan",
      description: "Strong and independent, suited for experienced owners.",
      status: "Available",
      image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&auto=format&fit=crop",
      vaccinated: true,
      trained: true
    },
    {
      id: 6,
      name: "Maya",
      breed: "Mixed Breed",
      age: "1 year",
      gender: "female",
      size: "Medium",
      weight: "14 kg",
      location: "Butwal",
      description: "Playful and affectionate, ready for her forever home.",
      status: "Available",
      image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&auto=format&fit=crop",
      vaccinated: true,
      trained: false
    }
  ];

  const filters = [
    { id: "all", label: "All Dogs" },
    { id: "puppies", label: "Puppies (0-1 year)" },
    { id: "medium", label: "Medium Size" },
    { id: "kathmandu", label: "Kathmandu Valley" },
    { id: "family", label: "Good with Kids" },
    { id: "vaccinated", label: "Vaccinated" }
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentDogs = dogs.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(dogs.length / petsPerPage);

  return (
    <section id="adopt" className="py-16 lg:py-24 bg-[#EDEDED]">
      <div className="container mx-auto">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-6"
          >
            <Bone className="h-4 w-4" />
            <span className="text-sm font-semibold">Meet Our Friends</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063630] mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">Perfect Companion</span>
          </h2>
          <p className="text-lg lg:text-xl text-[#063630]/80 max-w-2xl mx-auto mb-12">
            Discover loyal dogs from across Nepal waiting for their forever homes. Every adoption saves a life.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16 max-w-3xl mx-auto">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg text-center border border-[#008737]/10">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#063630] mb-2">250+</h3>
              <p className="text-[#063630]/70 text-sm lg:text-base">Dogs Rehomed</p>
            </div>
            
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg text-center border border-[#008737]/10">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#063630] mb-2">8 Cities</h3>
              <p className="text-[#063630]/70 text-sm lg:text-base">Across Nepal</p>
            </div>
            
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg text-center border border-[#008737]/10">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#063630] mb-2">100%</h3>
              <p className="text-[#063630]/70 text-sm lg:text-base">Health Verified</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#008737]/10 p-6 mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#848AFF]" />
              <input
                type="text"
                placeholder="Search by breed, location, or age..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]"
              />
            </div>
            <button className="lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              <Filter className="h-4 w-4" />
              <span className="text-white">Advanced Filters</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md"
                    : "bg-gray-100 text-[#063630] hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dogs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentDogs.map((dog, i) => (
            <motion.div
              key={dog.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#008737]/10 group"
            >
              {/* Image Section */}
              <div className="relative h-64 lg:h-72 overflow-hidden">
                <img
                  src={dog.image}
                  alt={dog.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full shadow-md">
                    {dog.status}
                  </span>
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(dog.id)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(dog.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </button>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/60 via-transparent to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Header with Name & Gender */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-[#063630] mb-1">{dog.name}</h3>
                    <p className="text-[#008737] font-medium">{dog.breed}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    dog.gender === "female" 
                      ? "bg-pink-100 text-pink-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {dog.gender === "female" ? "♀ Female" : "♂ Male"}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#063630]/80 mb-6 line-clamp-2">{dog.description}</p>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-[#063630]/70">
                    <Calendar className="mr-3 text-[#008737] h-5 w-5 flex-shrink-0" />
                    <span className="text-sm lg:text-base">{dog.age}</span>
                  </div>
                  <div className="flex items-center text-[#063630]/70">
                    <Scale className="mr-3 text-[#008737] h-5 w-5 flex-shrink-0" />
                    <span className="text-sm lg:text-base">{dog.weight} • {dog.size} size</span>
                  </div>
                  <div className="flex items-center text-[#063630]/70">
                    <MapPin className="mr-3 text-[#008737] h-5 w-5 flex-shrink-0" />
                    <span className="text-sm lg:text-base">{dog.location}, Nepal</span>
                  </div>
                </div>

                {/* Health & Training Badges */}
                <div className="flex gap-3 mb-6">
                  {dog.vaccinated && (
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      Vaccinated
                    </div>
                  )}
                  {dog.trained && (
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3" />
                      Trained
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Meet {dog.name}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 border border-[#008737] text-[#008737] rounded-xl font-semibold hover:bg-[#008737]/5 transition-colors"
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {dogs.length > petsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-12 lg:mt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`p-3 rounded-full transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#063630] hover:bg-[#008737]/10"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md"
                      : "text-[#063630] hover:bg-[#008737]/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`p-3 rounded-full transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#063630] hover:bg-[#008737]/10"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 lg:mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#008737] to-[#085558] rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Can't Find Your Match?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto text-lg">
              Join our waiting list and be the first to know when new pets are available for adoption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#008737] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Notify Me
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pets;