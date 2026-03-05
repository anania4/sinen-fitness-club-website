import React, { useEffect, useState } from 'react';
import { Payment } from '../types';
import { Search, Download, CreditCard, Wallet, DollarSign, Filter, ArrowUpRight, ArrowDownLeft, Plus, Trash2 } from 'lucide-react';
import { RecordPaymentModal } from '../components/RecordPaymentModal';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = () => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const deletePayment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Member', 'Amount', 'Date', 'Method'];
    const rows = payments.map(p => [
      `#TRX-${p.id.toString().padStart(6, '0')}`,
      p.member_name,
      p.amount.toFixed(2),
      p.date,
      p.method
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gym_payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Transactions</h2>
          <p className="text-slate-500">Monitor and manage all financial transactions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="font-bold text-slate-900">Total Revenue</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-orange-500" />
            </div>
            <h4 className="font-bold text-slate-900">Card Payments</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {payments.filter(p => p.method === 'Credit Card').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Filter className="w-5 h-5 text-slate-500" />
            </div>
            <h4 className="font-bold text-slate-900">Avg. Transaction</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${(totalRevenue / (payments.length || 1)).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-400">#TRX-{payment.id.toString().padStart(6, '0')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{payment.member_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">${payment.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{payment.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => deletePayment(payment.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-500 uppercase">
                        {payment.method === 'Credit Card' ? <CreditCard className="w-4 h-4 text-orange-500" /> : <DollarSign className="w-4 h-4 text-orange-500" />}
                        {payment.method}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecordPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPayments} 
      />
    </div>
  );
};
