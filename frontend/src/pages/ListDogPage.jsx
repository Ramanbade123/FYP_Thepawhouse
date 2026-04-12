import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Dog, PawPrint, CheckCircle, ArrowLeft,
  Heart, Shield, Upload, Info, ImagePlus, X, Plus
} from 'lucide-react';
import { NEPAL_DATA, CITY_TO_PROVINCE } from '../data/nepalData';


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
  imageFiles: [],
  imagePreviews: [],
};

// Removed local NEPAL_PROVINCES and NEPAL_CITIES in favor of central data


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

  const set = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setForm(prev => {
        const total = (prev.imageFiles?.length || 0) + newFiles.length;
        if (total > 5) {
          alert('You can only upload a maximum of 5 images.');
          return prev;
        }
        return {
          ...prev,
          imageFiles: [...(prev.imageFiles || []), ...newFiles],
          imagePreviews: [...(prev.imagePreviews || []), ...newPreviews]
        };
      });
    } else {
      setForm(prev => {
        let nextForm = { ...prev, [name]: type === 'checkbox' ? checked : value };

        if (name === 'location.state') {
          // When province changes, if current city doesn't belong to it, clear it
          if (nextForm['location.city'] && nextForm['location.city'] !== 'Other' && CITY_TO_PROVINCE[nextForm['location.city']] !== value) {
            nextForm['location.city'] = '';
          }
        } else if (name === 'location.city') {
          // When city changes, set province automatically (if not "Other")
          if (value && value !== 'Other' && CITY_TO_PROVINCE[value]) {
            nextForm['location.state'] = CITY_TO_PROVINCE[value];
          }
        }

        return nextForm;
      });
    }
  };



  const removeImage = (index) => {
    setForm(prev => {
      const newFiles = [...prev.imageFiles];
      const newPreviews = [...prev.imagePreviews];
      URL.revokeObjectURL(newPreviews[index]);
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);
      return { ...prev, imageFiles: newFiles, imagePreviews: newPreviews };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);

    const textRegex = /^[A-Za-z\s\-']+$/;
    if (!textRegex.test(form.name.trim())) {
      setError("Dog's name contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (!textRegex.test(form.breed.trim())) {
      setError("Breed contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (form.color && !textRegex.test(form.color.trim())) {
      setError("Color contains invalid characters.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (form.description.length < 10 || !/[aeiouyAEIOUY]/.test(form.description)) {
      setError("Please enter a meaningful description.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (form.reason && (form.reason.length < 5 || !/[aeiouyAEIOUY]/.test(form.reason))) {
      setError("Please enter a meaningful reason for rehoming.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }

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
      if (form.imageFiles && form.imageFiles.length > 0) {
        form.imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

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
              style={{ color: '#ffffff' }}
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
                    <input name="age.value" type="number" min="0" max="30" value={form['age.value']} onChange={set} required
                      className={`${inputClass} flex-1`} placeholder="e.g. 3" />
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
                    className={`${inputClass} resize-none`} placeholder="Tell potential adopters about your dog's temperament, habits, and what kind of home they'd thrive in..." />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Health ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <SectionHeader number="2" title="Health & Medical" subtitle="Vaccination, neutering, and health status" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ToggleCard name="vaccinated"   checked={form.vaccinated}   onChange={set} label="Vaccinated"   description="Up to date on vaccines" />
                <ToggleCard name="neutered"     checked={form.neutered}     onChange={set} label="Neutered"     description="Spayed or neutered" />
                <ToggleCard name="microchipped" checked={form.microchipped} onChange={set} label="Microchipped" description="Has a microchip" />
              </div>
            </div>
          </div>


          {/* ── Section 3: Rehoming Details ─────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <SectionHeader number="3" title="Rehoming Details" subtitle="Urgency, fees, and reason" />
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
                  <input name="rehomingFee" type="number" min="0" value={form.rehomingFee} onChange={set} className={inputClass} placeholder="0 for free" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Reason for Rehoming</label>
                  <textarea name="reason" value={form.reason} onChange={set} rows={3}
                    className={`${inputClass} resize-none`} placeholder="Briefly explain why you're rehoming your dog..." />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Location & Photos ────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6">
              <SectionHeader number="4" title="Location & Photos" subtitle="Where is the dog and what do they look like?" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className={labelClass}>State / Province <span className="text-[#008737]">*</span></label>
                  <select name="location.state" value={form['location.state']} onChange={set} required className={inputClass}>
                    <option value="">Select Province</option>
                    {Object.keys(NEPAL_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>City <span className="text-[#008737]">*</span></label>
                  <select name="location.city" value={form['location.city']} onChange={set} required className={inputClass}>
                    <option value="">Select City</option>
                    {(form['location.state'] ? NEPAL_DATA[form['location.state']] : Object.values(NEPAL_DATA).flat().filter((v, i, a) => a.indexOf(v) === i).sort()).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                  <label className={labelClass}>Dog's Photos (Max 5)</label>
                  {!form.imagePreviews || form.imagePreviews.length === 0 ? (
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-white hover:border-[#008737] transition-all duration-200 group">
                      <input type="file" multiple accept="image/*" onChange={set} className="hidden" />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#085558]/10 to-[#008737]/10 rounded-2xl flex items-center justify-center group-hover:from-[#085558]/20 group-hover:to-[#008737]/20 transition-all">
                          <ImagePlus className="h-7 w-7 text-[#085558]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[#063630]">Click to upload photos</p>
                          <p className="text-xs text-gray-400 mt-1">High quality, well-lit photos work best</p>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {form.imagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-square group">
                            <img src={preview} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={() => removeImage(idx)}
                                className="px-3 py-1.5 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm text-white text-xs font-bold rounded-lg transition-colors shadow-lg flex items-center gap-1.5">
                                <X className="h-3 w-3" /> Remove
                              </button>
                            </div>
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-[#085558] to-[#008737] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md shadow-md">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                        {form.imagePreviews.length < 5 && (
                          <label className="flex flex-col items-center justify-center h-full aspect-square border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-white hover:border-[#008737] transition-all duration-200 group">
                            <input type="file" multiple accept="image/*" onChange={set} className="hidden" />
                            <Plus className="h-6 w-6 text-[#085558] mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#063630]">Add More</span>
                          </label>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 italic px-1 flex items-center gap-1.5">
                        <Info className="h-2.5 w-2.5" /> First photo will be used as the primary listing image.
                      </p>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* ── Submit Button ───────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Shield className="h-5 w-5" />
              <p className="text-xs max-w-[240px]">Your listing will be reviewed by our team before going public.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => navigate('/rehomer/dashboard')}
                className="flex-1 md:flex-none px-8 py-3.5 border-2 border-gray-100 text-gray-500 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none px-12 py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#008737]/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2.5 text-sm"
                style={{ color: '#ffffff' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>List Dog Now</span>
                  </>
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