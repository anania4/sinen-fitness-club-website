import React, { useEffect, useState } from 'react';
import { Lead } from '../types';
import { Search, Phone, Mail, Calendar, UserPlus, CheckCircle, Clock, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', goal: 'Weight Loss', preferred_time: 'Morning' });

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewLead({ name: '', phone: '', goal: 'Weight Loss', preferred_time: 'Morning' });
        fetchLeads();
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
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
          <h2 className="text-2xl font-bold text-slate-900">Leads & Inquiries</h2>
          <p className="text-slate-500">Track and follow up with potential new members.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Add New Lead</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddLead} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Lead Name</label>
                  <input
                    required
                    type="text"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fitness Goal</label>
                  <select
                    value={newLead.goal}
                    onChange={(e) => setNewLead({ ...newLead, goal: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>General Fitness</option>
                    <option>Athletic Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={newLead.preferred_time}
                    onChange={(e) => setNewLead({ ...newLead, preferred_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-orange-500" />
            </div>
            <h4 className="font-bold text-slate-900">Total Leads</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">{leads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <h4 className="font-bold text-slate-900">Pending</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {leads.filter(l => l.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="font-bold text-slate-900">Contacted</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {leads.filter(l => l.status === 'contacted').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fitness Goal</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pref. Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{lead.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{lead.goal}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{lead.preferred_time}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(lead.id, lead.status)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all hover:scale-105 active:scale-95 ${
                          lead.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lead.status}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
