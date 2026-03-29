import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { RevenueData } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  data: RevenueData[];
}

export const RevenueChart: React.FC<Props> = ({ data }) => {
  const totalRevenue = data.reduce((sum, d) => sum + d.amount, 0);

  const getTrend = (index: number) => {
    if (index === 0 || data[index - 1].amount === 0) return { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    const change = ((data[index].amount - data[index - 1].amount) / data[index - 1].amount) * 100;
    if (change > 0) return { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', pct: `+${change.toFixed(0)}%` };
    if (change < 0) return { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10', pct: `${change.toFixed(0)}%` };
    return { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-500/10', pct: '0%' };
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      {/* Chart Section */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-white uppercase tracking-tight text-xl">Monthly Revenue</h3>
            <p className="text-xs text-gray-500 font-medium">Based on recorded payments • Last 6 months</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">6-Month Total</p>
            <p className="text-2xl font-black text-orange-500">{totalRevenue.toLocaleString()} <span className="text-sm text-orange-500/60">ETB</span></p>
          </div>
        </div>
        
        <div className="w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12, fontWeight: 'bold' }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                  color: '#fff'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} ETB`, 'Revenue']}
                itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#f97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="border-t border-white/10">
        <div className="px-8 py-4 bg-black/30">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Monthly Breakdown</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border-t border-white/5">
          {data.map((item, index) => {
            const trend = getTrend(index);
            const TrendIcon = trend.icon;
            const isHighest = item.amount === Math.max(...data.map(d => d.amount)) && item.amount > 0;
            return (
              <div 
                key={item.month} 
                className={`p-5 border-r border-b border-white/5 last:border-r-0 transition-all hover:bg-white/[0.03] ${isHighest ? 'bg-orange-500/5' : ''}`}
              >
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">{item.month}</p>
                <p className={`text-lg font-black ${item.amount > 0 ? 'text-white' : 'text-gray-600'}`}>
                  {item.amount > 0 ? item.amount.toLocaleString() : '—'}
                </p>
                {index > 0 && item.amount > 0 && (
                  <div className={`flex items-center gap-1 mt-1.5 ${trend.color}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{(trend as any).pct || '0%'}</span>
                  </div>
                )}
                {isHighest && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[8px] font-black uppercase">Peak</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
