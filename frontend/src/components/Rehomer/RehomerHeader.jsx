import { Link } from 'react-router-dom';
import { PawPrint, Bell } from 'lucide-react';

const RehomerHeader = ({ user }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#063630]">The Paw House</h1>
              <p className="text-sm text-[#085558]">Rehomer Dashboard</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-[#085558] relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-[#063630]">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-600">Rehomer</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#085558] to-[#008737] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RehomerHeader;
