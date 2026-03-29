import React from 'react';
import { Member } from '../types';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  members: Member[];
  onRefresh: () => void;
}

export const ExpiringMembersTable: React.FC<Props> = ({ members, onRefresh }) => {
  const navigate = useNavigate();
  
  const getDaysRemaining = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusStyle = (days: number) => {
    if (days < 0) return { text: 'EXPIRED', bg: 'bg-red-500/15', border: 'border-red-500/30', textColor: 'text-red-400', dotColor: 'bg-red-500', pulse: true };
    if (days <= 3) return { text: `${days}d left`, bg: 'bg-orange-500/15', border: 'border-orange-500/30', textColor: 'text-orange-400', dotColor: 'bg-orange-500', pulse: true };
    if (days <= 7) return { text: `${days}d left`, bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', textColor: 'text-yellow-400', dotColor: 'bg-yellow-500', pulse: false };
    return { text: `${days}d left`, bg: 'bg-zinc-500/15', border: 'border-zinc-500/30', textColor: 'text-gray-400', dotColor: 'bg-gray-500', pulse: false };
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tight text-sm">Expiring Memberships</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Sorted by urgency</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/members')}
          className="flex items-center gap-1 text-xs font-black text-orange-500 hover:text-orange-400 uppercase tracking-wider transition-colors group"
        >
          View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        {members.length > 0 ? members.slice(0, 6).map((member) => {
          const days = getDaysRemaining(member.expiry_date);
          const s = getStatusStyle(days);
          return (
            <div 
              key={member.id} 
              className={`flex items-center justify-between p-4 rounded-2xl ${s.bg} border ${s.border} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xs font-black text-black shadow-lg shadow-orange-500/20">
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{member.name}</p>
                  <p className="text-[11px] text-gray-500">{member.plan} • Exp: {member.expiry_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${s.bg} border ${s.border}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${s.dotColor} ${s.pulse ? 'animate-pulse' : ''}`} />
                  <span className={`text-[10px] font-black uppercase tracking-wide ${s.textColor}`}>{s.text}</span>
                </div>
                <button 
                  onClick={() => navigate('/admin/members')}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 text-[10px] font-black uppercase transition-all"
                >
                  Renew
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="py-12 text-center text-gray-600 text-sm">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            No memberships expiring soon
          </div>
        )}
      </div>
    </div>
  );
};
