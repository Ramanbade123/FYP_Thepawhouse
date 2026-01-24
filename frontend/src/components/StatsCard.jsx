import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, icon, color, borderColor }) => {
  const isPositive = change.startsWith('+');
}