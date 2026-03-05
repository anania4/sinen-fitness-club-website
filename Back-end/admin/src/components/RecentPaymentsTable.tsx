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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Payments</h3>
        <button 
          onClick={() => navigate('/payments')}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-700">{payment.member_name}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">${payment.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{payment.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-xs font-medium text-slate-500">
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
