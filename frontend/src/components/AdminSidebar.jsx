import React from 'react';
import { 
  LayoutDashboard, Users, Dog, Home, 
  Settings, LogOut, Menu, X,
  FileText, Shield, Bell, HelpCircle,
  BarChart3, Calendar, MessageSquare
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
    { id: 'adoptions', label: 'Adoptions', icon: <Dog className="h-5 w-5" /> },
    { id: 'pets', label: 'Pet Management', icon: <Home className="h-5 w-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'verifications', label: 'Verifications', icon: <Shield className="h-5 w-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
};