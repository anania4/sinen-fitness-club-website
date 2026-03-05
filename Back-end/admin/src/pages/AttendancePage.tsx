import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Search, UserCheck, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  member_id: number;
  member_name: string;
  date: string;
  time: string;
}

interface Member {
  id: number;
  name: string;
  status: string;
}

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, memRes] = await Promise.all([
        fetch('/api/attendance'),
        fetch('/api/members')
      ]);
      const recData = await recRes.json();
      const memData = await memRes.json();
      setRecords(recData);
      setMembers(memData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (member: Member) => {
    setMarking(true);
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: member.id,
          member_name: member.name,
          date,
          time
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setMarking(false);
    }
  };

  const deleteRecord = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting attendance record:', error);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.status === 'active'
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance</h2>
          <p className="text-slate-500 mt-1">Track daily member check-ins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Check-in Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              Quick Check-in
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <span className="font-medium text-slate-700">{member.name}</span>
                    <button
                      disabled={marking}
                      onClick={() => markAttendance(member)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      Check-in
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-slate-400 text-sm">No active members found</p>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Logs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Recent Check-ins
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarIcon className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Member Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading records...</td>
                    </tr>
                  ) : records.length > 0 ? (
                    records.map((record) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={record.id} 
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">{record.member_name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                          {record.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            Present
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => deleteRecord(record.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No attendance records for today</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
