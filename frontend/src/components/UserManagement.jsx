import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, 
  Edit, Trash2, MoreVertical, User,
  Mail, Phone, Calendar, CheckCircle,
  XCircle, Clock, UserCheck, UserX
} from 'lucide-react';

const UserManagement = ({ preview = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Mock data for demo
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Mock users data
  const mockUsers = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      role: 'adopter',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20',
      adoptionPreferences: {
        preferredBreeds: ['Golden Retriever', 'Labrador'],
        houseType: 'house'
      }
    },
    {
      _id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+1 234 567 8901',
      role: 'rehomer',
      status: 'pending',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-18',
      rehomingInfo: {
        reason: 'Moving abroad',
        urgency: 'medium'
      }
    },
    {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234 567 8902',
      role: 'adopter',
      status: 'inactive',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-12'
    },
    {
      _id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 234 567 8903',
      role: 'rehomer',
      status: 'active',
      createdAt: '2024-01-03',
      lastLogin: '2024-01-20'
    },
    {
      _id: '5',
      name: 'Robert Wilson',
      email: 'robert@example.com',
      phone: '+1 234 567 8904',
      role: 'adopter',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-19'
    }
  ];

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // If preview mode, show only 5 users
  const displayUsers = preview ? filteredUsers.slice(0, 5) : filteredUsers;

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setUsers(users.filter(user => user._id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: newStatus === 'active' })
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </span>
      );
      case 'inactive': return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
      );
      case 'pending': return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
      default: return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Unknown
        </span>
      );
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'adopter': return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <UserCheck className="h-3 w-3 mr-1" />
          Adopter
        </span>
      );
      case 'rehomer': return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <User className="h-3 w-3 mr-1" />
          Rehomer
        </span>
      );
      case 'admin': return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </span>
      );
      default: return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {role}
        </span>
      );
    }
  };

  return (
    <div>
      {!preview && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <p className="text-gray-600">Manage all users, adopters, and rehomers</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="adopter">Adopters</option>
                  <option value="rehomer">Rehomers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
  );
};

export default UserManagement;