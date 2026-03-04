import { useState, useEffect } from 'react';
import { UserPlus, Dog, RefreshCw, Clock } from 'lucide-react';

const API = 'http://localhost:5000/api';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const [uRes, pRes] = await Promise.all([
          fetch(`${API}/users?limit=3`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/pets/admin/all?limit=3`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const uData = await uRes.json();
        const pData = await pRes.json();
        const items = [];
        if (uData.success) uData.data.forEach(u => items.push({
          id: `u-${u._id}`, Icon: UserPlus, bg: 'bg-blue-50', color: 'text-blue-500',
          title: 'New user registered', desc: `${u.name} joined as ${u.role}`,
          time: new Date(u.createdAt).toLocaleDateString(),
          badge: 'bg-blue-100 text-blue-700', label: u.role,
        }));
        if (pData.success) pData.data.forEach(p => items.push({
          id: `p-${p._id}`, Icon: Dog, bg: 'bg-green-50', color: 'text-green-500',
          title: 'Dog listed', desc: `${p.name} (${p.breed})`,
          time: new Date(p.createdAt).toLocaleDateString(),
          badge: 'bg-green-100 text-green-700', label: p.status,
        }));
        setActivities(items.slice(0, 5));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-8"><RefreshCw className="h-5 w-5 text-gray-300 animate-spin" /></div>;
  if (!activities.length) return <div className="text-center py-8 text-gray-400"><Clock className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-sm">No recent activity yet.</p></div>;

  return (
    <div className="space-y-3">
      {activities.map(({ id, Icon, bg, color, title, desc, time, badge, label }) => (
        <div key={id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
          <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 capitalize ${badge}`}>{label}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400"><Clock className="h-3 w-3" />{time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;