import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Dog } from 'lucide-react';

const ListedDogs = ({ dogs }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#063630]">Your Listed Dogs</h2>
        <Link
          to="/rehoming-process"
          className="bg-gradient-to-r from-[#085558] to-[#008737] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-shadow"
          style={{ color: '#ffffff' }}
        >
          <Plus className="h-4 w-4" style={{ color: '#ffffff' }} />
          List New Dog
        </Link>
      </div>

      <div className="space-y-4">
        {dogs.map((dog, i) => (
          <motion.div
            key={dog.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#085558]/20 to-[#008737]/20 rounded-lg flex items-center justify-center">
                <Dog className="h-7 w-7 text-[#085558]" />
              </div>
              <div>
                <h3 className="font-bold text-[#063630]">{dog.name}</h3>
                <p className="text-gray-600 text-sm">{dog.breed} • {dog.age}</p>
                <p className="text-gray-500 text-xs">{new Date(dog.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${dog.color}`}>
                    {dog.status.charAt(0).toUpperCase() + dog.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {dog.applications} application{dog.applications !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-[#085558] rounded-lg hover:bg-[#085558]/10 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ListedDogs;
