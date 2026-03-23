import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const KhaltiDonationVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your donation...');
  const hasVerified = useRef(false);
  
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const verifyDonation = async () => {
      const searchParams = new URLSearchParams(location.search);
      const pidx = searchParams.get('pidx');
      const khaltiStatus = searchParams.get('status');
      
      if (!pidx) {
        setStatus('error');
        setMessage('Invalid donation callback parameters.');
        return;
      }
      
      if (khaltiStatus !== 'Completed') {
        setStatus('error');
        setMessage(`Payment was not completed. Status: ${khaltiStatus}.`);
        return;
      }

      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/donations/khalti/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ pidx })
        });
        
        const data = await res.json();
        
        if (data.success) {
          setStatus('success');
          setMessage(`Thank you! Your donation of NPR ${data.data.amount.toLocaleString()} has been successfully verified.`);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify donation payment.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Server error while verifying your donation.');
      }
    };

    verifyDonation();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#EDEDED] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader className="h-16 w-16 text-[#008737] animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-[#063630] mb-2">Processing Donation</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-[#008737] mb-4" />
            <h2 className="text-2xl font-bold text-[#063630] mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link 
              to="/donate" 
              className="px-6 py-3 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-semibold hover:shadow-lg transition-all w-full"
            >
              Back to Donations
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => navigate('/donate')}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default KhaltiDonationVerify;
