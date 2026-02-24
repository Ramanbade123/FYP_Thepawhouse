import { useState } from 'react';
import { X, Dog, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditDogForm = ({ dog, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name:           dog.name        || '',
    breed:          dog.breed       || '',
    gender:         dog.gender      || '',
    color:          dog.color       || '',
    'age.value':    dog.age?.value  || '',
    'age.unit':     dog.age?.unit   || 'years',
    size:           dog.size        || 'medium',
    description:    dog.description || '',
    vaccinated:     dog.vaccinated  || false,
    neutered:       dog.neutered    || false,
    microchipped:   dog.microchipped || false,
    goodWithKids:   dog.goodWithKids || false,
    goodWithDogs:   dog.goodWithDogs || false,
    goodWithCats:   dog.goodWithCats || false,
    activityLevel:  dog.activityLevel || 'medium',
    reason:         dog.reason      || '',
    rehomingFee:    dog.rehomingFee || 0,
    urgency:        dog.urgency     || 'medium',
    'location.city':  dog.location?.city  || '',
    'location.state': dog.location?.state || '',
    primaryImage:   dog.primaryImage || '',
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
    const payload = {
      name:         form.name,
      breed:        form.breed,
      gender:       form.gender,
      color:        form.color,
      age:          { value: Number(form['age.value']), unit: form['age.unit'] },
      size:         form.size,
      description:  form.description,
      vaccinated:   form.vaccinated,
      neutered:     form.neutered,
      microchipped: form.microchipped,
      goodWithKids: form.goodWithKids,
      goodWithDogs: form.goodWithDogs,
      goodWithCats: form.goodWithCats,
      activityLevel: form.activityLevel,
      reason:       form.reason,
      rehomingFee:  Number(form.rehomingFee),
      urgency:      form.urgency,
      location:     { city: form['location.city'], state: form['location.state'] },
      primaryImage: form.primaryImage,
    };

    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/pets/${dog._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      setDone(true);
      setTimeout(() => { onSuccess(data.data); onClose(); }, 1500);
    } catch (err) { setError(err.message); }
    finally      { setLoading(false); }
  };

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
          <CheckCircle className="h-16 w-16 text-[#008737] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#063630] mb-2">Listing Updated!</h2>
          <p className="text-gray-500 text-sm">Your listing has been submitted for re-review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-xl flex items-center justify-center">
              <Dog className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#063630]">Edit Listing — {dog.name}</h2>
              <p className="text-sm text-amber-600">⚠ Editing will reset admin approval to pending</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-500" /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {/* Basic Info */}
          <section>
            <h3 className="font-bold text-[#063630] mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dog's Name *</label>
                <input name="name" value={form.name} onChange={set} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                <input name="breed" value={form.breed} onChange={set} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select name="gender" value={form.gender} onChange={set} required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select name="size" value={form.size} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <div className="flex gap-2">
                  <input name="age.value" type="number" min="0" max="30" value={form['age.value']} onChange={set} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
                  <select name="age.unit" value={form['age.unit']} onChange={set}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]">
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input name="color" value={form.color} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={set} required rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737] resize-none" />
            </div>
          </section>

          {/* Health */}
          <section>
            <h3 className="font-bold text-[#063630] mb-4 pb-2 border-b border-gray-100">Health & Care</h3>
            <div className="grid grid-cols-3 gap-4">
              {[['vaccinated','Vaccinated'],['neutered','Neutered/Spayed'],['microchipped','Microchipped']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#008737]">
                  <input type="checkbox" name={key} checked={form[key]} onChange={set} className="accent-[#008737]" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Personality */}
          <section>
            <h3 className="font-bold text-[#063630] mb-4 pb-2 border-b border-gray-100">Personality</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[['goodWithKids','Good with Kids'],['goodWithDogs','Good with Dogs'],['goodWithCats','Good with Cats']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#008737]">
                  <input type="checkbox" name={key} checked={form[key]} onChange={set} className="accent-[#008737]" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
              <select name="activityLevel" value={form.activityLevel} onChange={set}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </section>

          {/* Rehoming */}
          <section>
            <h3 className="font-bold text-[#063630] mb-4 pb-2 border-b border-gray-100">Rehoming Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                <select name="urgency" value={form.urgency} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rehoming Fee (NPR)</label>
                <input name="rehomingFee" type="number" min="0" value={form.rehomingFee} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rehoming</label>
                <textarea name="reason" value={form.reason} onChange={set} rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737] resize-none" />
              </div>
            </div>
          </section>

          {/* Location & Photo */}
          <section>
            <h3 className="font-bold text-[#063630] mb-4 pb-2 border-b border-gray-100">Location & Photo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="location.city" value={form['location.city']} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input name="location.state" value={form['location.state']} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input name="primaryImage" value={form.primaryImage} onChange={set}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008737]" />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
              style={{ color: '#ffffff' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDogForm;