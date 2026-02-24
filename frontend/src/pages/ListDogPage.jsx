import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Dog, PawPrint, CheckCircle, ArrowLeft,
  Heart, Shield, Upload
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const INITIAL = {
  name: '', breed: '', gender: '', color: '',
  'age.value': '', 'age.unit': 'years',
  size: 'medium', description: '',
  vaccinated: false, neutered: false, microchipped: false,
  goodWithKids: false, goodWithDogs: false, goodWithCats: false,
  activityLevel: 'medium',
  reason: '', rehomingFee: 0, urgency: 'medium',
  'location.city': '', 'location.state': '',
  primaryImage: '',
};

const ListDogPage = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);

    const payload = {
      name:          form.name,
      breed:         form.breed,
      gender:        form.gender,
      color:         form.color,
      age:           { value: Number(form['age.value']), unit: form['age.unit'] },
      size:          form.size,
      description:   form.description,
      vaccinated:    form.vaccinated,
      neutered:      form.neutered,
      microchipped:  form.microchipped,
      goodWithKids:  form.goodWithKids,
      goodWithDogs:  form.goodWithDogs,
      goodWithCats:  form.goodWithCats,
      activityLevel: form.activityLevel,
      reason:        form.reason,
      rehomingFee:   Number(form.rehomingFee),
      urgency:       form.urgency,
      location:      { city: form['location.city'], state: form['location.state'] },
      primaryImage:  form.primaryImage,
    };

    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to list dog');
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#063630] mb-3">Dog Listed Successfully!</h2>
          <p className="text-gray-500 mb-2">Your listing has been submitted for admin review.</p>
          <p className="text-sm text-gray-400 mb-8">Once approved, your dog will be visible to adopters.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/rehomer-dashboard')}
              className="w-full py-3 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              style={{ color: '#ffffff' }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => { setDone(false); setForm(INITIAL); }}
              className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              List Another Dog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEDED] to-gray-100">

      {/* ── Header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
                  <PawPrint className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#063630]">The Paw House</h1>
                  <p className="text-sm text-[#085558]">List Your Dog</p>
                </div>
              </Link>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#085558] transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* ── Page title ── */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#063630] mb-3">Find Your Dog a Loving Home</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Fill in the details below. Once submitted, our admin team will review your listing before it goes live to potential adopters.
          </p>
        </div>

        {/* ── Trust badges ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield,  label: 'Safe & Secure',    desc: 'All adopters are verified' },
            { icon: Heart,   label: 'Caring Matches',   desc: 'We find the right families' },
            { icon: Dog,     label: 'Free to List',     desc: 'No cost to rehome' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-[#085558]/10 to-[#008737]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon className="h-5 w-5 text-[#085558]" />
              </div>
              <p className="font-semibold text-[#063630] text-sm">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Form card ── */}
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Form header */}
          <div className="bg-gradient-to-r from-[#063630] to-[#085558] p-6 text-white">
            <h3 className="text-xl font-bold">Dog Information</h3>
            <p className="text-white/70 text-sm mt-1">Fields marked with * are required</p>
          </div>

          <div className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* ── Basic Info ── */}
            <section>
              <h4 className="text-lg font-bold text-[#063630] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full text-white text-sm flex items-center justify-center font-bold">1</span>
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dog's Name *</label>
                  <input name="name" value={form.name} onChange={set} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] focus:ring-1 focus:ring-[#008737]/20 transition-all"
                    placeholder="e.g. Max" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Breed *</label>
                  <input name="breed" value={form.breed} onChange={set} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] focus:ring-1 focus:ring-[#008737]/20 transition-all"
                    placeholder="e.g. Golden Retriever Mix" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender *</label>
                  <select name="gender" value={form.gender} onChange={set} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Size</label>
                  <select name="size" value={form.size} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all">
                    <option value="small">Small (under 10kg)</option>
                    <option value="medium">Medium (10–25kg)</option>
                    <option value="large">Large (25–40kg)</option>
                    <option value="extra-large">Extra Large (40kg+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age *</label>
                  <div className="flex gap-2">
                    <input name="age.value" type="number" min="0" max="30"
                      value={form['age.value']} onChange={set} required
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all"
                      placeholder="e.g. 3" />
                    <select name="age.unit" value={form['age.unit']} onChange={set}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all">
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color / Markings</label>
                  <input name="color" value={form.color} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all"
                    placeholder="e.g. Golden Brown with white patches" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                  <textarea name="description" value={form.description} onChange={set} required rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] focus:ring-1 focus:ring-[#008737]/20 resize-none transition-all"
                    placeholder="Tell potential adopters about your dog's personality, daily routine, favourite activities, and what makes them special..." />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* ── Health ── */}
            <section>
              <h4 className="text-lg font-bold text-[#063630] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full text-white text-sm flex items-center justify-center font-bold">2</span>
                Health & Medical
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  ['vaccinated',   'Vaccinated',      '💉'],
                  ['neutered',     'Neutered / Spayed','✂️'],
                  ['microchipped', 'Microchipped',     '📡'],
                ].map(([key, label, emoji]) => (
                  <label key={key}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form[key] ? 'border-[#008737] bg-[#008737]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="checkbox" name={key} checked={form[key]} onChange={set} className="accent-[#008737] w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">{emoji} {label}</span>
                  </label>
                ))}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* ── Personality ── */}
            <section>
              <h4 className="text-lg font-bold text-[#063630] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full text-white text-sm flex items-center justify-center font-bold">3</span>
                Personality & Compatibility
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {[
                  ['goodWithKids', 'Good with Kids',  '👶'],
                  ['goodWithDogs', 'Good with Dogs',  '🐕'],
                  ['goodWithCats', 'Good with Cats',  '🐈'],
                ].map(([key, label, emoji]) => (
                  <label key={key}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form[key] ? 'border-[#008737] bg-[#008737]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="checkbox" name={key} checked={form[key]} onChange={set} className="accent-[#008737] w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">{emoji} {label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['low',    '🛋️ Low',    'Prefers calm, relaxed days'],
                    ['medium', '🚶 Medium', 'Moderate walks & playtime'],
                    ['high',   '🏃 High',   'Very energetic, needs lots of exercise'],
                  ].map(([val, label, desc]) => (
                    <label key={val}
                      className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        form.activityLevel === val ? 'border-[#008737] bg-[#008737]/5' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="activityLevel" value={val}
                        checked={form.activityLevel === val} onChange={set} className="hidden" />
                      <span className="font-semibold text-sm text-[#063630]">{label}</span>
                      <span className="text-xs text-gray-500 mt-1">{desc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* ── Rehoming Details ── */}
            <section>
              <h4 className="text-lg font-bold text-[#063630] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full text-white text-sm flex items-center justify-center font-bold">4</span>
                Rehoming Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urgency</label>
                  <select name="urgency" value={form.urgency} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all">
                    <option value="low">Low — flexible timeline</option>
                    <option value="medium">Medium — within a month</option>
                    <option value="high">High — within a week</option>
                    <option value="emergency">🚨 Emergency — immediately</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rehoming Fee (NPR)</label>
                  <input name="rehomingFee" type="number" min="0" value={form.rehomingFee} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all"
                    placeholder="0 for free" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Rehoming</label>
                  <textarea name="reason" value={form.reason} onChange={set} rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] resize-none transition-all"
                    placeholder="Please briefly explain why you need to find a new home for your dog. Being honest helps us find the right match..." />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* ── Location & Photo ── */}
            <section>
              <h4 className="text-lg font-bold text-[#063630] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full text-white text-sm flex items-center justify-center font-bold">5</span>
                Location & Photo
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                  <input name="location.city" value={form['location.city']} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all"
                    placeholder="e.g. Kathmandu" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">State / Province</label>
                  <input name="location.state" value={form['location.state']} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all"
                    placeholder="e.g. Bagmati" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Photo URL
                    <span className="ml-2 text-xs text-gray-400 font-normal">(paste a direct image link e.g. from Imgur or Cloudinary)</span>
                  </label>
                  <input name="primaryImage" value={form.primaryImage} onChange={set}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] transition-all"
                    placeholder="https://i.imgur.com/yourdog.jpg" />
                  {form.primaryImage && (
                    <img src={form.primaryImage} alt="Preview"
                      className="mt-3 h-40 w-full object-cover rounded-xl border border-gray-200"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* ── Submit ── */}
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => navigate(-1)}
                className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-2 px-10 py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ color: '#ffffff' }}>
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><Upload className="h-5 w-5" style={{ color: '#ffffff' }} /> Submit for Review</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListDogPage;