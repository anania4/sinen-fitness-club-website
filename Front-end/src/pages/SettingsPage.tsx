import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    gymName: '',
    telegramBotToken: '',
    telegramChatId: '',
    reminderDays: '7',
    currency: 'ETB'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) {
        // Settings endpoint doesn't exist yet, use defaults
        setSettings({
          gymName: 'Sinen Fitness Club',
          telegramBotToken: '',
          telegramChatId: '',
          reminderDays: '7',
          currency: 'ETB'
        });
        return;
      }
      const data = await res.json();
      setSettings({
        gymName: data.gymName || 'Sinen Fitness Club',
        telegramBotToken: data.telegramBotToken || '',
        telegramChatId: data.telegramChatId || '',
        reminderDays: data.reminderDays || '7',
        currency: data.currency || 'ETB'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use defaults on error
      setSettings({
        gymName: 'Sinen Fitness Club',
        telegramBotToken: '',
        telegramChatId: '',
        reminderDays: '7',
        currency: 'ETB'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('This will delete ALL data (members, leads, payments, attendance). Are you sure?')) return;
    setResetting(true);
    try {
      await fetch('/api/settings/reset', { method: 'POST' });
      alert('Database reset successfully!');
    } catch (error) {
      console.error('Error resetting database:', error);
      alert('Failed to reset database');
    } finally {
      setResetting(false);
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
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white">Settings</h1>

      <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Gym Name</label>
              <input
                type="text"
                value={settings.gymName}
                onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Currency</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h2 className="text-xl font-black text-white uppercase mb-4">Telegram Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Bot Token</label>
              <input
                type="text"
                value={settings.telegramBotToken}
                onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Enter your Telegram bot token"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Chat ID</label>
              <input
                type="text"
                value={settings.telegramChatId}
                onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Enter your Telegram chat ID"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Reminder Days Before Expiry</label>
              <input
                type="number"
                value={settings.reminderDays}
                onChange={(e) => setSettings({ ...settings, reminderDays: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-black text-red-500 uppercase mb-2">Danger Zone</h2>
            <p className="text-gray-400 text-sm">This action will permanently delete all data from the database.</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-black uppercase rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-5 h-5" />
          {resetting ? 'Resetting...' : 'Reset Database'}
        </button>
      </div>
    </div>
  );
};
