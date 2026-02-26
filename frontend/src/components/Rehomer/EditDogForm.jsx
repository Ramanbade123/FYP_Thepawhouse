import { useState } from 'react';
import { X, PawPrint, CheckCircle, Check, AlertTriangle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ToggleCard = ({ name, checked, onChange, emoji, label }) => (
  <label className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
    checked ? 'border-[#085558] bg-[#085558]/5 shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  }`}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
    {checked && <div className="absolute top-2 right-2 w-5 h-5 bg-[#008737] rounded-full flex items-center justify-center"><Check className="h-3 w-3 text-white" strokeWidth={3}/></div>}
    <span className="text-xl">{emoji}</span>
    <span className={`text-xs font-semibold text-center ${checked ? 'text-[#063630]' : 'text-gray-500'}`}>{label}</span>
  </label>
);

const RadioCard = ({ name, value, current, onChange, emoji, label, desc }) => (
  <label className={`relative flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
    current === value ? 'border-[#085558] bg-[#085558]/5 shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  }`}>
    <input type="radio" name={name} value={value} checked={current === value} onChange={onChange} className="hidden" />
    {current === value && <div className="absolute top-2 right-2 w-5 h-5 bg-[#008737] rounded-full flex items-center justify-center"><Check className="h-3 w-3 text-white" strokeWidth={3}/></div>}
    {emoji && <span className="text-xl">{emoji}</span>}
    <span className={`text-xs font-bold text-center ${current === value ? 'text-[#063630]' : 'text-gray-600'}`}>{label}</span>
    {desc && <span className="text-[10px] text-gray-400 text-center leading-tight">{desc}</span>}
  </label>
);

const SectionHead = ({ number, title }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#085558] to-[#008737] flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs font-bold">{number}</span>
    </div>
    <h3 className="font-bold text-[#063630] text-base">{title}</h3>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const inp = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#085558] focus:bg-white focus:ring-2 focus:ring-[#085558]/10 transition-all";
const lbl = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

const EditDogForm = ({ dog, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name:             dog.name           || '',
    breed:            dog.breed          || '',
    gender:           dog.gender         || '',
    color:            dog.color          || '',
    'age.value':      dog.age?.value     || '',
    'age.unit':       dog.age?.unit      || 'years',
    size:             dog.size           || 'medium',
    description:      dog.description    || '',
    vaccinated:       dog.vaccinated     || false,
    neutered:         dog.neutered       || false,
    microchipped:     dog.microchipped   || false,
    goodWithKids:     dog.goodWithKids   || false,
    goodWithDogs:     dog.goodWithDogs   || false,
    goodWithCats:     dog.goodWithCats   || false,
    activityLevel:    dog.activityLevel  || 'medium',
    reason:           dog.reason         || '',
    rehomingFee:      dog.rehomingFee    || 0,
    urgency:          dog.urgency        || 'medium',
    'location.city':  dog.location?.city  || '',
    'location.state': dog.location?.state || '',
    primaryImage:     dog.primaryImage   || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/pets/${dog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name, breed: form.breed, gender: form.gender, color: form.color,
          age: { value: Number(form['age.value']), unit: form['age.unit'] },
          size: form.size, description: form.description,
          vaccinated: form.vaccinated, neutered: form.neutered, microchipped: form.microchipped,
          goodWithKids: form.goodWithKids, goodWithDogs: form.goodWithDogs, goodWithCats: form.goodWithCats,
          activityLevel: form.activityLevel, reason: form.reason,
          rehomingFee: Number(form.rehomingFee), urgency: form.urgency,
          location: { city: form['location.city'], state: form['location.state'] },
          primaryImage: form.primaryImage,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      setDone(true);
      setTimeout(() => { onSuccess(data.data); onClose(); }, 1500);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-sm w-full">
        <div className="w-20 h-20 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#063630] mb-2">Listing Updated!</h2>
        <p className="text-gray-500 text-sm">Your changes have been submitted for re-review.</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#063630] to-[#085558] px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Listing — {dog.name}</h2>
              <p className="text-white/60 text-xs">Changes will reset approval to pending review</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Warning banner */}
        <div className="flex items-center gap-3 px-7 py-3 bg-amber-50 border-b border-amber-100">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <p className="text-amber-700 text-xs font-medium">Saving changes will reset this listing to <strong>pending</strong> and require admin re-approval.</p>
        </div>

        <form onSubmit={submit} className="p-7 space-y-8 max-h-[72vh] overflow-y-auto">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

          {/* 1. Basic Info */}
          <section>
            <SectionHead number="1" title="hello" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>helloe *</label>
                <input name="hello" value={form.name} onChange={set} required className={inp} />
              </div>
              <div>
                <label className={lbl}>Breed *</label>
                <input name="breed" value={form.breed} onChange={set} required className={inp} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={lbl}>Gender *</label>
                <div className="grid grid-cols-2 gap-2">
                  <RadioCard name="gender" value="male"   current={form.gender} onChange={set} emoji="♂️" label="Male"   />
                  <RadioCard name="gender" value="female" current={form.gender} onChange={set} emoji="♀️" label="Female" />
                </div>
              </div>
              <div>
                <label className={lbl}>Age *</label>
                <div className="flex gap-2">
                  <input name="age.value" type="number" min="0" max="30" value={form['age.value']} onChange={set} required
                    className={inp + " text-center"} />
                  <select name="age.unit" value={form['age.unit']} onChange={set} className={inp + " cursor-pointer"}>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className={lbl}>Size</label>
              <div className="grid grid-cols-4 gap-2">
                {[['small','🐾','Small','<10kg'],['medium','🐕','Medium','10–25kg'],['large','🦮','Large','25–40kg'],['extra-large','🐘','XL','40kg+']].map(([v,e,l,d]) => (
                  <RadioCard key={v} name="size" value={v} current={form.size} onChange={set} emoji={e} label={l} desc={d} />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className={lbl}>Color / Markings</label>
              <input name="color" value={form.color} onChange={set} className={inp} />
            </div>
            <div className="mt-4">
              <label className={lbl}>About your dog *</label>
              <textarea name="description" value={form.description} onChange={set} required rows={4} className={inp + " resize-none"} />
            </div>
          </section>

          {/* 2. Health */}
          <section>
            <SectionHead number="2" title="Health & Medical" />
            <div className="grid grid-cols-3 gap-3">
              <ToggleCard name="vaccinated"   checked={form.vaccinated}   onChange={set} emoji="💉" label="Vaccinated"      />
              <ToggleCard name="neutered"     checked={form.neutered}     onChange={set} emoji="✂️" label="Neutered/Spayed" />
              <ToggleCard name="microchipped" checked={form.microchipped} onChange={set} emoji="📡" label="Microchipped"    />
            </div>
          </section>

          {/* 3. Personality */}
          <section>
            <SectionHead number="3" title="Personality & Compatibility" />
            <div className="grid grid-cols-3 gap-3 mb-4">
              <ToggleCard name="goodWithKids" checked={form.goodWithKids} onChange={set} emoji="👶" label="Good with Kids" />
              <ToggleCard name="goodWithDogs" checked={form.goodWithDogs} onChange={set} emoji="🐕" label="Good with Dogs" />
              <ToggleCard name="goodWithCats" checked={form.goodWithCats} onChange={set} emoji="🐈" label="Good with Cats" />
            </div>
            <div>
              <label className={lbl}>Activity Level</label>
              <div className="grid grid-cols-3 gap-3">
                <RadioCard name="activityLevel" value="low"    current={form.activityLevel} onChange={set} emoji="🛋️" label="Low"    desc="Calm & relaxed"    />
                <RadioCard name="activityLevel" value="medium" current={form.activityLevel} onChange={set} emoji="🚶" label="Medium" desc="Daily walks & play" />
                <RadioCard name="activityLevel" value="high"   current={form.activityLevel} onChange={set} emoji="🏃" label="High"   desc="Very energetic"     />
              </div>
            </div>
          </section>

          {/* 4. Rehoming Details */}
          <section>
            <SectionHead number="4" title="Rehoming Details" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Urgency</label>
                <div className="space-y-2">
                  {[
                    ['low','🕐','Flexible','No rush'],
                    ['medium','📅','This month','Within weeks'],
                    ['high','⚡','This week','Need it quickly'],
                    ['emergency','🚨','Emergency','Immediately'],
                  ].map(([v,e,l,d]) => (
                    <label key={v} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form.urgency === v ? 'border-[#085558] bg-[#085558]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="urgency" value={v} checked={form.urgency===v} onChange={set} className="hidden" />
                      <span className="text-lg">{e}</span>
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${form.urgency===v?'text-[#063630]':'text-gray-600'}`}>{l}</p>
                        <p className="text-[10px] text-gray-400">{d}</p>
                      </div>
                      {form.urgency===v && <div className="w-5 h-5 bg-[#008737] rounded-full flex items-center justify-center flex-shrink-0"><Check className="h-3 w-3 text-white" strokeWidth={3}/></div>}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Rehoming Fee (NPR)</label>
                  <input name="rehomingFee" type="number" min="0" value={form.rehomingFee} onChange={set} className={inp} />
                  <p className="text-[10px] text-gray-400 mt-1">Leave 0 for free adoption</p>
                </div>
                <div>
                  <label className={lbl}>Reason for Rehoming</label>
                  <textarea name="reason" value={form.reason} onChange={set} rows={6} className={inp + " resize-none"} />
                </div>
              </div>
            </div>
          </section>

          {/* 5. Location & Photo */}
          <section>
            <SectionHead number="5" title="Location & Photo" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={lbl}>City</label>
                <input name="location.city" value={form['location.city']} onChange={set} className={inp} />
              </div>
              <div>
                <label className={lbl}>Province</label>
                <input name="location.state" value={form['location.state']} onChange={set} className={inp} />
              </div>
            </div>
            <div>
              <label className={lbl}>Photo URL</label>
              <input name="primaryImage" value={form.primaryImage} onChange={set} className={inp}
                placeholder="https://i.imgur.com/yourdog.jpg" />
              {form.primaryImage && (
                <img src={form.primaryImage} alt="preview"
                  className="mt-3 h-40 w-full object-cover rounded-2xl border border-gray-100"
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] py-3.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-2xl font-bold text-sm hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ color: '#ffffff' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving changes...</>
                : <><PawPrint className="h-4 w-4" style={{color:'#ffffff'}}/>Save Changes</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDogForm;