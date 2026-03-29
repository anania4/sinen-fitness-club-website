import React, { useEffect, useState } from 'react';
import { DailyPass } from '../types';
import { Ticket, Trash2, Search, Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportToExcel';
import { NewDailyPassModal } from '../components/NewDailyPassModal';
import { API_BASE_URL, apiFetch } from '../config';

export const DailyPassesPage: React.FC = () => {
  const [passes, setPasses] = useState<DailyPass[]>([]);
  const [filteredPasses, setFilteredPasses] = useState<DailyPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchPasses = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/daily-passes/`);
      const data = await res.json();
      const passesArray = Array.isArray(data) ? data : (data.results || []);
      setPasses(passesArray);
      setFilteredPasses(passesArray);
    } catch (error) {
      console.error('Error fetching daily passes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  useEffect(() => {
    const filtered = passes.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm))
    );
    setFilteredPasses(filtered);
  }, [searchTerm, passes]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this daily pass record?')) return;
    try {
      await apiFetch(`${API_BASE_URL}/api/daily-passes/${id}/`, { method: 'DELETE' });
      fetchPasses();
    } catch (error) {
      console.error('Error deleting daily pass:', error);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white flex items-center gap-3">
          <Ticket className="w-8 h-8 text-orange-500" />
          Daily Passes
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(filteredPasses, [
              { header: 'Date', key: 'date' },
              { header: 'Visitor Name', key: 'name' },
              { header: 'Phone', key: 'phone' },
              { header: 'Amount (ETB)', key: 'amount', transform: (v: any) => parseFloat(v) },
              { header: 'Payment Method', key: 'payment_method' },
            ], 'Sinen_DailyPasses_Report')}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-orange-500/30 text-orange-500 font-black uppercase rounded-full hover:bg-orange-500/10 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Excel
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 text-sm sm:text-base"
          >
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
            Issue Pass
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search visitors by name or phone..."
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
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Visitor Name</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPasses.length > 0 ? (
                filteredPasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {new Date(pass.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">{pass.name}</td>
                    <td className="px-6 py-4 text-gray-400">{pass.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-500/20 text-green-500">
                        {parseFloat(pass.amount).toLocaleString()} ETB
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 capitalize">{pass.payment_method.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(pass.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Pass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No daily passes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewDailyPassModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} onSuccess={fetchPasses} />
    </div>
  );
};
