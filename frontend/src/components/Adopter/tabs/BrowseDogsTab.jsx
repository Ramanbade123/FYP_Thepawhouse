import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Heart, Calendar, MapPin,
  Scale, Shield, Star, ChevronLeft, ChevronRight,
  Dog, Bone, X, SlidersHorizontal
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const quickFilters = [
  { id: 'all',        label: 'All Dogs'          },
  { id: 'puppies',    label: 'Puppies (0-1 year)' },
  { id: 'medium',     label: 'Medium Size'        },
  { id: 'kathmandu',  label: 'Kathmandu Valley'   },
  { id: 'kids',       label: 'Good with Kids'     },
  { id: 'vaccinated', label: 'Vaccinated'         },
];

const EMPTY_FILTERS = { breed: '', gender: '', size: '', city: '', activityLevel: '' };

const BrowseDogsTab = () => {
  const navigate = useNavigate();
  const [dogs, setDogs]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [activeQuick, setActiveQuick]   = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advFilters, setAdvFilters]     = useState(EMPTY_FILTERS);
  const [favorites, setFavorites]       = useState([]);
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);

  useEffect(() => { fetchDogs(1); }, []);

  const buildParams = (page, overrides = {}) => {
    const p = new URLSearchParams({ page, limit: 6 });
    const f = { ...advFilters, ...overrides };
    if (search)          p.set('breed',         search);
    if (f.breed)         p.set('breed',         f.breed);
    if (f.gender)        p.set('gender',        f.gender);
    if (f.size)          p.set('size',          f.size);
    if (f.city)          p.set('city',          f.city);
    if (f.activityLevel) p.set('activityLevel', f.activityLevel);
    return p;
  };

  const fetchDogs = async (page = 1, overrides = {}) => {
    setLoading(true); setError('');
    try {
      const params = buildParams(page, overrides);
      const res    = await fetch(`${API}/pets?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDogs(data.data);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setError('Failed to load dogs. Please try again.');
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveQuick('all');
    fetchDogs(1);
  };

  const handleQuickFilter = (f) => {
    setActiveQuick(f.id);
    setSearch('');
    setAdvFilters(EMPTY_FILTERS);
    if (f.id === 'all')        { fetchDogs(1, {}); return; }
    if (f.id === 'puppies')    { fetchDogs(1, {}); return; } // client-side filter below
    if (f.id === 'medium')     { fetchDogs(1, { size: 'medium' }); return; }
    if (f.id === 'kathmandu')  { fetchDogs(1, { city: 'Kathmandu' }); return; }
    if (f.id === 'kids')       { fetchDogs(1, {}); return; }
    if (f.id === 'vaccinated') { fetchDogs(1, {}); return; }
  };

  const handleAdvancedSearch = (e) => {
    e.preventDefault();
    setActiveQuick('all');
    setShowAdvanced(false);
    fetchDogs(1);
  };

  const clearAdvanced = () => {
    setAdvFilters(EMPTY_FILTERS);
    setSearch('');
    setActiveQuick('all');
    fetchDogs(1, {});
  };

  const hasActiveFilters = Object.values(advFilters).some(Boolean) || search;

  const toggleFavorite = (id) => setFavorites(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const selectClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#063630] focus:outline-none focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/10 transition-all";
  const inputClass  = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#063630] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/10 transition-all";

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-4">
          <Bone className="h-4 w-4" />
          <span className="text-sm font-semibold">Meet Our Friends</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063630] mb-3">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">Perfect Companion</span>
        </h2>
        <p className="text-lg text-[#063630]/80 max-w-2xl mx-auto">
          Discover loyal dogs from across Nepal waiting for their forever homes. Every adoption saves a life.
        </p>
      </div>

      {/* Search & Filters box */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#008737]/10 p-6 mb-8 lg:mb-12">

        {/* Search row */}
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-center gap-6 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848AFF] h-5 w-5" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by breed, location, or age..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all duration-200 text-[#063630]" />
          </div>
          <button type="button" onClick={() => setShowAdvanced(p => !p)}
            className={`lg:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${
              showAdvanced
                ? 'bg-[#063630] text-white'
                : 'bg-gradient-to-r from-[#008737] to-[#085558] text-white'
            }`}
            style={{ color: '#ffffff' }}>
            <SlidersHorizontal className="h-4 w-4" style={{ color: '#ffffff' }} />
            <span>Advanced Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
          </button>
        </form>

        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-3">
          {quickFilters.map(f => (
            <button key={f.id} onClick={() => handleQuickFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeQuick === f.id
                  ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md'
                  : 'bg-gray-100 text-[#063630] hover:bg-gray-200'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#063630] flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#008737]" /> Advanced Filters
                  </h3>
                  {hasActiveFilters && (
                    <button onClick={clearAdvanced} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
                      <X className="h-3.5 w-3.5" /> Clear all
                    </button>
                  )}
                </div>

                <form onSubmit={handleAdvancedSearch}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">

                    {/* Breed */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Breed</label>
                      <input type="text" value={advFilters.breed}
                        onChange={e => setAdvFilters(p => ({ ...p, breed: e.target.value }))}
                        placeholder="e.g. Labrador, Poodle"
                        className={inputClass} />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Gender</label>
                      <select value={advFilters.gender}
                        onChange={e => setAdvFilters(p => ({ ...p, gender: e.target.value }))}
                        className={selectClass}>
                        <option value="">Any Gender</option>
                        <option value="male">♂ Male</option>
                        <option value="female">♀ Female</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Size</label>
                      <select value={advFilters.size}
                        onChange={e => setAdvFilters(p => ({ ...p, size: e.target.value }))}
                        className={selectClass}>
                        <option value="">Any Size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="extra-large">Extra Large</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">City</label>
                      <input type="text" value={advFilters.city}
                        onChange={e => setAdvFilters(p => ({ ...p, city: e.target.value }))}
                        placeholder="e.g. Kathmandu, Pokhara"
                        className={inputClass} />
                    </div>

                    {/* Activity Level */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Activity Level</label>
                      <select value={advFilters.activityLevel}
                        onChange={e => setAdvFilters(p => ({ ...p, activityLevel: e.target.value }))}
                        className={selectClass}>
                        <option value="">Any Activity</option>
                        <option value="low">Low — Calm & relaxed</option>
                        <option value="medium">Medium — Moderate walks</option>
                        <option value="high">High — Very energetic</option>
                      </select>
                    </div>

                  </div>

                  <div className="flex gap-3">
                    <button type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                      style={{ color: '#ffffff' }}>
                      <Search className="h-4 w-4" style={{ color: '#ffffff' }} /> Apply Filters
                    </button>
                    <button type="button" onClick={clearAdvanced}
                      className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-4">
          {total > 0 ? `Showing ${dogs.length} of ${total} dog${total !== 1 ? 's' : ''}` : ''}
        </p>
      )}

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
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
          <button onClick={clearAdvanced} className="px-6 py-2 bg-[#008737] text-white rounded-xl font-medium">Show All Dogs</button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {dogs.map((dog, i) => (
              <motion.div key={dog._id}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#008737]/10 group">

                <div className="relative h-64 lg:h-72 overflow-hidden">
                  {dog.primaryImage ? (
                    <img src={dog.primaryImage} alt={dog.name} crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex items-center justify-center">
                      <Dog className="h-16 w-16 text-[#085558]/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full shadow-md">Available</span>
                  </div>
                  <button onClick={() => toggleFavorite(dog._id)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm">
                    <Heart className={`h-5 w-5 ${favorites.includes(dog._id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/60 via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-[#063630] mb-1">{dog.name}</h3>
                      <p className="text-[#008737] font-medium">{dog.breed}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${dog.gender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                      {dog.gender === 'female' ? '♀ Female' : '♂ Male'}
                    </div>
                  </div>

                  {dog.description && <p className="text-[#063630]/80 mb-6 line-clamp-2">{dog.description}</p>}

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

                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/dogs/' + dog._id)}
                      className="flex-1 bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      style={{ color: '#ffffff' }}>
                      Meet {dog.name}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/dogs/' + dog._id)}
                    className="px-4 border border-[#008737] text-[#008737] rounded-xl font-semibold hover:bg-[#008737]/5 transition-colors">
                      Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 lg:mt-16">
              <button disabled={currentPage === 1} onClick={() => fetchDogs(currentPage - 1)}
                className={`p-3 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => fetchDogs(i + 1)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 ${currentPage === i + 1 ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => fetchDogs(currentPage + 1)}
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