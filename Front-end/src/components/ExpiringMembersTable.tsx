import React from 'react';
import { Member } from '../types';
import { ExternalLink } from 'lucide-react';
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExtend = async (id: number) => {
    try {
      const res = await fetch(`/api/members/${id}/extend`, { method: 'POST' });
      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error extending membership:', error);
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-black text-white uppercase tracking-tight">Memberships Expiring Soon</h3>
        <button 
          onClick={() => navigate('/members')}
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
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Plan</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Expiry Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Days Left</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((member) => {
              const days = getDaysRemaining(member.expiry_date);
              return (
                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-black">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{member.plan}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{member.expiry_date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      days <= 3 ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-gray-400'
                    }`}>
                      {days} Days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleExtend(member.id)}
                      className="text-orange-500 hover:bg-orange-500/10 p-2 rounded-lg transition-colors group relative"
                      title="Extend 30 Days"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-zinc-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                        Extend 30 Days
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-600 text-sm">
                  No memberships expiring soon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
