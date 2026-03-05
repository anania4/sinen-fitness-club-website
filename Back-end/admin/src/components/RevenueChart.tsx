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
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-slate-900">Monthly Revenue</h3>
          <p className="text-xs text-slate-400 font-medium">Revenue trend for the last 6 months</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
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
