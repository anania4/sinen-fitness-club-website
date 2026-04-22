import React, { useEffect, useState } from 'react';
import { Member } from '../types';
import { UserPlus, Edit, Trash2, Search, Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportToExcel';
import { NewMemberModal } from '../components/NewMemberModal';
import { EditMemberModal } from '../components/EditMemberModal';
import { MemberDetailsModal } from '../components/MemberDetailsModal';
import { API_BASE_URL, apiFetch } from '../config';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/members/`);
      const data = await res.json();
      const membersArray = Array.isArray(data) ? data : (data.results || []);
      setMembers(membersArray);
      setFilteredMembers(membersArray);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.plan.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await apiFetch(`${API_BASE_URL}/api/members/${id}/`, { method: 'DELETE' });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setShowDetailsModal(true);
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white">Members</h1>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(filteredMembers, [
              { header: 'Name', key: 'name' },
              { header: 'Phone', key: 'phone' },
              { header: 'Plan', key: 'plan' },
              { header: 'Start Date', key: 'start_date' },
              { header: 'Expiry Date', key: 'expiry_date' },
              { header: 'Payment Status', key: 'payment_status' },
              { header: 'Status', key: 'status' },
            ], 'Sinen_Members_Report')}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-orange-500/30 text-orange-500 font-black uppercase rounded-full hover:bg-orange-500/10 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Excel
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 text-sm sm:text-base"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Member
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search members..."
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
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  onClick={() => handleViewDetails(member)}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10 flex-shrink-0">
                        {member.profile_photo ? (
                          <img 
                            src={`${API_BASE_URL}${member.profile_photo}`} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-500 font-black text-xs">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-white font-bold">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{member.plan}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(member.expiry_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      member.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                      member.status === 'expired' ? 'bg-red-500/20 text-red-500' :
                      member.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-500' :
                      member.status === 'frozen' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewMemberModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} onSuccess={fetchMembers} />
      <EditMemberModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSuccess={fetchMembers} member={selectedMember} />
      <MemberDetailsModal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        member={selectedMember}
        onEdit={() => { setShowDetailsModal(false); setShowEditModal(true); }}
      />
    </div>
  );
};
