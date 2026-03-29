import React from 'react';
import { Lead } from '../types';
import { Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, apiFetch } from '../config';

interface Props {
  leads: Lead[];
  onRefresh: () => void;
}

export const LeadsTable: React.FC<Props> = ({ leads, onRefresh }) => {
  const navigate = useNavigate();
  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/leads/${id}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-black text-white uppercase tracking-tight">Recent Trial Requests</h3>
        <button 
          onClick={() => navigate('/admin/leads')}
          className="text-xs font-black text-orange-500 hover:text-orange-400 uppercase tracking-wider"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Phone</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Goal</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Time</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-white">{lead.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-gray-500" />
                    {lead.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{lead.goal}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{lead.preferred_time}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleStatus(lead.id, lead.status)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:scale-105 active:scale-95 ${
                      lead.status === 'pending' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-gray-400'
                    }`}
                  >
                    {lead.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
