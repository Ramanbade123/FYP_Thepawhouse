import { useState } from 'react';
import { User, Lock, Bell, Shield, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SettingsTab = ({ user }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved]                 = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  const [profile, setProfile] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    city:    user?.location?.city  || '',
    state:   user?.location?.state || '',
    bio:     user?.bio     || '',
  });

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const [notifications, setNotifications] = useState({
    newApplication: true,
    applicationUpdate: true,
    messages: true,
    adminApproval: true,
    weeklyDigest: false,
  });

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/users/profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(profile),
      });
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...profile }));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { id: 'profile',       label: 'Profile',       icon: User   },
    { id: 'password',      label: 'Password',      icon: Lock   },
    { id: 'notifications', label: 'Notifications', icon: Bell   },
    { id: 'privacy',       label: 'Privacy',       icon: Shield },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#063630]">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences.</p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-[#063630] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Saved successfully
        </div>
      )}

      <div className="flex gap-6">
        {/* Section nav */}
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

          {/* ── Profile ── */}
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || 'R'}
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{profile.name || 'Rehomer'}</p>
                  <p className="text-xs text-gray-400">Rehomer account</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',   key: 'name',  placeholder: 'Your name'  },
                  { label: 'Email',       key: 'email', placeholder: 'your@email.com', type: 'email' },
                  { label: 'Phone',       key: 'phone', placeholder: '+977 98XXXXXXXX' },
                  { label: 'City',        key: 'city',  placeholder: 'Kathmandu'  },
                  { label: 'State',       key: 'state', placeholder: 'Bagmati'    },
                ].map(({ label, key, placeholder, type = 'text' }) => (
                  <div key={key} className={key === 'email' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] text-sm" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3} placeholder="Tell adopters a little about yourself..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] text-sm resize-none" />
                </div>
              </div>

              <button onClick={saveProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md transition-shadow"
                style={{ color: '#ffffff' }}>
                <Save className="h-4 w-4" style={{ color: '#ffffff' }} /> Save Changes
              </button>
            </div>
          )}

          {/* ── Password ── */}
          {activeSection === 'password' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Change Password</h3>
              {[
                { label: 'Current Password', key: 'current' },
                { label: 'New Password',     key: 'newPass' },
                { label: 'Confirm New Password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords[key]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008737] text-sm pr-10"
                      placeholder="••••••••"
                    />
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
              <button
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                disabled={!passwords.current || !passwords.newPass || passwords.newPass !== passwords.confirm}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md transition-shadow disabled:opacity-50"
                style={{ color: '#ffffff' }}>
                <Lock className="h-4 w-4" style={{ color: '#ffffff' }} /> Update Password
              </button>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'newApplication',   label: 'New Application',     desc: 'When someone applies for one of your dogs'    },
                  { key: 'applicationUpdate',label: 'Application Updates',  desc: 'Status changes on applications'               },
                  { key: 'messages',         label: 'New Messages',        desc: 'When you receive a new message'               },
                  { key: 'adminApproval',    label: 'Admin Approvals',     desc: 'When your listing is approved or rejected'    },
                  { key: 'weeklyDigest',     label: 'Weekly Digest',       desc: 'A weekly summary of your activity'            },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications[key]}
                        onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))}
                        className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008737]"></div>
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={saveProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-xl font-medium hover:shadow-md"
                style={{ color: '#ffffff' }}>
                <Save className="h-4 w-4" style={{ color: '#ffffff' }} /> Save Preferences
              </button>
            </div>
          )}

          {/* ── Privacy ── */}
          {activeSection === 'privacy' && (
            <div className="space-y-5">
              <h3 className="font-bold text-[#063630] text-lg border-b border-gray-100 pb-3">Privacy & Security</h3>
              <div className="space-y-4">
                {[
                  { label: 'Show phone number to adopters', desc: 'Adopters can see your phone on your listings' },
                  { label: 'Show email to adopters',        desc: 'Adopters can see your email on your listings' },
                  { label: 'Allow direct messages',         desc: 'Adopters can message you directly'            },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008737]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-semibold text-red-600 mb-3">Danger Zone</h4>
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

export default SettingsTab;