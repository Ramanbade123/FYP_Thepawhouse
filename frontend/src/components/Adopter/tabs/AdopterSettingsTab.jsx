import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/10 transition-all";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";

const AdopterSettingsTab = ({ user }) => {
  const [form, setForm]     = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.address?.city || '', state: user?.address?.state || '' });
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/updatedetails`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ name: form.name, phone: form.phone, address: { city: form.city, state: form.state } }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#063630]">Account Settings</h2>
        <p className="text-gray-500 mt-1">Update your profile information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <h3 className="font-bold text-[#063630] text-lg">{user?.name}</h3>
            <p className="text-gray-500 text-sm flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input className={`${inputClass} pl-10`} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input className={`${inputClass} pl-10`} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input className={`${inputClass} pl-10`} value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="e.g. Kathmandu" />
              </div>
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input className={inputClass} value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} placeholder="e.g. Bagmati" />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60"
              style={{ color: '#ffffff' }}>
              <Save className="h-4 w-4" style={{ color: '#ffffff' }} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">✓ Saved successfully</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdopterSettingsTab;
