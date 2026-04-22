import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  Clock, 
  LogIn, 
  LogOut, 
  Search, 
  Download,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Settings as SettingsIcon,
  Monitor,
  BarChart3,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { apiFetch } from '../config';
import { exportToExcel } from '../utils/exportToExcel';
import StaffKioskMode from '../components/StaffKioskMode';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  fitness_group: string;
}

interface ShiftType {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  grace_period_minutes: number;
  is_active: boolean;
}

interface ShiftAssignment {
  id: number;
  staff: number;
  staff_name: string;
  assignment_date: string;
  shift_type: number;
  shift_type_name: string;
  shift_start_time: string;
  shift_end_time: string;
  assigned_by: string;
  assigned_at: string;
  override_reason?: string;
}

interface StaffAttendanceRecord {
  id: number;
  staff: number;
  staff_name: string;
  staff_role: string;
  attendance_date: string;
  assigned_shift_type: number;
  shift_type_name: string;
  shift_start_time: string;
  shift_end_time: string;
  check_in_time?: string;
  check_out_time?: string;
  status: 'present' | 'late' | 'early_leave' | 'absent' | 'incomplete' | 'excessive_duration';
  notes?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

interface DailySummary {
  date: string;
  shift_summaries: {
    shift_type_name: string;
    total_assigned: number;
    present: number;
    late: number;
    early_leave: number;
    absent: number;
    incomplete: number;
  }[];
}

const StaffAttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'check-in' | 'assignments' | 'records' | 'reports'>('overview');
  const [showKiosk, setShowKiosk] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [todayAssignments, setTodayAssignments] = useState<ShiftAssignment[]>([]);
  const [todayRecords, setTodayRecords] = useState<StaffAttendanceRecord[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const [staffRes, shiftsRes, assignmentsRes, recordsRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/team/`),
        apiFetch(`${API_BASE_URL}/api/shift-types/`),
        apiFetch(`${API_BASE_URL}/api/shift-assignments/?date=${selectedDate}`),
        apiFetch(`${API_BASE_URL}/api/staff-attendance/?date=${selectedDate}`)
      ]);

      const staffData = await staffRes.json();
      const shiftsData = await shiftsRes.json();
      const assignmentsData = await assignmentsRes.json();
      const recordsData = await recordsRes.json();

      setStaffMembers(Array.isArray(staffData) ? staffData : (staffData.results || []));
      setShiftTypes(Array.isArray(shiftsData) ? shiftsData : (shiftsData.results || []));
      setTodayAssignments(Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData.results || []));
      setTodayRecords(Array.isArray(recordsData) ? recordsData : (recordsData.results || []));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/staff-attendance/daily-summary/?date=${selectedDate}`);
      const data = await res.json();
      setDailySummary(data);
    } catch (err) {
      console.error('Error fetching daily summary:', err);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === 'reports') {
      fetchDailySummary();
    }
  }, [selectedDate, activeTab]);

  const handleCheckIn = async (staffId: number, shiftTypeId: number) => {
    setError('');
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/staff-attendance/check-in/`, {
        method: 'POST',
        body: JSON.stringify({ 
          staff_id: staffId, 
          shift_type_id: shiftTypeId,
          date: selectedDate 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Check-in failed');
        return;
      }
      
      fetchData();
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleCheckOut = async (recordId: number) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/staff-attendance/${recordId}/check-out/`, {
        method: 'POST',
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error checking out:', err);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatShiftTime = (timeString: string) => {
    if (!timeString) return '-';
    return timeString.slice(0, 5); // HH:MM format
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-500 bg-green-500/20';
      case 'late': return 'text-yellow-500 bg-yellow-500/20';
      case 'early_leave': return 'text-orange-500 bg-orange-500/20';
      case 'absent': return 'text-red-500 bg-red-500/20';
      case 'incomplete': return 'text-blue-500 bg-blue-500/20';
      case 'excessive_duration': return 'text-purple-500 bg-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      case 'early_leave': return <LogOut className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'incomplete': return <AlertCircle className="w-4 h-4" />;
      case 'excessive_duration': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAssignedStaffForShift = (shiftTypeId: number) => {
    return todayAssignments.filter(assignment => assignment.shift_type === shiftTypeId);
  };

  const getRecordForStaffShift = (staffId: number, shiftTypeId: number) => {
    return todayRecords.find(record => 
      record.staff === staffId && record.assigned_shift_type === shiftTypeId
    );
  };

  const isStaffCheckedIn = (staffId: number) => {
    return todayRecords.some(record => 
      record.staff === staffId && record.check_in_time && !record.check_out_time
    );
  };

  if (showKiosk) {
    return <StaffKioskMode onExit={() => setShowKiosk(false)} />;
  }

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
          <UserCheck className="w-8 h-8 text-orange-500" />
          Staff Attendance
        </h1>
        
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <button
            onClick={() => setShowKiosk(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-bold text-sm uppercase rounded-full hover:bg-orange-600 transition-colors"
          >
            <Monitor className="w-4 h-4" />
            Kiosk Mode
          </button>
          <div className="bg-zinc-900 rounded-2xl border border-white/10 px-6 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white font-black text-xl">
              {todayRecords.filter(r => r.check_in_time && !r.check_out_time).length}
            </span>
            <span className="text-gray-400 text-sm uppercase tracking-wider font-bold">On Duty</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-zinc-900 rounded-2xl border border-white/10 p-2">
        <div className="flex gap-2">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'check-in', label: 'Check In/Out', icon: LogIn },
            { key: 'assignments', label: 'Shift Assignments', icon: Calendar },
            { key: 'records', label: 'Attendance Records', icon: Users },
            { key: 'reports', label: 'Reports', icon: SettingsIcon }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
          {error}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Total Staff</p>
                  <p className="text-3xl font-black text-white">{staffMembers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">On Duty</p>
                  <p className="text-3xl font-black text-green-500">
                    {todayRecords.filter(r => r.check_in_time && !r.check_out_time).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Present Today</p>
                  <p className="text-3xl font-black text-orange-500">
                    {todayRecords.filter(r => r.status === 'present').length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Absent</p>
                  <p className="text-3xl font-black text-red-500">
                    {todayRecords.filter(r => r.status === 'absent').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-black text-white uppercase tracking-tight">
                Current Status - {selectedDate}
              </h2>
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-orange-500 border border-orange-500/30 rounded-full hover:bg-orange-500/10 transition-colors font-bold text-xs uppercase"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check Out</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {todayRecords.length > 0 ? (
                    todayRecords.map(record => {
                      const duration = record.check_in_time && record.check_out_time 
                        ? Math.floor((new Date(record.check_out_time).getTime() - new Date(record.check_in_time).getTime()) / (1000 * 60))
                        : record.check_in_time 
                        ? Math.floor((new Date().getTime() - new Date(record.check_in_time).getTime()) / (1000 * 60))
                        : 0;
                      
                      return (
                        <tr key={record.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs">
                                {record.staff_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-bold">{record.staff_name}</p>
                                <p className="text-gray-500 text-xs">{record.staff_role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{record.shift_type_name}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {record.check_in_time ? formatTime(record.check_in_time) : '-'}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {record.check_out_time ? formatTime(record.check_out_time) : 
                             record.check_in_time ? 'Working...' : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              {record.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {duration > 0 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No attendance records for {selectedDate}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'check-in' && (
        <div className="space-y-6">
          {shiftTypes.filter(shift => shift.is_active).map(shift => {
            const assignedStaff = getAssignedStaffForShift(shift.id);
            
            return (
              <div key={shift.id} className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="font-black text-white uppercase tracking-tight flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      {shift.name}
                    </h2>
                    <span className="text-gray-400 text-sm">
                      {formatShiftTime(shift.start_time)} - {formatShiftTime(shift.end_time)}
                    </span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/50 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Staff</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {assignedStaff.length > 0 ? (
                        assignedStaff.map(assignment => {
                          const staff = staffMembers.find(s => s.id === assignment.staff);
                          const record = getRecordForStaffShift(assignment.staff, shift.id);
                          const isCheckedIn = record?.check_in_time && !record?.check_out_time;
                          
                          return (
                            <tr key={`${assignment.staff}-${shift.id}`} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs">
                                    {assignment.staff_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </div>
                                  <span className="text-white font-bold">{assignment.staff_name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-400">{staff?.role}</td>
                              <td className="px-6 py-4 text-gray-400">
                                {record?.check_in_time ? formatTime(record.check_in_time) : '-'}
                              </td>
                              <td className="px-6 py-4 text-gray-400">
                                {record?.check_out_time ? formatTime(record.check_out_time) : '-'}
                              </td>
                              <td className="px-6 py-4">
                                {record?.status && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                                    {getStatusIcon(record.status)}
                                    {record.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {!record?.check_in_time ? (
                                  <button
                                    onClick={() => handleCheckIn(assignment.staff, shift.id)}
                                    className="px-4 py-2 rounded-full bg-green-500/10 text-green-500 font-bold text-xs uppercase hover:bg-green-500/20 transition-colors flex items-center gap-1 ml-auto"
                                  >
                                    <LogIn className="w-3 h-3" />
                                    Check In
                                  </button>
                                ) : isCheckedIn ? (
                                  <button
                                    onClick={() => handleCheckOut(record.id)}
                                    className="px-4 py-2 rounded-full bg-red-500/10 text-red-500 font-bold text-xs uppercase hover:bg-red-500/20 transition-colors flex items-center gap-1 ml-auto"
                                  >
                                    <LogOut className="w-3 h-3" />
                                    Check Out
                                  </button>
                                ) : (
                                  <span className="text-gray-500 text-xs">Completed</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No staff assigned to this shift for {selectedDate}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-black text-white uppercase tracking-tight">
              Shift Assignments for {selectedDate}
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-bold text-xs uppercase rounded-full hover:bg-orange-600 transition-colors">
              <Plus className="w-4 h-4" />
              Add Assignment
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Assigned By</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Assigned At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {todayAssignments.length > 0 ? (
                  todayAssignments.map(assignment => (
                    <tr key={assignment.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-bold">{assignment.staff_name}</td>
                      <td className="px-6 py-4 text-gray-400">{assignment.shift_type_name}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatShiftTime(assignment.shift_start_time)} - {formatShiftTime(assignment.shift_end_time)}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{assignment.assigned_by}</td>
                      <td className="px-6 py-4 text-gray-400">{formatTime(assignment.assigned_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No shift assignments for {selectedDate}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-black text-white uppercase tracking-tight">
              Attendance Records for {selectedDate}
            </h2>
            <button
              onClick={() => exportToExcel(todayRecords, [
                { header: 'Staff', key: 'staff_name' },
                { header: 'Role', key: 'staff_role' },
                { header: 'Shift', key: 'shift_type_name' },
                { header: 'Check In', key: 'check_in_time', transform: (v: any) => v ? new Date(v).toLocaleString() : '-' },
                { header: 'Check Out', key: 'check_out_time', transform: (v: any) => v ? new Date(v).toLocaleString() : '-' },
                { header: 'Status', key: 'status' },
                { header: 'Notes', key: 'notes' },
              ], `Staff_Attendance_${selectedDate}`)}
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
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {todayRecords.length > 0 ? (
                  todayRecords.map(record => (
                    <tr key={record.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs">
                            {record.staff_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-bold">{record.staff_name}</p>
                            <p className="text-gray-500 text-xs">{record.staff_role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{record.shift_type_name}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {record.check_in_time ? formatTime(record.check_in_time) : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {record.check_out_time ? formatTime(record.check_out_time) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{record.notes || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No attendance records for {selectedDate}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && dailySummary && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-[2rem] border border-white/10 p-6">
            <h2 className="font-black text-white uppercase tracking-tight mb-6">
              Daily Summary for {selectedDate}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailySummary.shift_summaries.map((summary, index) => (
                <div key={index} className="bg-black/50 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">{summary.shift_type_name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{summary.total_assigned}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Assigned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-green-500">{summary.present}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-yellow-500">{summary.late}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Late</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-red-500">{summary.absent}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Absent</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-500">Early Leave: {summary.early_leave}</span>
                      <span className="text-blue-500">Incomplete: {summary.incomplete}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendancePage;