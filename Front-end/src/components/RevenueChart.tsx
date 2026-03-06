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

interface Props {
  data: RevenueData[];
}

export const RevenueChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-black text-white uppercase tracking-tight text-xl">Monthly Revenue</h3>
          <p className="text-xs text-gray-500 font-medium">Revenue trend for the last 6 months</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Revenue</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
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
              tickFormatter={(value) => `${value} ETB`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                color: '#fff'
              }}
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
  );
};
