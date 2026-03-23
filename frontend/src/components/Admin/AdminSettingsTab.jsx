import { useState, useRef } from 'react';
import {
  User, Lock, Bell, Shield, Save, Eye, EyeOff,
  CheckCircle, Camera, X, AlertTriangle
} from 'lucide-react';

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');

const imgSrc = (url, updatedAt) => {
  if (!url || url === 'default-profile.jpg') return null;
  let fullUrl = url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
    fullUrl = `/uploads/users/${url}`;
  }
  const base = fullUrl.startsWith('http') ? fullUrl : `${BASE_URL}${fullUrl}`;
  const bust = updatedAt ? new Date(updatedAt).getTime() : '';
  return bust ? `${base}?t=${bust}` : base;
};

const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/10 text-sm text-[#063630] transition-all";

const AdminSettingsTab = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [activeSection, setActiveSection] = useState('profile');
  const [toast, setToast]                 = useState(null); // { type: 'success'|'error', msg }
  const [showPassword, setShowPassword]   = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [pwLoading, setPwLoading]         = useState(false);
  const fileInputRef = useRef();

  const [avatarPreview, setAvatarPreview] = useState(imgSrc(storedUser?.profileImage, storedUser?.updatedAt));
  const [avatarFile, setAvatarFile]       = useState(null);

  const [profile, setProfile] = useState({
    name:  storedUser?.name  || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    city:  storedUser?.address?.city  || '',
    state: storedUser?.address?.state || '',
    bio:   storedUser?.bio   || '',
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const [notifications, setNotifications] = useState({
    newUser:       true,
    newPet:        true,
    newReport:     true,
    messages:      true,
    systemAlerts:  true,
    weeklyDigest:  false,
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    twoFactor: false,
  });

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

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
      formData.append('name',    profile.name);
      formData.append('phone',   profile.phone);
      formData.append('address', JSON.stringify({ city: profile.city, state: profile.state }));
      if (profile.bio) formData.append('bio', profile.bio);
      if (avatarFile)  formData.append('profileImage', avatarFile);

      const res  = await fetch(`${API}/users/profile`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });
      const data = await res.json();

      if (data.success) {
        const updated = {
          ...storedUser,
          name:         profile.name,
          phone:        profile.phone,
          address:      { city: profile.city, state: profile.state },
          bio:          profile.bio,
          profileImage: data.data?.profileImage || storedUser.profileImage,
          updatedAt:    data.data?.updatedAt    || new Date().toISOString(),
        };
        localStorage.setItem('user', JSON.stringify(updated));
        setAvatarFile(null);
        setAvatarPreview(imgSrc(updated.profileImage, updated.updatedAt));
        showToast('success', 'Profile saved successfully');
      } else {
        showToast('error', data.error || 'Failed to save profile');
      }
    } catch (err) {
      showToast('error', 'Server error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async () => {
    if (passwords.newPass !== passwords.confirm) return;
    setPwLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/users/updatepassword`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswords({ current: '', newPass: '', confirm: '' });
        showToast('success', 'Password updated successfully');
      } else {
        showToast('error', data.error || 'Failed to update password');
      }
    } catch {
      showToast('error', 'Server error. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  const sections = [
    { id: 'profile',       label: 'Profile',       icon: User   },
    { id: 'password',      label: 'Password',      icon: Lock   },
    { id: 'notifications', label: 'Notifications', icon: Bell   },
    { id: 'privacy',       label: 'Privacy',       icon: Shield },
  ];

  const initials = profile.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A';

  return (
    <div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-[#063630] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex gap-6">

        {/* Sidebar nav */}
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

        {/* Content panel */}
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
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#008737] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#085558] transition-colors">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <div>
                  <p className="font-semibold text-[#063630]">{profile.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400 mb-2">Admin account</p>
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

              {/* Fields */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name',  placeholder: 'Admin name'       },
                  { label: 'Email',     key: 'email', placeholder: 'admin@email.com', type: 'email', readOnly: true },
                  { label: 'Phone',     key: 'phone', placeholder: '+977 98XXXXXXXX'  },
                  { label: 'City',      key: 'city',  placeholder: 'Kathmandu'        },
                  { label: 'State',     key: 'state', placeholder: 'Bagmati'          },
                ].map(({ label, key, placeholder, type = 'text', readOnly }) => (
                  <div key={key} className={key === 'email' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={profile[key]}
                      readOnly={readOnly}
                      onChange={e => !readOnly && setProfile(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className={`${inputClass} ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3} placeholder="A short note about this admin account..."
                    className={`${inputClass} resize-none`} />
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
                      placeholder="••••••••"
                      className={inputClass + ' pr-10'} />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Passwords do not match
                </p>
              )}
              {passwords.newPass && passwords.newPass.length < 6 && (
                <p className="text-amber-500 text-xs">Password must be at least 6 characters</p>
              )}
              <button onClick={changePassword} disabled={
                pwLoading || !passwords.current || !passwords.newPass ||
                passwords.newPass !== passwords.confirm || passwords.newPass.length < 6
              }
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md disabled:opacity-50"
                style={{ color: '#ffffff' }}>
                <Lock className="h-4 w-4" style={{ color: '#ffffff' }} />
                {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'newUser',      label: 'New User Registrations', desc: 'When a new user registers on the platform'        },
                  { key: 'newPet',       label: 'New Pet Listings',        desc: 'When a rehomer lists a new pet for adoption'      },
                  { key: 'newReport',    label: 'Abuse Reports',           desc: 'When a new abuse or misconduct report is filed'   },
                  { key: 'messages',     label: 'New Messages',            desc: 'When you receive a direct message'                },
                  { key: 'systemAlerts', label: 'System Alerts',           desc: 'Critical platform errors or security notices'     },
                  { key: 'weeklyDigest', label: 'Weekly Digest',           desc: 'A weekly summary of platform activity'            },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" checked={notifications[key]}
                        onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))}
                        className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008737]" />
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('success', 'Notification preferences saved')}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md"
                style={{ color: '#ffffff' }}>
                <Save className="h-4 w-4" style={{ color: '#ffffff' }} /> Save Preferences
              </button>
            </div>
          )}

          {/* ── PRIVACY ── */}
          {activeSection === 'privacy' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Privacy & Security</h3>
              <div className="space-y-3">
                {[
                  { key: 'showEmail', label: 'Show email to users',    desc: 'Users can see your admin email address'      },
                  { key: 'showPhone', label: 'Show phone to users',    desc: 'Users can see your admin phone number'       },
                  { key: 'twoFactor', label: 'Two-factor authentication', desc: 'Require a code in addition to your password' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" checked={privacy[key]}
                        onChange={e => setPrivacy(p => ({ ...p, [key]: e.target.checked }))}
                        className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008737]" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Danger Zone
                </h4>
                <p className="text-sm text-gray-500 mb-3">These actions are irreversible. Please be certain.</p>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
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

export default AdminSettingsTab;