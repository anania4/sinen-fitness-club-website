import React from 'react';
import { Payment } from '../types';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  payments: Payment[];
}

export const RecentPaymentsTable: React.FC<Props> = ({ payments }) => {
  const navigate = useNavigate();
  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card': return <CreditCard className="w-4 h-4 text-orange-500" />;
      case 'paypal': return <Wallet className="w-4 h-4 text-orange-500" />;
      default: return <DollarSign className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-black text-white uppercase tracking-tight">Recent Payments</h3>
        <button 
          onClick={() => navigate('/payments')}
          className="text-xs font-black text-orange-500 hover:text-orange-400 uppercase tracking-wider"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Member Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-white">{payment.member_name}</span>
                </td>
                <td className="px-6 py-4 text-sm font-black text-orange-500">{payment.amount.toFixed(2)} ETB</td>
                <td className="px-6 py-4 text-sm text-gray-400">{payment.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-400">
                    {getMethodIcon(payment.method)}
                    {payment.method}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
