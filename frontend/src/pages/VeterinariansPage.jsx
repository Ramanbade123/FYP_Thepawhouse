import React from 'react';
import NearbyClinics from '../components/Shared/NearbyClinics';
import { HeartPulse } from 'lucide-react';

const VeterinariansPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#063630] to-[#085558] py-20 px-6 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
            <HeartPulse className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Find Veterinary Care Near You
          </h1>
          <p className="text-base text-emerald-100/90 text-longform mx-auto leading-relaxed">
            Find trusted, qualified veterinary professionals in your area. 
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 py-16 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-gray-100">
          <NearbyClinics />
        </div>
      </div>
    </div>
  );
};

export default VeterinariansPage;
