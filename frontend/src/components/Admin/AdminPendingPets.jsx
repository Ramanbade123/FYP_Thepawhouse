import React, { useState, useEffect } from 'react';
import { Dog, Clock, ChevronRight, AlertTriangle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc = (url) => !url ? null : url.startsWith('http') ? url : `${BASE_URL}${url}`;

const AdminPendingPets = ({ onManagePets }) => {
  const [pendingPets, setPendingPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/pets/admin/all?adminApproval=pending&limit=4`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setPendingPets(data.data);
        }
      } catch (err) {
        console.error('Error fetching pending pets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingPets();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-200 animate-pulse mb-6">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 w-full bg-gray-100 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  if (pendingPets.length === 0) return null; // Don't show if nothing pending

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-yellow-500 border-y border-r border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-gray-800">Action Needed: Pending Approvals</h2>
        </div>
        <button onClick={onManagePets} className="text-sm font-medium text-[#008737] hover:text-[#085558] flex items-center gap-1 transition-colors">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {pendingPets.map(pet => (
          <div key={pet._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/50 transition-all cursor-pointer group" onClick={onManagePets}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                {pet.primaryImage ? (
                  <img src={imgSrc(pet.primaryImage)} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <Dog className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">{pet.name}</p>
                <p className="text-gray-500 text-xs">{pet.breed} • Listed by {pet.rehomer?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {new Date(pet.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onManagePets(); }}
                className="px-4 py-1.5 bg-yellow-100 text-yellow-800 hover:bg-yellow-500 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                title="Review this listing"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPendingPets;
