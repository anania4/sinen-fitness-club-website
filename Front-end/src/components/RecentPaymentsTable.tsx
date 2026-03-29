import React from 'react';
import { Payment } from '../types';
import { CreditCard, Banknote, Building2, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  payments: Payment[];
}

export const RecentPaymentsTable: React.FC<Props> = ({ payments }) => {
  const navigate = useNavigate();
  
  const getMethodDetails = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash': return { icon: Banknote, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Cash' };
      case 'card': 
      case 'credit card': return { icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Card' };
      case 'bank_transfer':
      case 'bank transfer': return { icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Transfer' };
      default: return { icon: Banknote, color: 'text-gray-400', bg: 'bg-gray-500/10', label: method };
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tight text-sm">Recent Payments</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{payments.length} transactions</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/payments')}
          className="flex items-center gap-1 text-xs font-black text-orange-500 hover:text-orange-400 uppercase tracking-wider transition-colors group"
        >
          View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        {payments.length > 0 ? payments.slice(0, 5).map((payment) => {
          const m = getMethodDetails(payment.method);
          const MethodIcon = m.icon;
          return (
            <div key={payment.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04]">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center flex-shrink-0`}>
                  <MethodIcon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">{payment.member_name}</p>
                  <p className="text-[11px] text-gray-500">{payment.date} • {m.label}</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2 text-right">
                <p className="font-black text-orange-400 text-sm">{parseFloat(payment.amount.toString()).toLocaleString()} <span className="text-[10px] text-orange-500/60">ETB</span></p>
              </div>
            </div>
          );
        }) : (
          <div className="py-12 text-center text-gray-600 text-sm">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            No payments recorded yet
          </div>
        )}
      </div>
    </div>
  );
};
