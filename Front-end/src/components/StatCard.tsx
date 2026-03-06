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
      className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 hover:border-orange-500/50 transition-all group relative overflow-hidden"
    >
      <div className="absolute -right-4 -bottom-4 text-orange-500/10 group-hover:scale-110 transition-transform">
        <Icon size={80} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{title}</p>
        <h3 className="text-5xl font-black italic text-orange-500 mb-2">{value}</h3>
        <p className="text-xs text-gray-600 font-medium">{description}</p>
      </div>
    </motion.div>
  );
};
