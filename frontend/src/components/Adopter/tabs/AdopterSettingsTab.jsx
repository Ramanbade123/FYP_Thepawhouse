import { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, X } from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc   = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  const base = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const bust  = updatedAt ? new Date(updatedAt).getTime() : '';
  return bust ? `${base}?t=${bust}` : base;
};

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/10 transition-all";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";

const AdopterSettingsTab = ({ user, onProfileUpdate }) => {
  const [form, setForm]           = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.address?.city || '', state: user?.address?.state || '' });
  const [saved, setSaved]         = useState(false);
  const [loading, setLoading]     = useState(false);
  const [avatarFile, setAvatarFile]     = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(imgSrc(user?.profileImage, user?.updatedAt));
  const fileInputRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token    = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name',  form.name);
      formData.append('phone', form.phone);
      if (avatarFile) formData.append('profileImage', avatarFile);

      const res  = await fetch(`${API}/users/profile`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });
      const data = await res.json();
      if (data.success) {
        const stored  = JSON.parse(localStorage.getItem('user') || '{}');
        const newProfileImage = data.data?.profileImage || stored.profileImage;
        const updated = { ...stored, name: form.name, phone: form.phone, profileImage: newProfileImage, updatedAt: data.data?.updatedAt || new Date().toISOString() };
        localStorage.setItem('user', JSON.stringify(updated));
        setAvatarFile(null);
        setAvatarPreview(imgSrc(newProfileImage, updated.updatedAt));
        if (onProfileUpdate) onProfileUpdate(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const initials = form.name?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#063630]">Account Settings</h2>
        <p className="text-gray-500 mt-1">Update your profile information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
          {/* Avatar with upload */}
          <div className="relative group flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-4 ring-white shadow-md">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                : <span>{initials}</span>}
            </div>
            <button onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h3 className="font-bold text-[#063630] text-lg">{form.name || user?.name}</h3>
            <p className="text-gray-500 text-sm flex items-center gap-1 mb-2"><Mail className="h-3.5 w-3.5" />{user?.email}</p>
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#085558] text-[#085558] rounded-lg text-xs font-medium hover:bg-[#085558]/5 transition-colors">
                <Camera className="h-3.5 w-3.5" /> Upload Photo
              </button>
              {avatarPreview && (
                <button onClick={removeAvatar}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP — max 5MB</p>
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