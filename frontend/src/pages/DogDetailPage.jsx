import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Calendar, MapPin, Scale, Shield, Star,
  Dog, Phone, Mail, CheckCircle, XCircle, PawPrint,
  Activity, Users, Cat, Baby, Home, Clock, MessageCircle, Send, Trash2
} from 'lucide-react';
import AdopterHeader from '../components/Adopter/AdopterHeader';

// ── Inline Reviews component ──────────────────────────────────────────────────
const StarRating = ({ value, onChange, readOnly = false, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  const sz = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button" disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}>
          <Star className={`${sz} transition-colors ${
            star <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`} />
        </button>
      ))}
    </div>
  );
};

const ReviewsSection = ({ petId, user }) => {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [reviews, setReviews]     = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: '', body: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const res  = await fetch(`${API}/pets/${petId}/reviews`);
      const data = await res.json();
      if (data.success) { setReviews(data.data); setAvgRating(data.avgRating); }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [petId]);

  const alreadyReviewed = reviews.some(r => r.reviewer?._id === user?._id || r.reviewer?._id === user?.id);

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (!form.rating) return setError('Please select a star rating.');
    if (!form.title.trim()) return setError('Please provide a title.');
    if (!form.body.trim()) return setError('Please write your review.');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API}/pets/${petId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Review submitted!');
        setForm({ rating: 0, title: '', body: '' });
        setShowForm(false);
        fetchReviews();
      } else { setError(data.error || 'Could not submit review.'); }
    } catch { setError('Server error.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete your review?')) return;
    try {
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API}/pets/${petId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchReviews();
    } catch {}
  };

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)   return 'just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-[#063630] text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#008737]" /> Reviews
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(avgRating)} readOnly size="sm" />
              <span className="text-sm font-semibold text-[#063630]">{avgRating}</span>
              <span className="text-xs text-gray-400">({reviews.length})</span>
            </div>
          )}
        </div>
        {user?.role === 'adopter' && !alreadyReviewed && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="text-sm font-semibold text-[#008737] hover:underline">
            + Write a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div className="border border-[#008737]/20 bg-green-50/30 rounded-xl p-4 mb-5">
          <h4 className="font-semibold text-[#063630] mb-3">Your Review</h4>
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Rating <span className="text-red-500">*</span></p>
            <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Title <span className="text-red-500">*</span></p>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Wonderful experience!" maxLength={100}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]" />
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Review <span className="text-red-500">*</span></p>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Share your experience with this dog..." rows={4} maxLength={1000}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737] resize-none" />
            <p className="text-xs text-gray-400 text-right">{form.body.length}/1000</p>
          </div>
          {error   && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
          <div className="flex gap-2">
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl text-sm font-semibold disabled:opacity-60"
              style={{ color: '#fff' }}>
              <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button onClick={() => { setShowForm(false); setError(''); }}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-4">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="h-10 w-10 text-gray-200 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to leave one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => {
            const isOwner = review.reviewer?._id === user?._id || review.reviewer?._id === user?.id;
            return (
              <div key={review._id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#085558] to-[#008737] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {review.reviewer?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#063630] text-sm">{review.reviewer?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2">
                        <StarRating value={review.rating} readOnly size="sm" />
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                    {isOwner && (
                      <button onClick={() => handleDelete(review._id)}
                        className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-[#063630] text-sm mb-1">{review.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const imgSrc = (url) => { if (!url) return null; return url.startsWith('http') ? url : `${BASE_URL}${url}`; };

// Quick "Message Rehomer" button — starts a conversation and redirects to dashboard messages
const MessageRehomerButton = ({ petId, petName, user }) => {
  const navigate   = useNavigate();
  const API        = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [loading, setLoading] = useState(false);

  const handleMessage = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/messages/start`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ petId }),
      });
      const data = await res.json();
      if (data.success) {
        // Store pending conversation so the messages tab can auto-open it
        localStorage.setItem('openConversation', data.data._id);
        navigate('/adopter/dashboard', { state: { tab: 'messages' } });
      }
    } catch { alert('Could not start conversation. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <button onClick={handleMessage} disabled={loading}
      className="mt-3 w-full py-3 border-2 border-[#008737] text-[#008737] rounded-2xl font-semibold text-base hover:bg-[#008737]/5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
      <MessageCircle className="h-5 w-5" />
      {loading ? 'Opening chat...' : `Message Rehomer about ${petName}`}
    </button>
  );
};

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

      {/* Adopter Header */}
      <AdopterHeader
        user={user}
        activeTab="browse"
        setActiveTab={(tab) => navigate('/adopter/dashboard', { state: { tab } })}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#063630] hover:text-[#008737] font-medium transition-colors mb-6 group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Browse
        </button>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left — Image */}
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-[#085558]/20 to-[#008737]/20">
              {imgSrc(pet.primaryImage) ? (
                <img src={imgSrc(pet.primaryImage)} alt={pet.name} crossOrigin="anonymous"
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

            {/* Message Rehomer button */}
            {user?.role === 'adopter' && (
              <MessageRehomerButton petId={pet._id} petName={pet.name} user={user} />
            )}
          </motion.div>
        </div>

        {/* Reviews — full width below */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <ReviewsSection petId={pet._id || id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default DogDetailPage;