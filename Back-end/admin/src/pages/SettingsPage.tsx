import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Globe, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Account Profile');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    gym_name: '',
    gym_email: '',
    gym_phone: '',
    gym_address: ''
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setFormData({
          gym_name: data.gym_name || 'Elite Fitness Center',
          gym_email: data.gym_email || 'owner@elitefitness.com',
          gym_phone: data.gym_phone || '+1 (555) 000-1234',
          gym_address: data.gym_address || '123 Fitness Ave, Muscle City'
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all data? This will delete all members, leads, payments, and attendance records.')) return;
    try {
      const res = await fetch('/api/settings/reset', { method: 'POST' });
      if (res.ok) {
        alert('All data has been reset.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error resetting data:', error);
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
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
        <p className="text-slate-500">Global configuration and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {[
            { icon: User, label: 'Account Profile', active: true },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Security & Privacy', active: false },
            { icon: CreditCard, label: 'Billing & Plans', active: false },
            { icon: Globe, label: 'Localization', active: false },
            { icon: Database, label: 'Data & Backup' },
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === item.label 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gym Name</label>
                <input 
                  type="text" 
                  value={formData.gym_name}
                  onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Email</label>
                <input 
                  type="email" 
                  value={formData.gym_email}
                  onChange={(e) => setFormData({ ...formData, gym_email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.gym_phone}
                  onChange={(e) => setFormData({ ...formData, gym_phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
                <input 
                  type="text" 
                  value={formData.gym_address}
                  onChange={(e) => setFormData({ ...formData, gym_address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Danger Zone</h3>
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-rose-900 text-sm">Delete Account</p>
                <p className="text-xs text-rose-600">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl text-xs hover:bg-rose-600 transition-colors"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
