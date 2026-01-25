import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, icon, color, borderColor }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className={`${color} border ${borderColor} rounded-xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-white border ${borderColor}`}>
          {icon}
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {change}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <div className="flex-1">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: isPositive ? '75%' : '45%' }}
              ></div>
            </div>
          </div>
          <span className="ml-2">{isPositive ? 'Growing' : 'Declining'}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;