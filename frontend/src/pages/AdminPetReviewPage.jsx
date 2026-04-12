import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Dog, MapPin, User, Mail, Phone, 
  Calendar, Info, AlertCircle, CheckCircle, XCircle,
  CreditCard, Loader2, Link as LinkIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');

const AdminPetReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchPetDetail();
  }, [id]);

  const fetchPetDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/pets/admin/${id}/detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPet(data.data);
        setPayment(data.payment);
        setAdminNote(data.data.adminNote || '');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (decision) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/pets/admin/${id}/approval`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ approval: decision, note: adminNote })
      });
      const data = await res.json();
      if (data.success) {
        fetchPetDetail();
        alert(`Listing ${decision} successfully.`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const imgSrc = (url) => !url ? null : url.startsWith('http') ? url : `${BASE_URL}${url}`;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-[#008737] animate-spin" />
        <p className="text-gray-500 font-medium tracking-wide">Retrieving secure data...</p>
      </div>
    </div>
  );

  if (error || !pet) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 shadow-sm border border-red-100 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error || 'Pet not found'}</p>
        <button onClick={() => navigate('/admin/dashboard?tab=pets')} className="px-6 py-2 bg-gray-800 text-white rounded-xl">
          Back to Listings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#063630] font-bold transition-all text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Registry
          </button>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Primary Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {pet.images?.length > 0 ? pet.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-[1.5rem] overflow-hidden bg-gray-100 group">
                <img src={imgSrc(img)} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            )) : (
              <div className="aspect-video col-span-2 rounded-[1.5rem] bg-gray-100 flex items-center justify-center">
                <Dog className="h-16 w-16 text-gray-200" />
              </div>
            )}
          </div>

          {/* Description & Personality */}
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#085558]/10 rounded-xl flex items-center justify-center">
                   <Info className="h-5 w-5 text-[#085558]" />
                </div>
                <h2 className="text-xl font-bold text-[#063630]">Description & Background</h2>
             </div>
             <div className="prose prose-sm text-gray-600 max-w-none leading-relaxed whitespace-pre-wrap mb-8">
                {pet.description}
             </div>
             {pet.reason && (
                <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <AlertCircle className="h-12 w-12 text-red-700" />
                   </div>
                   <h4 className="text-xs font-extrabold text-red-500 uppercase tracking-widest mb-2">Rehoming Reason</h4>
                   <p className="text-red-700 font-medium italic">"{pet.reason}"</p>
                </div>
             )}
          </div>

          {/* Health Profile */}
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-[#063630] mb-6">Health & Temperament</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Medical History</p>
                   <div className="flex flex-wrap gap-2">
                     {['vaccinated', 'neutered', 'microchipped'].map(h => (
                        <div key={h} className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${pet[h] ? 'bg-green-50 text-[#008737] border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100 opacity-50'}`}>
                           {pet[h] ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                           <span className="capitalize">{h}</span>
                        </div>
                     ))}
                   </div>
                   {pet.healthNotes && (
                      <p className="text-sm text-gray-500 italic mt-2">Notes: {pet.healthNotes}</p>
                   )}
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Socialization</p>
                   <div className="flex flex-wrap gap-2">
                     {['goodWithKids', 'goodWithDogs', 'goodWithCats'].map(s => (
                        <div key={s} className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${pet[s] ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-100 opacity-50'}`}>
                           <span className="capitalize">{s.replace('goodWith', 'Good with ')}</span>
                        </div>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Registry, Rehomer, Adopter, & Actions */}
        <div className="space-y-8">
           {/* Registry Info Card */}
           <div className="bg-[#063630] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
              <h3 className="text-xs font-extrabold text-white/50 uppercase tracking-[0.2em] mb-6">Registry Asset</h3>
              <div className="space-y-6">
                 <div>
                    <span className="text-white/40 text-[10px] font-bold uppercase block mb-1">Breed & Category</span>
                    <p className="text-lg font-bold">{pet.breed}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-white/40 text-[10px] font-bold uppercase block mb-1">Age</span>
                      <p className="text-sm font-semibold">{pet.ageDisplay}</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] font-bold uppercase block mb-1">Gender</span>
                      <p className="text-sm font-semibold capitalize">{pet.gender}</p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-white/40 font-bold uppercase text-[10px]">Rehoming Fee</span>
                       <span className="text-[#008737] font-extrabold">NPR {pet.rehomingFee || '0'}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Rehomer Details */}
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                 </div>
                 <h2 className="text-lg font-bold text-[#063630]">Lister/Rehomer</h2>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <img src={imgSrc(pet.rehomer?.profileImage) || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover border-2 border-[#008737]/20" alt="" />
                    <div>
                       <p className="text-sm font-bold text-gray-800">{pet.rehomer?.name}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified User</p>
                    </div>
                 </div>
                 <div className="space-y-2 pt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-2"><Mail className="h-3 w-3" /> {pet.rehomer?.email}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2"><Phone className="h-3 w-3" /> {pet.rehomer?.phone || 'No phone'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2"><MapPin className="h-3 w-3" /> {pet.rehomer?.location?.city}, {pet.rehomer?.location?.state}</p>
                 </div>
              </div>
           </div>

           {/* NEW: ADOPTER & PAYMENT (Only if adopted) */}
           {pet.status === 'adopted' && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#008737]/5 rounded-[2rem] p-8 shadow-sm border border-[#008737]/20 overflow-hidden relative"
             >
                <div className="absolute top-0 right-0 p-4">
                   <CheckCircle className="h-8 w-8 text-[#008737] opacity-20" />
                </div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-[#008737]/20 rounded-xl flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-[#008737]" />
                   </div>
                   <h2 className="text-lg font-bold text-[#063630]">Adoption Data</h2>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <img src={imgSrc(pet.adoptedBy?.profileImage)} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" alt="" />
                      <div>
                         <p className="text-sm font-bold text-gray-800">{pet.adoptedBy?.name}</p>
                         <p className="text-[10px] text-[#008737] font-extrabold uppercase tracking-widest">New Owner</p>
                      </div>
                   </div>

                   {payment && (
                      <div className="bg-white rounded-2xl p-5 shadow-inner border border-[#008737]/10">
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Paid Amount</span>
                            <span className="text-sm font-extrabold text-[#008737]">NPR {payment.amount}</span>
                         </div>
                         <div className="space-y-2 pt-3 border-t border-gray-50">
                            <div className="flex justify-between text-[10px]">
                               <span className="text-gray-400 uppercase">Khalti TXN:</span>
                               <span className="font-mono font-bold text-gray-600">{payment.transactionId || payment.pidx?.substring(0,10)}...</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                               <span className="text-gray-400 uppercase">Method:</span>
                               <span className="font-bold text-gray-600">Digital Wallet</span>
                         </div>
                         <button 
                           onClick={() => navigate(`/payments/${payment._id}`, { state: { payment } })}
                           className="w-full mt-4 py-3 bg-[#008737]/10 text-[#008737] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#008737] hover:text-white transition-all flex items-center justify-center gap-2"
                         >
                            <LinkIcon className="h-3 w-3" />
                            View Detailed Receipt
                         </button>
                      </div>
                   )}
                </div>
             </motion.div>
           )}

           {/* Decision Actions */}
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Listing Evaluation</h3>
              <textarea 
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                placeholder="Write an internal note or provide feedback to rehomer..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#008737]/20 focus:border-[#008737] resize-none"
              />
              <div className="flex flex-col gap-3">
                 <button 
                  onClick={() => handleAction('approved')}
                  disabled={actionLoading || pet.adminApproval === 'approved'}
                  className="w-full py-4 bg-[#008737] text-white rounded-2xl font-bold shadow-lg shadow-[#008737]/20 hover:bg-[#085558] hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none text-xs uppercase tracking-[0.1em]"
                 >
                    {actionLoading ? 'Syncing...' : 'Confirm Approval'}
                 </button>
                 <button 
                  onClick={() => handleAction('rejected')}
                  disabled={actionLoading || pet.adminApproval === 'rejected'}
                  className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all text-xs uppercase tracking-[0.1em]"
                 >
                    Flag/Reject Listing
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Mock missing icon
const UserCheck = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default AdminPetReviewPage;
