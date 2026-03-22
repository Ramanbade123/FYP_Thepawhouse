import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Scale, Shield, Star, Dog, Bone } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const imgSrc = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const FavouritesTab = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u?.favorites || [];
  });

  const fetchProfile = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDogs(data.data.favorites || []);
      
      // Keep local favorites array in sync
      const favIds = (data.data.favorites || []).map(d => d._id);
      setFavorites(favIds);
      
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      u.favorites = favIds;
      localStorage.setItem('user', JSON.stringify(u));
    } catch (err) {
      console.error(err);
      setError('Failed to load your favorite dogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleFavorite = async (id, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistically remove from grid
    setDogs(prev => prev.filter(d => d._id !== id));
    setFavorites(prev => prev.filter(x => x !== id));

    try {
      const res = await fetch(`${API}/users/favorites/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data);
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        u.favorites = data.data;
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch (error) {
      console.error('Favorite toggle failed', error);
      fetchProfile(); // Re-sync on error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchProfile} className="px-6 py-2 bg-[#008737] text-white rounded-xl font-medium">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {dogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-red-300" />
          </div>
          <h3 className="text-xl font-bold text-[#063630] mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">You haven't saved any dogs to your favorites list.</p>
          <button onClick={() => navigate('/adopter/dashboard', { state: { tab: 'browse' } })} 
            className="px-6 py-2.5 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-medium transition-all hover:shadow-lg">
            Browse Available Dogs
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {dogs.map((dog, i) => (
            <motion.div key={dog._id}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">

              <div className="relative h-64 lg:h-72 overflow-hidden cursor-pointer" onClick={() => navigate('/dogs/' + dog._id)}>
                {imgSrc(dog.primaryImage) ? (
                  <img src={imgSrc(dog.primaryImage)} alt={dog.name} crossOrigin="anonymous"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 flex items-center justify-center">
                    <Dog className="h-16 w-16 text-[#085558]/30" />
                  </div>
                )}
                {dog.status !== 'pending' && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full shadow-md">Available</span>
                  </div>
                )}
                <button onClick={(e) => toggleFavorite(dog._id, e)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm z-10">
                  <Heart className={`h-5 w-5 ${favorites.includes(dog._id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/60 via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#063630] mb-1">{dog.name}</h3>
                    <p className="text-[#008737] font-medium text-sm">{dog.breed}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${dog.gender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                    {dog.gender === 'female' ? '♀ Female' : '♂ Male'}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-[#063630]/70">
                    <Calendar className="mr-3 text-[#008737] h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{dog.age?.value} {dog.age?.unit}</span>
                  </div>
                  {dog.size && (
                    <div className="flex items-center text-[#063630]/70">
                      <Scale className="mr-3 text-[#008737] h-4 w-4 flex-shrink-0" />
                      <span className="text-sm capitalize">{dog.size} size</span>
                    </div>
                  )}
                  {(dog.location?.city || dog.location?.state) && (
                    <div className="flex items-center text-[#063630]/70">
                      <MapPin className="mr-3 text-[#008737] h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{[dog.location.city, dog.location.state].filter(Boolean).join(', ')}, Nepal</span>
                    </div>
                  )}
                </div>

                <button onClick={() => navigate('/dogs/' + dog._id)}
                  className="w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  style={{ color: '#ffffff' }}>
                  Meet {dog.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesTab;
