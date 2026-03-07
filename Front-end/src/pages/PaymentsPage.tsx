import React, { useEffect, useState } from 'react';
import { Payment } from '../types';
import { Plus, Trash2, Search, CreditCard } from 'lucide-react';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import { API_BASE_URL } from '../config';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments/`);
      const data = await res.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(p => 
      p.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/payments/${id}/`, { method: 'DELETE' });
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white">Payments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Record Payment
        </button>
      </div>

      <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Total Revenue</p>
            <p className="text-3xl font-black text-white">{totalRevenue.toFixed(2)} <span className="text-orange-500">ETB</span></p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      </div>

      <div className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-bold">{payment.member_name}</td>
                  <td className="px-6 py-4 text-orange-500 font-black">{payment.amount.toFixed(2)} ETB</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-400">{payment.method}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecordPaymentModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={fetchPayments} />
    </div>
  );
};
