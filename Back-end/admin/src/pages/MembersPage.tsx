import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Member } from '../types';
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, Trash2, Edit2, UserPlus, Download } from 'lucide-react';
import { EditMemberModal } from '../components/EditMemberModal';
import { NewMemberModal } from '../components/NewMemberModal';

export const MembersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') || '';
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialPlan);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const fetchMembers = () => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteMember = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Plan', 'Status', 'Expiry Date'];
    const rows = filteredMembers.map(m => [
      `#MEM-${m.id.toString().padStart(4, '0')}`,
      m.name,
      m.plan,
      m.status,
      m.expiry_date
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gym_members_${new Date().toISOString().split('T')[0]}.csv`);
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
          <h2 className="text-2xl font-bold text-slate-900">Members Management</h2>
          <p className="text-slate-500">View and manage all registered gym members.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-sm font-bold text-orange-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">ID: #MEM-{member.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{member.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      member.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {member.expiry_date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(member)}
                        className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteMember(member.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditMemberModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={fetchMembers} 
        member={editingMember} 
      />

      <NewMemberModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchMembers}
      />
    </div>
  );
};
