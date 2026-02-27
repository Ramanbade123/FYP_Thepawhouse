import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Dog, PawPrint, CheckCircle, ArrowLeft,
  Heart, Shield, Upload, Info, ImagePlus, X
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
  imageFile: null,
  imagePreview: '',
};

const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/10 transition-all";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

const SectionHeader = ({ number, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-7">
    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-[#085558] to-[#008737] rounded-xl flex items-center justify-center shadow-sm">
      <span className="text-white text-sm font-bold">{number}</span>
    </div>
    <div>
      <h4 className="text-base font-bold text-[#063630]">{title}</h4>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const ToggleCard = ({ name, checked, onChange, label, emoji, description }) => (
  <label className={`relative flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
    checked
      ? 'border-[#008737] bg-gradient-to-br from-[#008737]/5 to-[#085558]/5 shadow-sm'
      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
  }`}>
    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      checked ? 'bg-[#008737] border-[#008737]' : 'border-gray-300'
    }`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
    <div>
      <span className="text-sm font-semibold text-gray-700">{emoji} {label}</span>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  </label>
);

const ListDogPage = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const set = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, imageFile: file, imagePreview: preview }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const clearImage = () => {
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm(prev => ({ ...prev, imageFile: null, imagePreview: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // If there's a file, upload it first or send as multipart
      const formData = new FormData();
      formData.append('name',          form.name);
      formData.append('breed',         form.breed);
      formData.append('gender',        form.gender);
      formData.append('color',         form.color);
      formData.append('age[value]',    Number(form['age.value']));
      formData.append('age[unit]',     form['age.unit']);
      formData.append('size',          form.size);
      formData.append('description',   form.description);
      formData.append('vaccinated',    form.vaccinated);
      formData.append('neutered',      form.neutered);
      formData.append('microchipped',  form.microchipped);
      formData.append('goodWithKids',  form.goodWithKids);
      formData.append('goodWithDogs',  form.goodWithDogs);
      formData.append('goodWithCats',  form.goodWithCats);
      formData.append('activityLevel', form.activityLevel);
      formData.append('reason',        form.reason);
      formData.append('rehomingFee',   Number(form.rehomingFee));
      formData.append('urgency',       form.urgency);
      formData.append('location[city]',  form['location.city']);
      formData.append('location[state]', form['location.state']);
      if (form.imageFile) formData.append('primaryImage', form.imageFile);

      const res = await fetch(`${API}/pets`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
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

  /* ── Success screen ─────────────────────────────────────────────── */
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full border border-gray-100">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full opacity-10 animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="h-11 w-11 text-white" />
            </div>
          </div>
          <div className="inline-block px-3 py-1 bg-[#008737]/10 text-[#085558] text-xs font-bold uppercase tracking-widest rounded-full mb-4">Submission Received</div>
          <h2 className="text-2xl font-bold text-[#063630] mb-3">Your Dog is Listed!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Your listing has been submitted for admin review and will go live to potential adopters once approved.
          </p>
          <p className="text-xs text-gray-400 mb-8">This typically takes 24–48 hours.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/rehomer/dashboard')}
              className="w-full py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#008737]/20 transition-all text-sm"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => { setDone(false); setForm(INITIAL); }}
              className="w-full py-3.5 border border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              List Another Dog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-gray-100 relative overflow-x-hidden">

      {/* ── Background dog watermark ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none fixed inset-0 z-0 flex items-center justify-end pr-0 overflow-hidden"
      >
        <img
          src="https://www.transparentpng.com/thumb/dog/sitting-dog-clipart-transparent-background-6.png"
          alt=""
          style={{
            width: '680px',
            maxWidth: 'none',
            opacity: 0.045,
            filter: 'grayscale(100%)',
            transform: 'translateX(10%)',
          }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-[#008737]/30 transition-shadow">
                <PawPrint className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#063630] leading-tight">The Paw House</h1>
                <p className="text-xs text-[#008737] font-medium">List Your Dog</p>
              </div>
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#085558] transition-colors font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-4xl relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#008737]/10 rounded-full mb-5">
            <Dog className="h-4 w-4 text-[#085558]" />
            <span className="text-xs font-bold text-[#085558] uppercase tracking-widest">Rehoming Form</span>
          </div>
          <h2 className="text-3xl font-bold text-[#063630] mb-3 leading-tight">
            Find Your Dog<br />a Loving New Home
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Complete the form below with accurate details about your dog. Our team will review your listing before publishing it to verified adopters.
          </p>
        </div>

        {/* ── Trust badges ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Shield,  label: 'Safe & Secure',  desc: 'All adopters are verified' },
            { icon: Heart,   label: 'Caring Matches', desc: 'We find the right families' },
            { icon: Dog,     label: 'Free to List',   desc: 'No cost to rehome' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 bg-gradient-to-br from-[#085558]/10 to-[#008737]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-[#085558]" />
              </div>
              <p className="font-bold text-[#063630] text-sm">{label}</p>
              <p className="text-gray-400 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Form ─────────────────────────────────────────────────── */}
        <form onSubmit={submit} className="space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm flex items-center gap-3">
              <Info className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* ── Section 1: Basic Info ─────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <SectionHeader number="1" title="Basic Information" subtitle="Name, breed, age, and physical traits" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Dog's Name <span className="text-[#008737]">*</span></label>
                  <input name="name" value={form.name} onChange={set} required className={inputClass} placeholder="e.g. Max" />
                </div>
                <div>
                  <label className={labelClass}>Breed <span className="text-[#008737]">*</span></label>
                  <input name="breed" value={form.breed} onChange={set} required className={inputClass} placeholder="e.g. Golden Retriever Mix" />
                </div>
                <div>
                  <label className={labelClass}>Gender <span className="text-[#008737]">*</span></label>
                  <select name="gender" value={form.gender} onChange={set} required className={inputClass}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Size</label>
                  <select name="size" value={form.size} onChange={set} className={inputClass}>
                    <option value="small">Small — under 10kg</option>
                    <option value="medium">Medium — 10–25kg</option>
                    <option value="large">Large — 25–40kg</option>
                    <option value="extra-large">Extra Large — 40kg+</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Age <span className="text-[#008737]">*</span></label>
                  <div className="flex gap-2">
                    <input name="age.value" type="number" min="0" max="30"
                      value={form['age.value']} onChange={set} required
                      className={`${inputClass} flex-1`}
                      placeholder="e.g. 3" />
                    <select name="age.unit" value={form['age.unit']} onChange={set}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#008737] focus:bg-white transition-all">
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Color / Markings</label>
                  <input name="color" value={form.color} onChange={set} className={inputClass} placeholder="e.g. Golden Brown with white patches" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description <span className="text-[#008737]">*</span></label>
                  <textarea name="description" value={form.description} onChange={set} required rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell potential adopters about your dog's personality, daily routine, favourite activities, and what makes them special..." />
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                    <Info className="h-3 w-3" /> A detailed description greatly increases adoption chances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Health ────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <SectionHeader number="2" title="Health & Medical" subtitle="Vaccination, neutering, and microchip status" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ToggleCard name="vaccinated"   checked={form.vaccinated}   onChange={set} label="Vaccinated"        description="Up to date on vaccines" />
                <ToggleCard name="neutered"     checked={form.neutered}     onChange={set} label="Neutered / Spayed" description="Sterilisation confirmed" />
                <ToggleCard name="microchipped" checked={form.microchipped} onChange={set} label="Microchipped"      description="Registered microchip" />
              </div>
            </div>
          </div>

          {/* ── Section 3: Personality ───────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6">
              <SectionHeader number="3" title="Personality & Compatibility" subtitle="Help adopters understand what your dog is like" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                <ToggleCard name="goodWithKids" checked={form.goodWithKids} onChange={set} label="Good with Kids" description="Child-friendly temperament" />
                <ToggleCard name="goodWithDogs" checked={form.goodWithDogs} onChange={set} label="Good with Dogs" description="Sociable with other dogs" />
                <ToggleCard name="goodWithCats" checked={form.goodWithCats} onChange={set} label="Good with Cats" description="Comfortable around cats" />
              </div>

              <div>
                <label className={labelClass}>Activity Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['low',    'Prefers calm, relaxed days'],
                    ['medium', 'Moderate walks & playtime'],
                    ['high',   'Very energetic, loves exercise'],
                  ].map(([val, label, desc]) => (
                    <label key={val}
                      className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        form.activityLevel === val
                          ? 'border-[#008737] bg-gradient-to-br from-[#008737]/5 to-[#085558]/5 shadow-sm'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                      }`}>
                      <input type="radio" name="activityLevel" value={val} checked={form.activityLevel === val} onChange={set} className="hidden" />
                      <span className="font-bold text-sm text-[#063630]">{label}</span>
                      <span className="text-xs text-gray-400 mt-1 leading-snug">{desc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Rehoming Details ──────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6">
              <SectionHeader number="4" title="Rehoming Details" subtitle="Urgency, fee, and reason for rehoming" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Urgency</label>
                  <select name="urgency" value={form.urgency} onChange={set} className={inputClass}>
                    <option value="low">Low — Flexible timeline</option>
                    <option value="medium">Medium — Within a month</option>
                    <option value="high">High — Within a week</option>
                    <option value="emergency">Emergency — Immediately</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Rehoming Fee (NPR)</label>
                  <input name="rehomingFee" type="number" min="0" value={form.rehomingFee} onChange={set}
                    className={inputClass} placeholder="0 for free" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Reason for Rehoming</label>
                  <textarea name="reason" value={form.reason} onChange={set} rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Please briefly explain why you need to find a new home for your dog. Being transparent helps us find the best match..." />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 5: Location & Photo ──────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6">
              <SectionHeader number="5" title="Location & Photo" subtitle="Where is the dog located and a photo for the listing" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>City</label>
                  <input name="location.city" value={form['location.city']} onChange={set}
                    className={inputClass} placeholder="e.g. Kathmandu" />
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input name="location.state" value={form['location.state']} onChange={set}
                    className={inputClass} placeholder="e.g. Bagmati" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Dog's Photo</label>
                  {!form.imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-white hover:border-[#008737] transition-all duration-200 group">
                      <input type="file" accept="image/*" onChange={set} className="hidden" />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#085558]/10 to-[#008737]/10 rounded-2xl flex items-center justify-center group-hover:from-[#085558]/20 group-hover:to-[#008737]/20 transition-all">
                          <ImagePlus className="h-7 w-7 text-[#085558]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[#063630]">Click to upload a photo</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP — max 10MB</p>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                      <img src={form.imagePreview} alt="Preview"
                        className="h-56 w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-white" />
                          <span className="text-xs text-white font-medium">{form.imageFile?.name}</span>
                        </div>
                        <button type="button" onClick={clearImage}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs font-medium rounded-lg transition-all">
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={() => navigate(-1)}
                className="px-8 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 max-w-xs py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#008737]/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2.5 text-sm"
                style={{ color: '#ffffff' }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting your listing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" style={{ color: '#ffffff' }} />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" />
              Your listing will be reviewed by our admin team before going live to adopters.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ListDogPage;