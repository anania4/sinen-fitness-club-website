import React from 'react';
import { Lead } from '../types';
import { Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  leads: Lead[];
  onRefresh: () => void;
}

export const LeadsTable: React.FC<Props> = ({ leads, onRefresh }) => {
  const navigate = useNavigate();
  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Trial Requests</h3>
        <button 
          onClick={() => navigate('/leads')}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-700">{lead.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {lead.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{lead.goal}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{lead.preferred_time}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleStatus(lead.id, lead.status)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all hover:scale-105 active:scale-95 ${
                      lead.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
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
