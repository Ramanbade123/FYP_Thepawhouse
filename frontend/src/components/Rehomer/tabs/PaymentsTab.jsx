import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, DollarSign, Download, ExternalLink, User, Dog, Calendar, CheckCircle, Clock } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PaymentsTab = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [stats, setStats]       = useState({ total: 0, pending: 0, completed: 0 });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res   = await fetch(`${API}/pets/rehomer/payments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setPayments(data.data);
                
                // Calculate basic stats
                const total = data.data.reduce((acc, p) => p.status === 'completed' ? acc + p.amount : acc, 0);
                const pending = data.data.filter(p => p.status === 'pending').length;
                const completed = data.data.filter(p => p.status === 'completed').length;
                setStats({ total, pending, completed });
            }
        } catch (err) {
            console.error('Failed to fetch payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#063630]">Payment History</h2>
                <button onClick={fetchPayments} 
                    className="p-2 text-gray-400 hover:text-[#085558] rounded-lg hover:bg-gray-100 transition-colors">
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-[#085558]">Rs. {stats.total.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Completed Payments</p>
                    <h3 className="text-2xl font-bold text-green-600">{stats.completed}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Failed/Pending</p>
                    <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Transaction ID</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Dog</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Adopter</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Amount</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                        <p>No payment records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((p, i) => (
                                    <motion.tr key={p._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            {p.transactionId || p.pidx?.substring(0, 8) + '...'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                    {p.pet?.primaryImage ? (
                                                        <img src={p.pet.primaryImage.startsWith('http') ? p.pet.primaryImage : `${API.replace('/api', '')}${p.pet.primaryImage}`} 
                                                             alt={p.pet.name} className="w-full h-full object-cover" />
                                                    ) : <Dog className="h-4 w-4 m-2 text-gray-400" />}
                                                </div>
                                                <span className="font-semibold text-[#063630]">{p.pet?.name || 'Unknown Pet'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {p.adopter?.name || 'Unknown Adopter'}
                                            <div className="text-[10px] text-gray-400">{p.adopter?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#085558]">
                                            Rs. {p.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                p.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {p.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(p.createdAt).toLocaleDateString()}
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

export default PaymentsTab;
