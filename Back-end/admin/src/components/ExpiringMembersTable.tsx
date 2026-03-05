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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Memberships Expiring Soon</h3>
        <button 
          onClick={() => navigate('/members')}
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
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Left</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {members.map((member) => {
              const days = getDaysRemaining(member.expiry_date);
              return (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-700">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.plan}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.expiry_date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      days <= 3 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {days} Days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleExtend(member.id)}
                      className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors group relative"
                      title="Extend 30 Days"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                        Extend 30 Days
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
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
