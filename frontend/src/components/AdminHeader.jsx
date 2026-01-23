import React, { useState } from 'react';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New adoption request', time: '2 min ago', read: false },
    { id: 2, title: 'User verification pending', time: '15 min ago', read: false },
    { id: 3, title: 'System update completed', time: '1 hour ago', read: true },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

};

export default AdminHeader;