import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Users as UsersIcon, X, Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportToExcel';
import { API_BASE_URL, apiFetch } from '../config';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  fitness_group: string;
  staff_id?: string;
  pin?: string;
  is_active?: boolean;
  show_on_frontend?: boolean;
}

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [filteredTeam, setFilteredTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const fetchTeam = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/team/`);
      const data = await res.json();
      const teamArray = Array.isArray(data) ? data : (data.results || []);
      setTeam(teamArray);
      setFilteredTeam(teamArray);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    const filtered = team.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.fitness_group.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeam(filtered);
  }, [searchTerm, team]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await apiFetch(`${API_BASE_URL}/api/team/${id}/`, { method: 'DELETE' });
      fetchTeam();
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowModal(true);
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white">Sinen Staff</h1>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(filteredTeam, [
              { header: 'Name', key: 'name' },
              { header: 'Role', key: 'role' },
              { header: 'Fitness Group', key: 'fitness_group' },
            ], 'Sinen_Staff_Report')}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-orange-500/30 text-orange-500 font-black uppercase rounded-full hover:bg-orange-500/10 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Excel
          </button>
          <button
            onClick={() => { setEditingMember(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Member
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search staff members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div key={member.id} className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10 hover:border-orange-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-black text-black text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{member.name}</h3>
                  <p className="text-sm text-orange-500 font-bold uppercase tracking-wider">{member.role}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4 flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-400">{member.fitness_group}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-orange-500 border border-orange-500/30 rounded-full hover:bg-orange-500/10 transition-colors font-bold uppercase text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-500 border border-red-500/30 rounded-full hover:bg-red-500/10 transition-colors font-bold uppercase text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No staff members found
        </div>
      )}

      {showModal && <TeamModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={fetchTeam} member={editingMember} />}
    </div>
  );
};

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  member: TeamMember | null;
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, onSuccess, member }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [fitnessGroup, setFitnessGroup] = useState('');
  const [staffId, setStaffId] = useState('');
  const [pin, setPin] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showOnFrontend, setShowOnFrontend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setFitnessGroup(member.fitness_group);
      setStaffId(member.staff_id || '');
      setPin(''); // Don't pre-fill PIN for security
      setIsActive(member.is_active ?? true);
      setShowOnFrontend(member.show_on_frontend ?? false);
    } else {
      setName('');
      setRole('');
      setFitnessGroup('');
      setStaffId('');
      setPin('');
      setIsActive(true);
      setShowOnFrontend(false);
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = member ? `${API_BASE_URL}/api/team/${member.id}/` : `${API_BASE_URL}/api/team/`;
      const method = member ? 'PATCH' : 'POST';
      
      const payload: any = { 
        name, 
        role, 
        fitness_group: fitnessGroup,
        is_active: isActive,
        show_on_frontend: showOnFrontend
      };
      
      // Only include staff_id if provided
      if (staffId.trim()) {
        payload.staff_id = staffId;
      }
      
      // Only include PIN if provided
      if (pin.trim()) {
        payload.pin = pin;
      }
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-[2rem] shadow-xl w-full max-w-md overflow-hidden border border-white/10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-black text-white uppercase">{member ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="e.g. Michael Chen"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Role</label>
            <input
              required
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="e.g. Head Trainer"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Fitness Group</label>
            <input
              required
              type="text"
              value={fitnessGroup}
              onChange={(e) => setFitnessGroup(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="e.g. Strength & Conditioning"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              Staff ID {member ? `(Current: ${member.staff_id || 'Auto-generated'})` : '(Auto-generated)'}
            </label>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Leave empty for auto-generation (001, 002, 003...)"
            />
            <p className="text-xs text-gray-500 mt-1">Simple numeric ID for kiosk access. Leave empty to auto-generate.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              PIN for Kiosk {member ? '(Leave empty to keep current)' : '(Optional)'}
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="4-6 digit PIN"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-black/50 border-white/10 rounded focus:ring-orange-500/20"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Active Staff Member
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showOnFrontend"
              checked={showOnFrontend}
              onChange={(e) => setShowOnFrontend(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-black/50 border-white/10 rounded focus:ring-orange-500/20"
            />
            <label htmlFor="showOnFrontend" className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Show on Public Team Page
            </label>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-full bg-orange-500 text-black font-black uppercase tracking-wider hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
            >
              {loading ? 'Saving...' : member ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
