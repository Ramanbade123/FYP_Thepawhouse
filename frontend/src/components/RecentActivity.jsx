import React from 'react';
import { UserPlus, Dog, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'user_register',
      title: 'New user registered',
      description: 'John Doe joined as an adopter',
      time: '5 minutes ago',
      icon: <UserPlus className="h-5 w-5 text-blue-500" />,
      status: 'success'
    },
    {
      id: 2,
      type: 'adoption_request',
      title: 'Adoption request submitted',
      description: 'Sarah wants to adopt Max',
      time: '15 minutes ago',
      icon: <Dog className="h-5 w-5 text-green-500" />,
      status: 'pending'
    },
    {
      id: 3,
      type: 'verification',
      title: 'User verification required',
      description: 'Michael needs document verification',
      time: '30 minutes ago',
      icon: <Shield className="h-5 w-5 text-yellow-500" />,
      status: 'warning'
    },
    {
      id: 4,
      type: 'adoption_approved',
      title: 'Adoption approved',
      description: 'Buddy found a new home!',
      time: '2 hours ago',
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      status: 'success'
    },
    {
      id: 5,
      type: 'adoption_rejected',
      title: 'Adoption rejected',
      description: 'Application did not meet requirements',
      time: '3 hours ago',
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      status: 'error'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="p-2 bg-white border border-gray-200 rounded-lg">
              {activity.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-800 truncate">{activity.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {activity.time}
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            •••
          </button>
        </div>
      ))}
      
      {/* View All Button */}
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;