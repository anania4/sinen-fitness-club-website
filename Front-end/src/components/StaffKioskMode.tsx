import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  Clock, 
  LogIn, 
  LogOut, 
  Keyboard,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Shield
} from 'lucide-react';
import { apiFetch } from '../config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  fitness_group: string;
  staff_id?: string;
  profile_photo?: string;
}

interface AttendanceRecord {
  id: number;
  staff: number;
  staff_name: string;
  check_in_time?: string;
  check_out_time?: string;
  shift_type_name: string;
  status: string;
}

interface KioskModeProps {
  onExit: () => void;
}

const StaffKioskMode: React.FC<KioskModeProps> = ({ onExit }) => {
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'pin' | 'action' | 'success' | 'error'>('pin');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  // Auto-reset after success/error
  useEffect(() => {
    if (step === 'success' || step === 'error') {
      const timer = setTimeout(() => {
        resetKiosk();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const resetKiosk = () => {
    setPin('');
    setStep('pin');
    setSelectedStaff(null);
    setCurrentRecord(null);
    setMessage('');
    setLoading(false);
  };

  const handlePinSubmit = async () => {
    if (!pin.trim()) return;
    
    setLoading(true);
    try {
      // Verify PIN and get staff info
      const res = await apiFetch(`${API_BASE_URL}/api/staff/verify-pin/`, {
        method: 'POST',
        body: JSON.stringify({ pin })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Invalid PIN');
        setStep('error');
        return;
      }
      
      const data = await res.json();
      setSelectedStaff(data.staff);
      
      // Check current attendance status
      const today = new Date().toISOString().split('T')[0];
      const attendanceRes = await apiFetch(`${API_BASE_URL}/api/staff-attendance/?staff=${data.staff.id}&date=${today}&checked_in=true`);
      const attendanceData = await attendanceRes.json();
      const records = Array.isArray(attendanceData) ? attendanceData : (attendanceData.results || []);
      
      setCurrentRecord(records.length > 0 ? records[0] : null);
      setStep('action');
    } catch (error) {
      console.error('Error verifying PIN:', error);
      setMessage('System error. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/staff-attendance/kiosk-check-in/`, {
        method: 'POST',
        body: JSON.stringify({ 
          pin: pin,
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Check-in failed');
        setStep('error');
        return;
      }
      
      const data = await res.json();
      setMessage(`Welcome ${data.staff_name}! You are now checked in for ${data.shift}.`);
      setStep('success');
    } catch (error) {
      console.error('Error checking in:', error);
      setMessage('Check-in failed. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/staff-attendance/kiosk-check-out/`, {
        method: 'POST',
        body: JSON.stringify({ 
          pin: pin,
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Check-out failed');
        setStep('error');
        return;
      }
      
      const data = await res.json();
      setMessage(`Goodbye ${data.staff_name}! You are now checked out.`);
      setStep('success');
    } catch (error) {
      console.error('Error checking out:', error);
      setMessage('Check-out failed. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (step === 'pin') {
      if (key === 'Enter') {
        handlePinSubmit();
      } else if (key === 'Backspace') {
        setPin(prev => prev.slice(0, -1));
      } else if (key.length === 1 && /\d/.test(key)) {
        setPin(prev => prev + key);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/sinen_logo.png" alt="Sinen Fitness" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic">
                Sinen <span className="text-orange-500">Attendance</span>
              </h1>
              <p className="text-gray-400 text-sm">Staff Check-in Kiosk</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-black text-white">{formatTime(currentTime)}</div>
            <div className="text-gray-400 text-sm">{formatDate(currentTime)}</div>
          </div>
          
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Kiosk
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          
          {/* PIN Input */}
          {step === 'pin' && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <UserCheck className="w-24 h-24 text-orange-500 mx-auto" />
                <h2 className="text-4xl font-black text-white">Enter Your PIN</h2>
                <p className="text-gray-400 text-lg">Please enter your 4-6 digit PIN to continue</p>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                    placeholder="••••"
                    className="w-full text-center text-3xl font-black py-6 px-8 rounded-3xl border-2 border-white/20 bg-zinc-900 text-white focus:outline-none focus:border-orange-500 transition-all"
                    maxLength={6}
                  />
                </div>
                
                <button
                  onClick={handlePinSubmit}
                  disabled={!pin.trim() || loading}
                  className="w-full py-4 px-8 bg-orange-500 text-black font-black text-xl uppercase rounded-3xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Check In/Out Action */}
          {step === 'action' && selectedStaff && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-white">Welcome, {selectedStaff.name}!</h2>
                <p className="text-gray-400 text-lg">{selectedStaff.role}</p>
                <div className="bg-zinc-800 rounded-2xl p-4 inline-block">
                  <p className="text-orange-500 font-bold text-sm">Staff ID: {selectedStaff.staff_id}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {currentRecord ? (
                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-green-500" />
                        <span className="text-green-500 font-bold">Currently Checked In</span>
                      </div>
                      <p className="text-white text-lg">
                        Since: {new Date(currentRecord.check_in_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-gray-400">Shift: {currentRecord.shift_type_name}</p>
                    </div>
                    
                    <button
                      onClick={handleCheckOut}
                      disabled={loading}
                      className="w-full py-6 px-8 bg-red-500 text-white font-black text-2xl uppercase rounded-3xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <LogOut className="w-8 h-8" />
                      {loading ? 'Checking Out...' : 'Check Out'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="w-full py-6 px-8 bg-green-500 text-white font-black text-2xl uppercase rounded-3xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <LogIn className="w-8 h-8" />
                    {loading ? 'Checking In...' : 'Check In'}
                  </button>
                )}
                
                <button
                  onClick={resetKiosk}
                  className="w-full py-4 px-8 border-2 border-white/20 text-white font-black text-xl uppercase rounded-3xl hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                <h2 className="text-4xl font-black text-green-500">Success!</h2>
                <p className="text-white text-xl">{message}</p>
                <p className="text-gray-400">Returning to main screen...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {step === 'error' && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <XCircle className="w-24 h-24 text-red-500 mx-auto" />
                <h2 className="text-4xl font-black text-red-500">Error</h2>
                <p className="text-white text-xl">{message}</p>
                <p className="text-gray-400">Returning to main screen...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Virtual Keyboard for PIN (optional) */}
      {step === 'pin' && (
        <div className="bg-zinc-900 border-t border-white/10 p-6">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Clear', 0, 'Enter'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'Clear') {
                      setPin('');
                    } else if (key === 'Enter') {
                      handlePinSubmit();
                    } else {
                      handleKeyPress(key.toString());
                    }
                  }}
                  className="py-4 px-6 bg-zinc-800 text-white font-black text-xl rounded-2xl hover:bg-zinc-700 transition-colors border border-white/10"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffKioskMode;