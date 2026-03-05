import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium">{description}</p>
    </motion.div>
  );
};
