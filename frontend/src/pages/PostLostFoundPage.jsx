import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, AlertCircle, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiFetch = async (method, url, body = null, isForm = false) => {
  const token = localStorage.getItem('token');
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  if (!isForm && body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${url}`, { method, headers, body: isForm ? body : (body ? JSON.stringify(body) : undefined) });
  const data = await res.json();
  if (!res.ok) throw { response: { data } };
  return { data };
};

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Chitwan', 'Other'];
const SIZES  = ['small', 'medium', 'large', 'extra-large'];

const PostLostFoundPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'lost', dogName: '', breed: '', color: '', size: 'medium',
    gender: 'unknown', description: '', date: '',
    area: '', city: 'Kathmandu', details: '',
    contactName: '', contactPhone: '', contactEmail: '',
  });
  const [photo, setPhoto]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.color || !form.area || !form.date || !form.contactName || !form.contactPhone) {
      setError('Please fill in all required fields (colour, area, date, contact name & phone).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('type',        form.type);
      fd.append('dogName',     form.dogName);
      fd.append('breed',       form.breed || 'Unknown');
      fd.append('color',       form.color);
      fd.append('size',        form.size);
      fd.append('gender',      form.gender);
      fd.append('description', form.description);
      fd.append('date',        form.date);
      fd.append('location',    JSON.stringify({ area: form.area, city: form.city, details: form.details }));
      fd.append('contactName',  form.contactName);
      fd.append('contactPhone', form.contactPhone);
      fd.append('contactEmail', form.contactEmail);
      if (photo) fd.append('photo', photo);

      await apiFetch('POST', '/lostfound', fd, true);
      navigate('/lost-found');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#EDEDED', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto max-w-3xl px-4">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/lost-found')}
          className="group flex items-center gap-2 text-sm font-semibold text-[#063630]/60 hover:text-[#063630] mb-6 transition-colors"
        >
          <div className="p-2 rounded-full bg-white group-hover:bg-[#063630] group-hover:text-white transition-all shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Reports
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#063630]">Post a Lost / Found Report</h1>
            <p className="text-[#063630]/60 text-sm mt-1">Help reunite dogs with their families by submitting accurate information.</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Type toggle */}
            <div className="grid grid-cols-2 gap-4 bg-[#EDEDED] p-1.5 rounded-2xl">
              {['lost', 'found'].map(t => (
                <button 
                  key={t} 
                  onClick={() => set('type', t)}
                  className={`py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    form.type === t
                      ? 'bg-white text-[#063630] shadow-sm ring-1 ring-gray-900/5'
                      : 'text-[#063630]/60 hover:text-[#063630]'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${t === 'lost' ? 'bg-[#063630]' : 'bg-[#008737]'} ${form.type === t ? 'opacity-100' : 'opacity-40'}`}></div>
                  {t === 'lost' ? 'I Lost My Dog' : 'I Found a Dog'}
                </button>
              ))}
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-[#063630] mb-2">Dog Photo</label>
              <div
                onClick={() => document.getElementById('lf-photo').click()}
                className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-[#008737] hover:bg-[#008737]/5 transition-all overflow-hidden group"
              >
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-[#063630]/40 group-hover:text-[#008737] transition-colors">
                    <Camera className="h-10 w-10 mb-3" />
                    <p className="text-sm font-medium">Click to upload a photo</p>
                    <p className="text-xs mt-1 opacity-70">JPEG, PNG up to 5MB</p>
                  </div>
                )}
              </div>
              <input id="lf-photo" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            {/* Dog details */}
            <div className="bg-[#EDEDED]/50 rounded-2xl p-6 space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-200 pb-3">Dog Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dog's Name (if known)</label>
                  <input value={form.dogName} onChange={e => set('dogName', e.target.value)}
                    placeholder="e.g. Bruno" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Breed</label>
                  <input value={form.breed} onChange={e => set('breed', e.target.value)}
                    placeholder="e.g. Labrador / Mixed" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Colour <span className="text-red-500">*</span></label>
                  <input value={form.color} onChange={e => set('color', e.target.value)}
                    placeholder="e.g. Brown & white" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Size</label>
                  <select value={form.size} onChange={e => set('size', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white">
                    {SIZES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white">
                    <option value="unknown">Unknown</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date {form.type === 'lost' ? 'Lost' : 'Found'} <span className="text-red-500">*</span></label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description (optional)</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={3} placeholder="Any distinguishing features, collar colour, behaviour..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all resize-none bg-white" />
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#EDEDED]/50 rounded-2xl p-6 space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-200 pb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#008737]" /> Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Area / Neighbourhood <span className="text-red-500">*</span></label>
                  <input value={form.area} onChange={e => set('area', e.target.value)}
                    placeholder="e.g. Thamel, Chabahil" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <select value={form.city} onChange={e => set('city', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location Details (optional)</label>
                  <input value={form.details} onChange={e => set('details', e.target.value)}
                    placeholder="e.g. Near the park on Ring Road, opposite the temple"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#EDEDED]/50 rounded-2xl p-6 space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-200 pb-3">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name <span className="text-red-500">*</span></label>
                  <input value={form.contactName} onChange={e => set('contactName', e.target.value)}
                    placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)}
                    placeholder="98XXXXXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email (optional)</label>
                  <input value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)}
                    type="email" placeholder="your@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] transition-all bg-white" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3.5 rounded-xl text-sm border border-red-100">
                <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#063630] to-[#085558] text-white text-base font-bold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLostFoundPage;
