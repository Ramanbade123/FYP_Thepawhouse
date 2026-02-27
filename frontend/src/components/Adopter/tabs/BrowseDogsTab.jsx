import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Heart, Calendar, MapPin,
  Scale, Shield, Star, ChevronLeft, ChevronRight,
  Dog, Bone
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const filters = [
  { id: 'all',       label: 'All Dogs'         },
  { id: 'puppies',   label: 'Puppies (0-1 year)', query: { age: '0-1' } },
  { id: 'medium',    label: 'Medium Size',        query: { size: 'medium' } },
  { id: 'kathmandu', label: 'Kathmandu Valley',   query: { city: 'Kathmandu' } },
  { id: 'kids',      label: 'Good with Kids',     query: { goodWithKids: true } },
  { id: 'vaccinated',label: 'Vaccinated',          query: { vaccinated: true } },
];

const BrowseDogsTab = () => {
  const [dogs, setDogs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [favorites, setFavorites]     = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);

  useEffect(() => { fetchDogs(1); }, []);

  const fetchDogs = async (page = 1, breed = '') => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit: 6 });
      if (breed) params.set('breed', breed);
      const res  = await fetch(`${API}/pets?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDogs(data.data);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load dogs. Please try again.');
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchDogs(1, search); };
  const toggleFavorite = (id) => setFavorites(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-4">
          <Bone className="h-4 w-4" />
          <span className="text-sm font-semibold">Meet Our Friends</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#063630] mb-3">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">Perfect Companion</span>
        </h2>
        <p className="text-lg text-[#063630]/80 max-w-xl mx-auto">
          {total > 0 ? `${total} dog${total !== 1 ? 's' : ''} waiting for their forever home.` : 'Discover dogs waiting for their forever homes.'}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#008737]/10 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848AFF] h-5 w-5" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by breed, location, or age..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all text-[#063630]" />
          </div>
          <button type="submit"
            className="lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            style={{ color: '#ffffff' }}>
            <Filter className="h-4 w-4" style={{ color: '#ffffff' }} />
            <span>Advanced Filters</span>
          </button>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => fetchDogs(1)} className="px-6 py-2 bg-[#008737] text-white rounded-xl font-medium">Try Again</button>
        </div>
      ) : dogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dog className="h-10 w-10 text-[#008737]" />
          </div>
          <h3 className="text-xl font-bold text-[#063630] mb-2">No dogs found</h3>
          <p className="text-gray-500 mb-4">Try a different search or check back later.</p>
          <button onClick={() => { setSearch(''); fetchDogs(1); }}
            className="px-6 py-2 bg-[#008737] text-white rounded-xl font-medium">Show All Dogs</button>
        </div>
      ) : (
        <>
          {/* Dogs Grid — exact same as landing page */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {dogs.map((dog, i) => (
              <motion.div key={dog._id}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#008737]/10 group">

                {/* Image Section */}
                <div className="relative h-64 lg:h-72 overflow-hidden">
                  {dog.primaryImage ? (
                    <img src={dog.primaryImage} alt={dog.name} crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex items-center justify-center">
                      <Dog className="h-16 w-16 text-[#085558]/30" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full shadow-md">
                      Available
                    </span>
                  </div>
                  {/* Favorite Button */}
                  <button onClick={() => toggleFavorite(dog._id)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm">
                    <Heart className={`h-5 w-5 ${favorites.includes(dog._id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                  </button>
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/60 via-transparent to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Name & Gender */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-[#063630] mb-1">{dog.name}</h3>
                      <p className="text-[#008737] font-medium">{dog.breed}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${dog.gender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                      {dog.gender === 'female' ? '♀ Female' : '♂ Male'}
                    </div>
                  </div>

                  {/* Description */}
                  {dog.description && (
                    <p className="text-[#063630]/80 mb-6 line-clamp-2">{dog.description}</p>
                  )}

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-[#063630]/70">
                      <Calendar className="mr-3 text-[#008737] h-5 w-5 flex-shrink-0" />
                      <span className="text-sm lg:text-base">{dog.age?.value} {dog.age?.unit}</span>
                    </div>
                    {dog.size && (
                      <div className="flex items-center text-[#063630]/70">
                        <Scale className="mr-3 text-[#008737] h-5 w-5 flex-shrink-0" />
                        <span className="text-sm lg:text-base capitalize">{dog.size} size</span>
                      </div>
                    )}
                    {(dog.location?.city || dog.location?.state) && (
                      <div className="flex items-center text-[#063630]/70">
                        <MapPin className="mr-3 text-[#008737] h-5 w-5 flex-shrink-0" />
                        <span className="text-sm lg:text-base">{[dog.location.city, dog.location.state].filter(Boolean).join(', ')}, Nepal</span>
                      </div>
                    )}
                  </div>

                  {/* Health Badges */}
                  <div className="flex gap-3 mb-6">
                    {dog.vaccinated && (
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Shield className="h-3 w-3" /> Vaccinated
                      </div>
                    )}
                    {dog.neutered && (
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Star className="h-3 w-3" /> Neutered
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      style={{ color: '#ffffff' }}>
                      Meet {dog.name}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="px-4 border border-[#008737] text-[#008737] rounded-xl font-semibold hover:bg-[#008737]/5 transition-colors">
                      Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button disabled={currentPage === 1} onClick={() => fetchDogs(currentPage - 1, search)}
                className={`p-3 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => fetchDogs(i + 1, search)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 ${currentPage === i + 1 ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => fetchDogs(currentPage + 1, search)}
                className={`p-3 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseDogsTab;