import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReceiptPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(location.state?.payment || null);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [downloading, setDownloading] = useState(false);

    // If we got a payment object but it's not populated (no pet.name), fetch from API
    useEffect(() => {
        const raw = location.state?.payment;
        if (!raw) {
            navigate(-1);
            return;
        }

        const needsFetch = !raw.pet?.name || !raw.adopter?.name;
        if (needsFetch && raw._id) {
            setLoading(true);
            const token = localStorage.getItem('token');
            fetch(`${API}/pets/payments/${raw._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => {
                    if (data.success) setPayment(data.data);
                    else setError(data.error || 'Could not load receipt.');
                })
                .catch(() => setError('Server error loading receipt.'))
                .finally(() => setLoading(false));
        }
    }, []);

    const handleDownload = () => {
        setDownloading(true);
        const element = document.getElementById('printable-receipt');
        const opt = {
            margin:       0.5,
            filename:     `receipt-${payment.transactionId || payment.pidx || 'download'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save().then(() => setDownloading(false));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-[#063630]">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="font-medium">Loading receipt…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-sm w-full">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-gray-800 mb-2">Receipt unavailable</h2>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#063630] text-white rounded-xl font-semibold">Go Back</button>
            </div>
        </div>
    );

    if (!payment) return null;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-receipt, #printable-receipt * { visibility: visible; }
                    #printable-receipt {
                        position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px;
                        box-shadow: none !important; background: white !important;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center no-print">
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#063630] font-medium"
                >
                    <ArrowLeft className="h-4 w-4" /> Go Back
                </button>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008737] text-white rounded-lg font-semibold hover:bg-[#085558] transition-colors disabled:opacity-70"
                    style={{ color: '#ffffff' }}
                >
                    {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {downloading ? 'Generating PDF...' : 'Download Receipt'}
                </button>
            </div>

            <div
                id="printable-receipt"
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 text-center bg-gradient-to-r from-[#063630] to-[#085558]">
                    <h2 className="text-3xl font-bold text-white">Official Payment Receipt</h2>
                    <p className="text-white/70 mt-1">The Pawhouse Adoption Services</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Transaction Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</p>
                            <p className="font-mono font-bold text-[#063630]">{payment.transactionId || payment.pidx || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Date &amp; Time</p>
                            <p className="font-semibold text-[#063630]">{new Date(payment.paidAt || payment.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {payment.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                            <p className="font-semibold text-[#063630]">Khalti Digital Wallet</p>
                        </div>
                    </div>

                    {/* Adoption Agreement Details */}
                    <div>
                        <h4 className="font-bold text-[#063630] text-lg mb-4">Adoption Agreement Details</h4>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Adopted Pet</p>
                                    <p className="font-bold text-[#063630]">{payment.pet?.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{payment.pet?.breed || 'Unknown breed'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Adopter</p>
                                    <p className="font-bold text-[#063630]">{payment.adopter?.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{payment.adopter?.email || 'N/A'}</p>
                                </div>
                                {payment.rehomer && (
                                    <div className="md:col-span-2 pt-3 mt-1 border-t border-gray-200/60">
                                        <p className="text-xs text-gray-500 mb-1">Rehomer (Lister)</p>
                                        <p className="font-bold text-[#063630]">{payment.rehomer?.name || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{payment.rehomer?.email || 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center py-6 mt-4 border-t-2 border-dashed border-gray-300">
                        <span className="font-bold text-gray-700 text-xl">Total Amount Paid</span>
                        <span className="text-4xl font-bold text-[#008737]">Rs. {payment.amount?.toLocaleString()}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#063630] text-white text-center">
                    <p className="text-sm opacity-80 mb-2">Thank you for making a difference by adopting!</p>
                    <p className="text-xs opacity-50">This is a system-generated receipt. No signature is required.</p>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
