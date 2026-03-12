import React from 'react';
import { X, Phone, Calendar, CreditCard, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Member } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onEdit: () => void;
}

export const MemberDetailsModal: React.FC<Props> = ({ isOpen, onClose, member, onEdit }) => {
  if (!member) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'expired': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'frozen': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'overdue': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-900 rounded-[2rem] shadow-xl w-full max-w-2xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-transparent">
              <div>
                <h3 className="text-2xl font-black text-white uppercase">{member.name}</h3>
                <p className="text-sm text-gray-400 mt-1">Member ID: #{member.id}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${getStatusColor(member.status)}`}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Membership Status</p>
                  <p className="text-2xl font-black uppercase">{member.status}</p>
                </div>
                <div className={`p-4 rounded-2xl ${getPaymentStatusColor(member.payment_status)}`}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Payment Status</p>
                  <p className="text-2xl font-black uppercase">{member.payment_status}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-black/30 rounded-2xl p-6 space-y-4">
                <h4 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" />
                      {member.phone}
                    </p>
                  </div>
                  {member.emergency_contact && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Emergency Contact</p>
                      <p className="text-white font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        {member.emergency_contact}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Details */}
              <div className="bg-black/30 rounded-2xl p-6 space-y-4">
                <h4 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  Membership Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Plan</p>
                    <p className="text-white font-bold text-lg">{member.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      {new Date(member.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Expiry Date</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      {new Date(member.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Days Remaining</p>
                    <p className="text-white font-bold text-lg">
                      {Math.max(0, Math.ceil((new Date(member.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                    </p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="text-center text-sm text-gray-500">
                Member since {new Date(member.created_at || member.start_date).toLocaleDateString()}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-full border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { onClose(); onEdit(); }}
                className="flex-1 px-4 py-3 rounded-full bg-orange-500 text-black font-black uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                Edit Member
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
