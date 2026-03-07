import { useState, useRef } from 'react';
import { User, Lock, Bell, Shield, Save, Eye, EyeOff, CheckCircle, Camera, X, Mail, Phone, MapPin } from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');

const imgSrc = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  const base = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const bust  = updatedAt ? new Date(updatedAt).getTime() : '';
  return bust ? `${base}?t=${bust}` : base;
};

const AdopterSettingsTab = ({ user, onProfileUpdate }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved]                 = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(imgSrc(user?.profileImage, user?.updatedAt));
  const [avatarFile, setAvatarFile]       = useState(null);
  const [uploading, setUploading]         = useState(false);
  const fileInputRef = useRef();

  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city:  user?.address?.city  || '',
    state: user?.address?.state || '',
    bio:   user?.bio   || '',
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const [notifications, setNotifications] = useState({
    newApplication: true, applicationUpdate: true,
    messages: true, adminApproval: true, weeklyDigest: false,
  });

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

  const saveProfile = async () => {
    setUploading(true);
    try {
      const token    = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name',  profile.name);
      formData.append('phone', profile.phone);
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
        const newUpdatedAt    = data.data?.updatedAt    || new Date().toISOString();
        const updated = { ...stored, name: profile.name, phone: profile.phone, profileImage: newProfileImage, updatedAt: newUpdatedAt };
        localStorage.setItem('user', JSON.stringify(updated));
        setAvatarFile(null);
        setAvatarPreview(imgSrc(newProfileImage, newUpdatedAt));
        if (onProfileUpdate) onProfileUpdate(updated);
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { id: 'profile',       label: 'Profile',       icon: User   },
    { id: 'password',      label: 'Password',      icon: Lock   },
    { id: 'notifications', label: 'Notifications', icon: Bell   },
    { id: 'privacy',       label: 'Privacy',       icon: Shield },
  ];

  const initials = profile.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#063630]">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences.</p>
      </div>

      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-[#063630] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Saved successfully
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {sections.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors text-left border-b border-gray-50 last:border-0 ${
                  activeSection === id
                    ? 'bg-[#085558]/5 text-[#085558] border-l-2 border-l-[#085558]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          {/* ── PROFILE ── */}
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#085558] to-[#008737] flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-md">
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
                  <p className="font-semibold text-gray-800">{profile.name || 'Your Name'}</p>
                  <p className="text-xs text-gray-400 capitalize mb-2">Adopter account</p>
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

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name',  placeholder: 'Your name'        },
                  { label: 'Email',     key: 'email', placeholder: 'your@email.com', type: 'email' },
                  { label: 'Phone',     key: 'phone', placeholder: '+977 98XXXXXXXX'  },
                  { label: 'City',      key: 'city',  placeholder: 'Kathmandu'        },
                  { label: 'State',     key: 'state', placeholder: 'Bagmati'          },
                ].map(({ label, key, placeholder, type = 'text' }) => (
                  <div key={key} className={key === 'email' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] text-sm" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3} placeholder="Tell us a little about yourself..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] text-sm resize-none" />
                </div>
              </div>

              <button onClick={saveProfile} disabled={uploading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md transition-shadow disabled:opacity-60"
                style={{ color: '#ffffff' }}>
                <Save className="h-4 w-4" style={{ color: '#ffffff' }} />
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* ── PASSWORD ── */}
          {activeSection === 'password' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Change Password</h3>
              {[
                { label: 'Current Password',    key: 'current' },
                { label: 'New Password',         key: 'newPass' },
                { label: 'Confirm New Password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={passwords[key]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] text-sm pr-10"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                <p className="text-red-500 text-xs">Passwords do not match</p>
              )}
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                disabled={!passwords.current || !passwords.newPass || passwords.newPass !== passwords.confirm}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md disabled:opacity-50"
                style={{ color: '#ffffff' }}>
                <Lock className="h-4 w-4" style={{ color: '#ffffff' }} /> Update Password
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'newApplication',    label: 'Application Updates',  desc: 'Status changes on your adoption applications' },
                  { key: 'applicationUpdate', label: 'New Matches',           desc: 'When a dog matching your preferences is listed' },
                  { key: 'messages',          label: 'New Messages',          desc: 'When you receive a new message'               },
                  { key: 'adminApproval',     label: 'Admin Approvals',       desc: 'Decisions made on your applications'          },
                  { key: 'weeklyDigest',      label: 'Weekly Digest',         desc: 'A weekly summary of available dogs'           },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications[key]}
                        onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))}
                        className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008737]" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRIVACY ── */}
          {activeSection === 'privacy' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Privacy & Security</h3>
              <div className="space-y-4">
                {[
                  { label: 'Show phone number to rehomers', desc: 'Rehomers can see your contact number' },
                  { label: 'Show email to rehomers',        desc: 'Rehomers can see your email address' },
                  { label: 'Allow direct messages',         desc: 'Rehomers can message you directly'   },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008737]" />
                    </label>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-semibold text-red-600 mb-3">Danger Zone</h4>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50">
                  Deactivate Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdopterSettingsTab;