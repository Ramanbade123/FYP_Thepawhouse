import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const KhaltiCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your payment...');
  const [paymentData, setPaymentData] = useState(null);
  const hasVerified = useRef(false);
  
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const verifyPayment = async () => {
      // Parse query params
      const searchParams = new URLSearchParams(location.search);
      const pidx = searchParams.get('pidx');
      const petId = searchParams.get('petId');
      const applicationMessage = searchParams.get('message');
      const khaltiStatus = searchParams.get('status');
      
      if (!pidx || !petId) {
        setStatus('error');
        setMessage('Invalid payment callback parameters.');
        return;
      }
      
      if (khaltiStatus !== 'Completed') {
        setStatus('error');
        setMessage(`Payment was not completed. Status: ${khaltiStatus}. Please try again.`);
        return;
      }

      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/pets/${petId}/apply/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ pidx, message: applicationMessage })
        });
        
        const data = await res.json();
        
        if (data.success) {
          setStatus('success');
          setMessage('Payment verified and your adoption application has been submitted successfully!');
          setPaymentData(data.payment);
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verified but failed to submit application.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Server error while verifying payment. Please contact support if your money was deducted.');
      }
    };

    verifyPayment();
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
            <h2 className="text-2xl font-bold text-[#063630] mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-[#008737] mb-4" />
            <h2 className="text-2xl font-bold text-[#063630] mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => navigate('/receipt', { state: { payment: paymentData } })}
                className="px-6 py-3 bg-[#008737] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                style={{ color: '#ffffff' }}
              >
                View & Download Receipt
              </button>
              <Link 
                to="/adopter/dashboard" 
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Go Back
              </button>
              <Link 
                to="/adopter/dashboard" 
                className="flex-1 py-3 bg-[#063630] text-white rounded-xl font-semibold hover:bg-[#063630]/90 transition-all text-center"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default KhaltiCallback;
