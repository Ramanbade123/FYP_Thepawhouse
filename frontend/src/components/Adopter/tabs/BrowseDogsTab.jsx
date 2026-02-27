import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Calendar, MapPin, Scale, Shield, Star, ChevronLeft, ChevronRight, Dog, Bone } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BrowseDogsTab = () => {
  const [dogs, setDogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [favorites, setFavorites] = useState([]);
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
  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#085558] to-[#008737] rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Bone className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Find Your Companion</span>
        </div>
        <h2 className="text-xl font-bold">{total} dog{total !== 1 ? 's' : ''} available for adoption</h2>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by breed, location..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all text-sm" />
          </div>
          <button type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
            style={{ color: '#ffffff' }}>
            <Filter className="h-4 w-4" /> Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchDogs(1); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 text-sm">Clear</button>
          )}
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-3">{error}</p>
          <button onClick={() => fetchDogs(1)} className="px-5 py-2 bg-[#008737] text-white rounded-lg text-sm">Try Again</button>
        </div>
      ) : dogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dog className="h-8 w-8 text-[#008737]" />
          </div>
          <h3 className="text-lg font-bold text-[#063630] mb-2">No dogs found</h3>
          <p className="text-gray-500 text-sm mb-4">Try a different search or check back later.</p>
          <button onClick={() => { setSearch(''); fetchDogs(1); }}
            className="px-5 py-2 bg-[#008737] text-white rounded-lg text-sm font-medium">Show All Dogs</button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dogs.map((dog, i) => (
              <motion.div key={dog._id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#008737]/10 group">
                <div className="relative h-60 overflow-hidden bg-gradient-to-br from-[#085558]/20 to-[#008737]/20">
                  {dog.primaryImage ? (
                    <img src={dog.primaryImage} alt={dog.name} crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Dog className="h-14 w-14 text-[#085558]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full">Available</span>
                  </div>
                  <button onClick={() => toggleFavorite(dog._id)}
                    className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full hover:bg-white shadow-sm transition">
                    <Heart className={`h-4 w-4 ${favorites.includes(dog._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#063630]">{dog.name}</h3>
                      <p className="text-[#008737] font-medium text-sm">{dog.breed}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${dog.gender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                      {dog.gender === 'female' ? '♀ Female' : '♂ Male'}
                    </span>
                  </div>

                  {dog.description && <p className="text-[#063630]/70 text-sm mb-3 line-clamp-2">{dog.description}</p>}

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center text-[#063630]/70 text-sm">
                      <Calendar className="mr-2 text-[#008737] h-3.5 w-3.5" />{dog.age?.value} {dog.age?.unit}
                    </div>
                    {dog.size && (
                      <div className="flex items-center text-[#063630]/70 text-sm">
                        <Scale className="mr-2 text-[#008737] h-3.5 w-3.5" />{dog.size.charAt(0).toUpperCase() + dog.size.slice(1)} size
                      </div>
                    )}
                    {(dog.location?.city || dog.location?.state) && (
                      <div className="flex items-center text-[#063630]/70 text-sm">
                        <MapPin className="mr-2 text-[#008737] h-3.5 w-3.5" />{[dog.location.city, dog.location.state].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mb-4">
                    {dog.vaccinated && <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs"><Shield className="h-3 w-3" />Vaccinated</span>}
                    {dog.neutered   && <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"><Star className="h-3 w-3" />Neutered</span>}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-[#008737] to-[#085558] text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all" style={{ color: '#ffffff' }}>
                      Adopt {dog.name}
                    </button>
                    <button className="px-4 border border-[#008737] text-[#008737] rounded-xl font-semibold text-sm hover:bg-[#008737]/5 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <button disabled={currentPage === 1} onClick={() => fetchDogs(currentPage - 1, search)}
                className={`p-2.5 rounded-full ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => fetchDogs(i + 1, search)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all ${currentPage === i + 1 ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => fetchDogs(currentPage + 1, search)}
                className={`p-2.5 rounded-full ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-[#063630] hover:bg-[#008737]/10'}`}>
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
