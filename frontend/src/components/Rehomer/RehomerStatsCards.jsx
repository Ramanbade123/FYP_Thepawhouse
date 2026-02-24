import { motion } from 'framer-motion';
import { Dog, FileText, CheckCircle, Shield, TrendingUp, Clock } from 'lucide-react';

const RehomerStatsCards = ({ stats }) => {
  const cards = [
    {
      label: 'Dogs Listed',
      value: stats.dogsListed,
      icon: Dog,
      iconBg: 'bg-[#085558]/10',
      iconColor: 'text-[#085558]',
      border: 'border-[#085558]/10',
      trend: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Applications',
      value: stats.applicationsCount,
      icon: FileText,
      iconBg: 'bg-[#008737]/10',
      iconColor: 'text-[#008737]',
      border: 'border-[#008737]/10',
      trend: <Clock className="h-5 w-5 text-yellow-500" />,
    },
    {
      label: 'Dogs Rehomed',
      value: stats.dogsRehomed,
      icon: CheckCircle,
      iconBg: 'bg-[#063630]/10',
      iconColor: 'text-[#063630]',
      border: 'border-[#063630]/10',
      trend: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Pending Matches',
      value: stats.pendingMatches,
      icon: Shield,
      iconBg: 'bg-[#085558]/10',
      iconColor: 'text-[#085558]',
      border: 'border-[#085558]/10',
      trend: <Clock className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-xl p-6 shadow-lg border ${card.border}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.iconBg} rounded-lg`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              {card.trend}
            </div>
            <h3 className="text-3xl font-bold text-[#063630] mb-1">{card.value}</h3>
            <p className="text-gray-600">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RehomerStatsCards;
