import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL, apiFetch } from '../config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewMemberModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [plan, setPlan] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [status, setStatus] = useState('active');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      apiFetch(`${API_BASE_URL}/api/plans/`)
        .then(res => res.json())
        .then(data => {
          const plansArray = Array.isArray(data) ? data : (data.results || []);
          setPlans(plansArray);
          if (plansArray.length > 0 && !plan) setPlan(plansArray[0].name);
        });
    }
  }, [isOpen]);

  // Auto-calculate expiry date when start date or plan changes
  useEffect(() => {
    if (startDate && plan) {
      const selectedPlan = plans.find(p => p.name === plan);
      if (selectedPlan) {
        const start = new Date(startDate);
        let expiry = new Date(start);
        
        // Calculate expiry based on plan duration
        if (selectedPlan.duration === 'Monthly') {
          expiry.setMonth(expiry.getMonth() + 1);
        } else if (selectedPlan.duration === 'Quarterly') {
          expiry.setMonth(expiry.getMonth() + 3);
        } else if (selectedPlan.duration === 'Annual') {
          expiry.setFullYear(expiry.getFullYear() + 1);
        }
        
        // Format date as YYYY-MM-DD
        const formattedDate = expiry.toISOString().split('T')[0];
        setExpiryDate(formattedDate);
      }
    }
  }, [startDate, plan, plans]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (emergencyContact) formData.append('emergency_contact', emergencyContact);
      formData.append('plan', plan);
      formData.append('start_date', startDate);
      formData.append('expiry_date', expiryDate);
      formData.append('payment_status', paymentStatus);
      formData.append('status', status);
      if (profilePhoto) formData.append('profile_photo', profilePhoto);

      const res = await apiFetch(`${API_BASE_URL}/api/members/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error:', errorData);
        alert(`Failed to add member: ${JSON.stringify(errorData)}`);
        return;
      }
      
      onSuccess();
      onClose();
      // Reset form
      setName('');
      setPhone('');
      setEmergencyContact('');
      setStartDate('');
      setExpiryDate('');
      setPaymentStatus('pending');
      setStatus('active');
      setProfilePhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-900 rounded-[2rem] shadow-xl w-full max-w-md overflow-hidden border border-white/10"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase">Add New Member</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Profile Photo (Optional)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden border-2 border-white/10 flex-shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <span className="text-xs">No img</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-500 hover:file:bg-orange-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="e.g. Alex Johnson"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="0911234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="0911234567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Membership Plan *</label>
                <select
                  required
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="">Select a plan</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.name}>{p.name} - {parseFloat(p.price).toLocaleString()} ETB</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Start Date *</label>
                  <input
                    required
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Expiry Date * (Auto-calculated)</label>
                  <input
                    required
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Calculated based on plan duration. You can adjust if needed.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Payment Status *</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Membership Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="active">Active - Can access gym</option>
                    <option value="expired">Expired - Needs renewal</option>
                    <option value="suspended">Suspended - Temporarily blocked</option>
                    <option value="frozen">Frozen - Paused membership</option>
                  </select>
                </div>
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
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
