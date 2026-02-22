import {
  LayoutDashboard, Users, Heart, PawPrint, Shield,
  BarChart3, MessageSquare, Calendar, Settings,
} from 'lucide-react';

// ─── Brand Colors ─────────────────────────────────────────────
export const C = {
  dark:   '#063630',
  teal:   '#085558',
  green:  '#008737',
  purple: '#848AFF',
  bg:     '#EDEDED',
  white:  '#FFFFFF',
};

// ─── Nav Items ────────────────────────────────────────────────
export const navItems = [
  { id: 'dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'users',         label: 'User Management', icon: Users           },
  { id: 'adoptions',     label: 'Adoptions',       icon: Heart           },
  { id: 'pets',          label: 'Pet Management',  icon: PawPrint        },
  { id: 'verifications', label: 'Verifications',   icon: Shield          },
  { id: 'reports',       label: 'Reports',         icon: BarChart3       },
  { id: 'messages',      label: 'Messages',        icon: MessageSquare   },
  { id: 'calendar',      label: 'Calendar',        icon: Calendar        },
  { id: 'settings',      label: 'Settings',        icon: Settings        },
];

// ─── Tab Accent Colors ────────────────────────────────────────
export const tabAccents = {
  users:         '#085558',
  adoptions:     '#008737',
  pets:          '#f59e0b',
  verifications: '#ef4444',
  reports:       '#848AFF',
  messages:      '#085558',
  calendar:      '#008737',
  settings:      '#64748b',
};
