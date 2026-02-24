import { Phone } from 'lucide-react';

const RehomerSupport = () => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#085558]/10 rounded-full flex items-center justify-center">
          <Phone className="h-5 w-5 text-[#085558]" />
        </div>
        <h3 className="font-bold text-[#063630]">Need Help?</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Our rehoming specialists are available to help you through every step of the process.
      </p>
      <button
        className="w-full py-2.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg font-medium hover:shadow-md transition-shadow"
        style={{ color: '#ffffff' }}
      >
        Schedule a Call
      </button>
    </div>
  );
};

export default RehomerSupport;
