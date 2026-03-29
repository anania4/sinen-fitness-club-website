import React from 'react';
import { Lead } from '../types';
import { Phone, UserPlus, ArrowRight } from 'lucide-react';
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
      if (res.ok) onRefresh();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' };
      case 'contacted': return { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500' };
      case 'converted': return { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-500' };
      default: return { bg: 'bg-zinc-500/15', border: 'border-zinc-500/30', text: 'text-gray-400', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tight text-sm">Trial Requests</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{leads.length} pending</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/leads')}
          className="flex items-center gap-1 text-xs font-black text-orange-500 hover:text-orange-400 uppercase tracking-wider transition-colors group"
        >
          View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        {leads.length > 0 ? leads.slice(0, 5).map((lead) => {
          const s = getStatusStyle(lead.status);
          return (
            <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/20 flex items-center justify-center text-xs font-black text-orange-400 flex-shrink-0">
                  {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">{lead.name}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{lead.phone}</span>
                    {lead.goal && <span className="hidden sm:inline">• {lead.goal}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleStatus(lead.id, lead.status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${s.bg} border ${s.border} transition-all hover:scale-105 active:scale-95 flex-shrink-0 ml-2`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot} ${lead.status === 'pending' ? 'animate-pulse' : ''}`} />
                <span className={`text-[10px] font-black uppercase tracking-wide ${s.text}`}>{lead.status}</span>
              </button>
            </div>
          );
        }) : (
          <div className="py-12 text-center text-gray-600 text-sm">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            No trial requests yet
          </div>
        )}
      </div>
    </div>
  );
};
