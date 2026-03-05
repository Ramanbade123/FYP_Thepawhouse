import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  PawPrint, CheckCircle, ArrowLeft,
  Shield, Upload, Info, ImagePlus, X, RefreshCw
} from 'lucide-react';

const API = 'http://localhost:5000/api';

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

const ToggleCard = ({ name, checked, onChange, label, description }) => (
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
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  </label>
);

const EditDogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dog, setDog]       = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [form, setForm]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [done, setDone]     = useState(false);

  // Fetch dog data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res  = await fetch(`${API}/pets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Dog not found');
        const d = data.data;
        setDog(d);
        setForm({
          name:             d.name            || '',
          breed:            d.breed           || '',
          gender:           d.gender          || '',
          color:            d.color           || '',
          'age.value':      d.age?.value      || '',
          'age.unit':       d.age?.unit       || 'years',
          size:             d.size            || 'medium',
          description:      d.description     || '',
          vaccinated:       d.vaccinated      || false,
          neutered:         d.neutered        || false,
          microchipped:     d.microchipped    || false,
          goodWithKids:     d.goodWithKids    || false,
          goodWithDogs:     d.goodWithDogs    || false,
          goodWithCats:     d.goodWithCats    || false,
          activityLevel:    d.activityLevel   || 'medium',
          reason:           d.reason          || '',
          rehomingFee:      d.rehomingFee     || 0,
          urgency:          d.urgency         || 'medium',
          'location.city':  d.location?.city  || '',
          'location.state': d.location?.state || '',
          imageFile:        null,
          imagePreview:     d.primaryImage    || '',
          primaryImage:     d.primaryImage    || '',
        });
      } catch (err) { setFetchError(err.message); }
      finally { setFetching(false); }
    };
    load();
  }, [id]);

  const set = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setForm(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const clearImage = () => {
    if (form.imageFile) URL.revokeObjectURL(form.imagePreview);
    setForm(prev => ({ ...prev, imageFile: null, imagePreview: '' }));
  };

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let body, headers = { Authorization: `Bearer ${token}` };

      if (form.imageFile) {
        const fd = new FormData();
        fd.append('name',            form.name);
        fd.append('breed',           form.breed);
        fd.append('gender',          form.gender);
        fd.append('color',           form.color);
        fd.append('age[value]',      Number(form['age.value']));
        fd.append('age[unit]',       form['age.unit']);
        fd.append('size',            form.size);
        fd.append('description',     form.description);
        fd.append('vaccinated',      form.vaccinated);
        fd.append('neutered',        form.neutered);
        fd.append('microchipped',    form.microchipped);
        fd.append('goodWithKids',    form.goodWithKids);
        fd.append('goodWithDogs',    form.goodWithDogs);
        fd.append('goodWithCats',    form.goodWithCats);
        fd.append('activityLevel',   form.activityLevel);
        fd.append('reason',          form.reason);
        fd.append('rehomingFee',     Number(form.rehomingFee));
        fd.append('urgency',         form.urgency);
        fd.append('location[city]',  form['location.city']);
        fd.append('location[state]', form['location.state']);
        fd.append('primaryImage',    form.imageFile);
        body = fd;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          name: form.name, breed: form.breed, gender: form.gender, color: form.color,
          age: { value: Number(form['age.value']), unit: form['age.unit'] },
          size: form.size, description: form.description,
          vaccinated: form.vaccinated, neutered: form.neutered, microchipped: form.microchipped,
          goodWithKids: form.goodWithKids, goodWithDogs: form.goodWithDogs, goodWithCats: form.goodWithCats,
          activityLevel: form.activityLevel, reason: form.reason,
          rehomingFee: Number(form.rehomingFee), urgency: form.urgency,
          location: { city: form['location.city'], state: form['location.state'] },
          primaryImage: form.primaryImage,
        });
      }

      const res  = await fetch(`${API}/pets/${id}`, { method: 'PUT', headers, body });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      setDone(true);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // Loading state
  if (fetching) return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-gray-100 flex items-center justify-center">
      <RefreshCw className="h-8 w-8 text-[#085558] animate-spin" />
    </div>
  );

  if (fetchError) return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{fetchError}</p>
        <button onClick={() => navigate('/rehomer/dashboard')} className="text-[#085558] font-semibold hover:underline">Back to Dashboard</button>
      </div>
    </div>
  );

  // Success state
  if (done) return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full border border-gray-100">
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full opacity-10 animate-ping" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="h-11 w-11 text-white" />
          </div>
        </div>
        <div className="inline-block px-3 py-1 bg-[#008737]/10 text-[#085558] text-xs font-bold uppercase tracking-widest rounded-full mb-4">Update Received</div>
        <h2 className="text-2xl font-bold text-[#063630] mb-3">Listing Updated!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">Your changes have been submitted for admin review and will go live once approved.</p>
        <button onClick={() => navigate('/rehomer/dashboard')}
          className="w-full py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          style={{ color: '#ffffff' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-gray-100 relative overflow-x-hidden">

      {/* Watermark */}
      <div aria-hidden="true" className="pointer-events-none select-none fixed inset-0 z-0 flex items-center justify-end overflow-hidden">
        <img src="https://www.transparentpng.com/thumb/dog/sitting-dog-clipart-transparent-background-6.png" alt=""
          style={{ width: '680px', maxWidth: 'none', opacity: 0.045, filter: 'grayscale(100%)', transform: 'translateX(10%)' }} />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 max-w-5xl flex items-center justify-between">
          <button onClick={() => navigate('/rehomer/dashboard')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-xl flex items-center justify-center shadow-md">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#063630] leading-tight">The Paw House</h1>
          </button>
          <button onClick={() => navigate('/rehomer/dashboard')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#085558] font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-4xl relative z-10">

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm flex items-center gap-3">
              <Info className="h-4 w-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-8 py-6">
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
                    className={`${inputClass} resize-none`} placeholder="Tell potential adopters about your dog..." />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-8 py-6">
              <SectionHeader number="2" title="Health & Medical" subtitle="Vaccination, neutering, and microchip status" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ToggleCard name="vaccinated"   checked={form.vaccinated}   onChange={set} label="Vaccinated"        description="Up to date on vaccines" />
                <ToggleCard name="neutered"     checked={form.neutered}     onChange={set} label="Neutered / Spayed" description="Sterilisation confirmed" />
                <ToggleCard name="microchipped" checked={form.microchipped} onChange={set} label="Microchipped"      description="Registered microchip" />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
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
                    ['low',    'Low',    'Prefers calm, relaxed days'],
                    ['medium', 'Medium', 'Moderate walks & playtime'],
                    ['high',   'High',   'Very energetic, loves exercise'],
                  ].map(([val, label, desc]) => (
                    <label key={val} className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
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

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
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
                  <input name="rehomingFee" type="number" min="0" value={form.rehomingFee} onChange={set} className={inputClass} placeholder="0 for free" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Reason for Rehoming</label>
                  <textarea name="reason" value={form.reason} onChange={set} rows={3}
                    className={`${inputClass} resize-none`} placeholder="Please briefly explain why you need to find a new home for your dog..." />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-8 py-6">
              <SectionHeader number="5" title="Location & Photo" subtitle="Where is the dog located and a photo for the listing" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>City</label>
                  <input name="location.city" value={form['location.city']} onChange={set} className={inputClass} placeholder="e.g. Kathmandu" />
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input name="location.state" value={form['location.state']} onChange={set} className={inputClass} placeholder="e.g. Bagmati" />
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
                      <img src={form.imagePreview} alt="Preview" crossOrigin="anonymous" className="h-56 w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-white" />
                          <span className="text-xs text-white font-medium">{form.imageFile?.name || 'Current photo'}</span>
                        </div>
                        <button type="button" onClick={clearImage}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs font-medium rounded-lg transition-all">
                          <X className="h-3 w-3" /> Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={() => navigate('/rehomer/dashboard')}
                className="px-8 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 max-w-xs py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#008737]/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2.5 text-sm"
                style={{ color: '#ffffff' }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving changes...</>
                  : <><Upload className="h-4 w-4" style={{ color: '#ffffff' }} />Save Changes</>
                }
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" />
              Your updated listing will be reviewed by our admin team before going live.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDogPage;