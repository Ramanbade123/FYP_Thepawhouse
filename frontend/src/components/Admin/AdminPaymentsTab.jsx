import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, RefreshCw, Dog, User, 
    Calendar, CheckCircle, Clock, Search,
    Filter, CreditCard, ArrowRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminPaymentsTab = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats]       = useState({ total: 0, pending: 0, completed: 0 });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res   = await fetch(`${API}/pets/admin/payments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setPayments(data.data);
                
                // Stats
                const total = data.data.reduce((acc, p) => p.status === 'completed' ? acc + p.amount : acc, 0);
                const pending = data.data.filter(p => p.status === 'pending').length;
                const completed = data.data.filter(p => p.status === 'completed').length;
                setStats({ total, pending, completed });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filtered = payments.filter(p => {
        const matchesSearch = 
            p.pet?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.adopter?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.rehomer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.transactionId?.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
                    <p className="text-gray-500 text-sm">Monitor all platform adoption fees and transactions.</p>
                </div>
                <button onClick={fetchPayments} 
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Volume', value: `Rs. ${stats.total.toLocaleString()}`, color: 'text-blue-600', bg: 'bg-blue-50', icon: DollarSign },
                    { label: 'Completed',    value: stats.completed,                 color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
                    { label: 'Pending/Failed', value: stats.pending,                  color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${s.bg} rounded-xl`}>
                                <s.icon className={`h-6 w-6 ${s.color}`} />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{s.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search pet, adopter, rehomer or TXID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558]"
                    />
                </div>
                <select 
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#085558]"
                >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Details</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Rehomer</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Adopter</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Amount</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-50 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <p>No transaction records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p, i) => (
                                    <motion.tr key={p._id}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {p.pet?.primaryImage ? (
                                                        <img src={p.pet.primaryImage.startsWith('http') ? p.pet.primaryImage : `${API.replace('/api', '')}${p.pet.primaryImage}`} 
                                                             className="w-full h-full object-cover" alt="" />
                                                    ) : <Dog className="h-5 w-5 text-gray-400" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{p.pet?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono">{p.transactionId || p.pidx?.substring(0,10)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-700">{p.rehomer?.name}</p>
                                            <p className="text-xs text-gray-400">{p.rehomer?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-700">{p.adopter?.name}</p>
                                            <p className="text-xs text-gray-400">{p.adopter?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#085558]">Rs. {p.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                p.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                            <div className="text-[10px]">{new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentsTab;
