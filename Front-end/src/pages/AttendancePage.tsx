import React, { useEffect, useState, useRef } from 'react';
import { ClipboardCheck, LogIn, LogOut, Search, Download, Clock } from 'lucide-react';
import { API_BASE_URL, apiFetch } from '../config';
import { exportToExcel } from '../utils/exportToExcel';

interface AttendanceRecord {
  id: number;
  member: number;
  member_name: string;
  member_phone: string;
  member_status: string;
  check_in: string;
  check_out: string | null;
  is_checked_in: boolean;
  duration_minutes: number;
}

interface MemberOption {
  id: number;
  name: string;
  phone: string;
  status: string;
}

export const AttendancePage: React.FC = () => {
  const [activeVisits, setActiveVisits] = useState<AttendanceRecord[]>([]);
  const [todayHistory, setTodayHistory] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<MemberOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      const [activeRes, historyRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/attendance/?checked_in=true`),
        apiFetch(`${API_BASE_URL}/api/attendance/?date=${today}`),
      ]);
      const activeData = await activeRes.json();
      const historyData = await historyRes.json();
      
      const activeArr = Array.isArray(activeData) ? activeData : (activeData.results || []);
      const historyArr = Array.isArray(historyData) ? historyData : (historyData.results || []);
      
      setActiveVisits(activeArr);
      // History = completed visits only (checked out)
      setTodayHistory(historyArr.filter((r: AttendanceRecord) => r.check_out !== null));
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/members/`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data.results || []);
      setMembers(arr.map((m: any) => ({ id: m.id, name: m.name, phone: m.phone, status: m.status })));
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
      );
      setFilteredMembers(filtered.slice(0, 8));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, members]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCheckIn = async (memberId: number) => {
    setError('');
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/attendance/check-in/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ member_id: memberId }),
      });
      if (!res.ok) {
        let errorMsg = 'Check-in failed';
        try {
          const data = await res.json();
          errorMsg = data.error || data.detail || data.message || 'Check-in failed';
        } catch (e) {
          // If JSON parsing fails, fallback to default
        }
        setError(errorMsg);
        return;
      }
      setSearchTerm('');
      setShowDropdown(false);
      fetchData();
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleCheckOut = async (attendanceId: number) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/attendance/${attendanceId}/check-out/`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error checking out:', err);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-orange-500" />
          Attendance
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 rounded-2xl border border-white/10 px-6 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white font-black text-xl">{activeVisits.length}</span>
            <span className="text-gray-400 text-sm uppercase tracking-wider font-bold">In Gym</span>
          </div>
        </div>
      </div>

      {/* Check-in Search */}
      <div className="bg-zinc-900 rounded-[2rem] border border-white/10 p-6">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Quick Check-in</h2>
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search member by name or phone to check in..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-black/50 text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          
          {/* Autocomplete Dropdown */}
          {showDropdown && filteredMembers.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-zinc-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
              {filteredMembers.map(member => {
                const isActive = member.status === 'active';
                const alreadyIn = activeVisits.some(v => v.member === member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => !alreadyIn && isActive && handleCheckIn(member.id)}
                    disabled={!isActive || alreadyIn}
                    className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                      alreadyIn
                        ? 'opacity-50 cursor-not-allowed bg-green-500/5'
                        : !isActive
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-orange-500/10 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-black text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-bold">{member.name}</p>
                        <p className="text-gray-500 text-sm">{member.phone}</p>
                      </div>
                    </div>
                    <div>
                      {alreadyIn ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-500">Already In</span>
                      ) : !isActive ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 capitalize">{member.status}</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-500 flex items-center gap-1">
                          <LogIn className="w-3 h-3" /> Check In
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {showDropdown && filteredMembers.length === 0 && searchTerm.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-zinc-800 rounded-2xl border border-white/10 p-6 text-center text-gray-500">
              No members found for "{searchTerm}"
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            {error}
          </div>
        )}
      </div>

      {/* Currently In Gym */}
      <div className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-black text-white uppercase tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Currently In Gym ({activeVisits.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeVisits.length > 0 ? (
                activeVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-black text-xs">
                          {visit.member_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="text-white font-bold">{visit.member_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{visit.member_phone}</td>
                    <td className="px-6 py-4 text-gray-400">{formatTime(visit.check_in)}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-500 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" />
                        {formatDuration(visit.duration_minutes)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCheckOut(visit.id)}
                        className="px-4 py-2 rounded-full bg-red-500/10 text-red-500 font-bold text-xs uppercase hover:bg-red-500/20 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <LogOut className="w-3 h-3" />
                        Check Out
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No members currently in the gym.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's History */}
      <div className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-black text-white uppercase tracking-tight">
            Today's Completed Visits ({todayHistory.length})
          </h2>
          <button
            onClick={() => exportToExcel([...activeVisits, ...todayHistory], [
              { header: 'Member', key: 'member_name' },
              { header: 'Phone', key: 'member_phone' },
              { header: 'Check In', key: 'check_in', transform: (v: any) => new Date(v).toLocaleString() },
              { header: 'Check Out', key: 'check_out', transform: (v: any) => v ? new Date(v).toLocaleString() : 'Still in' },
              { header: 'Duration (min)', key: 'duration_minutes' },
            ], `Sinen_Attendance_${today}`)
            }
            className="flex items-center gap-2 px-4 py-2 border border-orange-500/30 text-orange-500 font-bold text-xs uppercase rounded-full hover:bg-orange-500/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {todayHistory.length > 0 ? (
                todayHistory.map((visit) => (
                  <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{visit.member_name}</td>
                    <td className="px-6 py-4 text-gray-400">{formatTime(visit.check_in)}</td>
                    <td className="px-6 py-4 text-gray-400">{visit.check_out ? formatTime(visit.check_out) : '-'}</td>
                    <td className="px-6 py-4 text-orange-500 font-bold">{formatDuration(visit.duration_minutes)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No completed visits today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
