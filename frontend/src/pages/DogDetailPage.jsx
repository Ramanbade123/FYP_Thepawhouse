import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Calendar, MapPin, Scale, Shield, Star,
  Dog, Phone, Mail, CheckCircle, XCircle, PawPrint,
  Activity, Users, Cat, Baby, Home, Clock
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const DogDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [pet, setPet]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState(false);
  const [favorite, setFavorite] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res  = await fetch(`${API}/pets/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setPet(data.data);
      } catch (err) {
        setError('Dog not found or server error.');
      } finally { setLoading(false); }
    };
    fetchPet();
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets/${id}/apply`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ message: 'I would love to adopt this dog!' }),
      });
      const data = await res.json();
      if (data.success) setApplied(true);
      else alert(data.error || 'Could not submit application.');
    } catch { alert('Server error. Please try again.'); }
    finally { setApplying(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
      <div className="text-center">
        <Dog className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#008737] text-white rounded-xl">Go Back</button>
      </div>
    </div>
  );

  const boolBadge = (val, label) => val
    ? <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"><CheckCircle className="h-4 w-4" />{label}</span>
    : <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-sm font-medium"><XCircle className="h-4 w-4" />{label}</span>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100">

      {/* Top nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#063630] hover:text-[#008737] font-medium transition-colors">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
              <PawPrint className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[#063630]">The Paw House</span>
          </Link>
          <button onClick={() => setFavorite(p => !p)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:border-red-300 transition-all">
            <Heart className={`h-5 w-5 ${favorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            <span className="text-sm font-medium text-gray-600">{favorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left — Image */}
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-[#085558]/20 to-[#008737]/20">
              {pet.primaryImage ? (
                <img src={pet.primaryImage} alt={pet.name} crossOrigin="anonymous"
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Dog className="h-24 w-24 text-[#085558]/30" />
                </div>
              )}
            </motion.div>

            {/* Rehomer contact card */}
            {pet.rehomer && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <h3 className="font-bold text-[#063630] mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#008737]" /> Listed by
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {pet.rehomer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#063630]">{pet.rehomer.name}</p>
                    <p className="text-sm text-gray-500">{pet.rehomer.location?.city || 'Nepal'}</p>
                  </div>
                </div>
                {applied ? (
                  <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Application Submitted!
                  </div>
                ) : (
                  <button onClick={handleApply} disabled={applying || !user || user?.role !== 'adopter'}
                    className="w-full py-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60"
                    style={{ color: '#ffffff' }}>
                    {applying ? 'Submitting...' : user?.role === 'adopter' ? `Adopt ${pet.name}` : user ? 'Only adopters can apply' : 'Login to Apply'}
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Right — Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>

            {/* Status + Name */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full">Available</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pet.gender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                  {pet.gender === 'female' ? '♀ Female' : '♂ Male'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-[#063630] mb-1">{pet.name}</h1>
              <p className="text-xl text-[#008737] font-semibold">{pet.breed}</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#008737]" />
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="font-semibold text-[#063630]">{pet.age?.value} {pet.age?.unit}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <Scale className="h-5 w-5 text-[#008737]" />
                <div>
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="font-semibold text-[#063630] capitalize">{pet.size || '—'}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#008737]" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold text-[#063630]">{[pet.location?.city, pet.location?.state].filter(Boolean).join(', ') || '—'}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <Activity className="h-5 w-5 text-[#008737]" />
                <div>
                  <p className="text-xs text-gray-500">Activity</p>
                  <p className="font-semibold text-[#063630] capitalize">{pet.activityLevel || '—'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {pet.description && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-bold text-[#063630] mb-2">About {pet.name}</h3>
                <p className="text-[#063630]/80 leading-relaxed">{pet.description}</p>
              </div>
            )}

            {/* Health & Care */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#063630] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#008737]" /> Health & Care
              </h3>
              <div className="flex flex-wrap gap-2">
                {boolBadge(pet.vaccinated,   'Vaccinated')}
                {boolBadge(pet.neutered,     'Neutered')}
                {boolBadge(pet.microchipped, 'Microchipped')}
              </div>
            </div>

            {/* Compatibility */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#063630] mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-[#008737]" /> Good With
              </h3>
              <div className="flex flex-wrap gap-2">
                {boolBadge(pet.goodWithKids, 'Kids')}
                {boolBadge(pet.goodWithDogs, 'Dogs')}
                {boolBadge(pet.goodWithCats, 'Cats')}
              </div>
            </div>

            {/* Rehoming info */}
            {(pet.reason || pet.urgency || pet.rehomingFee !== undefined) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-bold text-[#063630] mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#008737]" /> Rehoming Info
                </h3>
                {pet.reason && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Reason for Rehoming</p>
                    <p className="text-[#063630]/80">{pet.reason}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  {pet.urgency && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Urgency</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        pet.urgency === 'urgent' ? 'bg-red-100 text-red-700' : pet.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{pet.urgency}</span>
                    </div>
                  )}
                  {pet.rehomingFee !== undefined && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Adoption Fee</p>
                      <p className="font-semibold text-[#063630]">{pet.rehomingFee === 0 ? 'Free' : `NPR ${pet.rehomingFee}`}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            {applied ? (
              <div className="w-full py-4 bg-green-50 text-green-700 rounded-2xl text-center font-semibold flex items-center justify-center gap-2 text-lg border border-green-200">
                <CheckCircle className="h-6 w-6" /> Application Submitted!
              </div>
            ) : (
              <button onClick={handleApply} disabled={applying || !user || user?.role !== 'adopter'}
                className="w-full py-4 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-60"
                style={{ color: '#ffffff' }}>
                {applying ? 'Submitting...' : user?.role === 'adopter' ? `🐾 Adopt ${pet.name}` : user ? 'Only adopters can apply' : 'Login to Apply'}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DogDetailPage;