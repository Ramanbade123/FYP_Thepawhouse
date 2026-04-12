import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, User, Home, Phone, Calendar, Heart, ShieldAlert, Dog, Clock } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API.replace('/api', '');
const imgSrc = (url) => {
    if (!url || url.trim() === '') return null;
    let fullUrl = url;
    if (!url.startsWith('http') && !url.startsWith('/')) {
        fullUrl = `/uploads/users/${url}`;
    }
    return fullUrl.startsWith('http') ? fullUrl : `${BASE_URL}${fullUrl}`;
};

const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
};

const ApplicationReviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const app = location.state?.app;
    const petId = location.state?.petId;

    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(app?.status || 'pending');

    useEffect(() => {
        if (!app || !petId) {
            navigate('/dashboard');
        }
    }, [app, petId, navigate]);

    if (!app) return null;

    const applicant = app.adopter || {};
    const prefs = applicant.adoptionPreferences || {};

    const fullAddress = [applicant.address?.street, applicant.address?.city, applicant.address?.state]
        .filter(Boolean).join(', ');

    const handleAction = async (newStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/pets/${petId}/applications/${app._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setCurrentStatus(newStatus);
            }
        } catch (err) {
            alert('Failed to update status.');
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/messages/start-rehomer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ petId, adopterId: applicant._id }),
            });
            const data = await res.json();
            if (data.success) {
                navigate('/dashboard', { state: { activeTab: 'messages' }});
            } else {
                alert(data.error || 'Failed to start conversation');
            }
        } catch (err) {
            alert('Network error while starting conversation');
        } finally {
            setLoading(false);
        }
    };

    const DetailRow = ({ icon: Icon, label, value }) => value ? (
        <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
            <div className="p-2 bg-[#008737]/10 text-[#008737] rounded-lg mt-0.5">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    ) : null;

    const Tag = ({ children, color = 'green' }) => {
        const colors = {
            green: 'bg-green-50 text-green-700 border-green-200',
            blue: 'bg-blue-50 text-blue-700 border-blue-200',
            orange: 'bg-orange-50 text-orange-700 border-orange-200',
        };
        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${colors[color]}`}>
                {children}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#063630] font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header Profile Section */}
                <div className="relative bg-gradient-to-r from-[#063630] to-[#008737] px-8 py-12 text-center sm:text-left sm:flex sm:items-center sm:gap-8">
                    <div className="relative inline-block mb-4 sm:mb-0">
                        {applicant.profileImage && applicant.profileImage.trim() !== '' && applicant.profileImage !== 'default-profile.jpg' ? (
                            <img src={imgSrc(applicant.profileImage)} alt={applicant.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl" />
                        ) : (
                            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-2xl backdrop-blur-sm">
                                <span className="text-white font-bold text-5xl">
                                    {applicant.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>
                        )}
                        <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${currentStatus === 'approved' ? 'bg-green-500' : currentStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-400'}`}>
                            {currentStatus === 'approved' ? <CheckCircle className="h-4 w-4 text-white" /> : currentStatus === 'rejected' ? <XCircle className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-white" />}
                        </div>
                    </div>
                    
                    <div className="flex-1 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">{applicant.name || 'Unknown Applicant'}</h1>
                                <p className="text-emerald-100 text-lg mt-1">{applicant.email}</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
                                {applicant.userType && (
                                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-md border border-white/30 text-white">
                                        {applicant.userType.charAt(0).toUpperCase() + applicant.userType.slice(1)}
                                    </span>
                                )}
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-lg uppercase tracking-wider ${statusColor[currentStatus]}`}>
                                    {currentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    
                    {/* Left Column: Contact & Application Info */}
                    <div className="col-span-1 p-8 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-[#063630] mb-6 flex items-center gap-2">
                            <Dog className="h-5 w-5 text-[#008737]" /> The Request
                        </h3>
                        <div className="space-y-1 mb-8">
                            <p className="text-gray-500 text-sm">Applying to adopt</p>
                            <p className="text-xl font-bold text-[#085558]">{app.petName}</p>
                            <p className="text-gray-400 text-xs mt-2 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1.5">
                                <ShieldAlert className="h-3.5 w-3.5" /> Payment: <span className="uppercase font-bold text-gray-600">{app.paymentStatus || 'UNPAID'}</span>
                            </p>
                        </div>

                        <h3 className="text-lg font-bold text-[#063630] mb-6 flex items-center gap-2 border-t border-gray-200 pt-8">
                            <User className="h-5 w-5 text-[#008737]" /> Contact Info
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                                <p className="text-gray-700 font-medium">{applicant.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-gray-700 font-medium">{fullAddress || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Member Since</p>
                                <p className="text-gray-700 font-medium">{applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'Unknown'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Lifestyle & Message */}
                    <div className="col-span-2 p-8">
                        <h3 className="text-xl font-bold text-[#063630] mb-6 flex items-center gap-2">
                            <Home className="h-6 w-6 text-[#008737]" /> Living Situation & Experience
                        </h3>
                        
                        <div className="bg-white border text-sm border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
                            <DetailRow icon={Home} label="Home Environment" value={prefs.houseType ? prefs.houseType.charAt(0).toUpperCase() + prefs.houseType.slice(1) : 'Not Specified'} />
                            <DetailRow icon={Heart} label="Activity Level Match" value={prefs.activityLevel ? prefs.activityLevel.charAt(0).toUpperCase() + prefs.activityLevel.slice(1) : 'Not Specified'} />
                            <DetailRow icon={ShieldAlert} label="Dog Experience" value={prefs.experienceLevel ? prefs.experienceLevel.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Not Specified'} />
                            
                            <div className="pt-6 mt-2 border-t border-gray-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Lifestyle Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {prefs.hasYard && <Tag color="green">Has Fenced Yard</Tag>}
                                    {prefs.hasOtherPets && <Tag color="orange">Has Other Pets</Tag>}
                                    {prefs.hasChildren && <Tag color="blue">Has Children</Tag>}
                                    {!prefs.hasYard && !prefs.hasOtherPets && !prefs.hasChildren && (
                                        <p className="text-sm text-gray-400 italic">No specific lifestyle tags provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {app.message && (
                            <>
                                <h3 className="text-xl font-bold text-[#063630] mb-4 flex items-center gap-2">
                                    <MessageSquare className="h-6 w-6 text-[#008737]" /> Applicant's Note
                                </h3>
                                <div className="bg-[#008737]/5 rounded-2xl p-6 border border-[#008737]/10 relative">
                                    <span className="absolute top-2 left-3 text-4xl text-[#008737]/20 font-serif">"</span>
                                    <p className="text-gray-700 leading-relaxed italic relative z-10 px-4">
                                        {app.message}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="bg-gray-50 border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Please review carefully before making a decision.
                    </p>
                    
                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <button 
                            onClick={handleMessage} disabled={loading}
                            className="flex-1 sm:flex-none px-6 py-3 bg-white text-[#085558] border-2 border-[#085558]/20 rounded-xl font-bold hover:bg-[#085558]/5 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageSquare className="h-5 w-5" /> Message
                        </button>

                        {(currentStatus === 'pending' || currentStatus === 'reviewing') && (
                            <>
                                <button 
                                    onClick={() => handleAction('rejected')} disabled={loading}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-bold hover:bg-red-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <XCircle className="h-5 w-5" /> Reject
                                </button>
                                <button 
                                    onClick={() => handleAction('approved')} disabled={loading}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                                >
                                    <CheckCircle className="h-5 w-5" /> Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReviewPage;
