import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    gym_name: '',
    gym_phone: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    reminder_days: 7,
    auto_reminders_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/1/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        alert('✅ Settings saved successfully!');
      } else {
        alert('❌ Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
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
                value={settings.gym_name}
                onChange={(e) => setSettings({ ...settings, gym_name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Gym Phone</label>
              <input
                type="text"
                value={settings.gym_phone || ''}
                onChange={(e) => setSettings({ ...settings, gym_phone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="e.g., +251912345678"
              />
              <p className="text-xs text-gray-500 mt-1">This will be included in Telegram reminders</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-black text-white uppercase">Telegram Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Bot Token</label>
              <input
                type="text"
                value={settings.telegram_bot_token || ''}
                onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-sm"
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
              <p className="text-xs text-gray-500 mt-1">Get this from @BotFather on Telegram</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Chat ID</label>
              <input
                type="text"
                value={settings.telegram_chat_id || ''}
                onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-sm"
                placeholder="-1001234567890"
              />
              <p className="text-xs text-gray-500 mt-1">Your group/channel chat ID where reminders will be sent</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Reminder Days Before Expiry</label>
              <input
                type="number"
                value={settings.reminder_days}
                onChange={(e) => setSettings({ ...settings, reminder_days: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Reminders sent at D-3, D-1, D-day, and D+1, D+2, D+3</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto_reminders"
                checked={settings.auto_reminders_enabled}
                onChange={(e) => setSettings({ ...settings, auto_reminders_enabled: e.target.checked })}
                className="w-5 h-5 rounded border-white/10 bg-black/50 text-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <label htmlFor="auto_reminders" className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Enable Automatic Reminders
              </label>
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

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-black text-blue-500 uppercase mb-2">How to Set Up Telegram Bot</h3>
            <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
              <li>Open Telegram and search for @BotFather</li>
              <li>Send /newbot and follow instructions to create your bot</li>
              <li>Copy the bot token and paste it above</li>
              <li>Add your bot to a group or channel</li>
              <li>Get the chat ID using @userinfobot or similar tools</li>
              <li>Paste the chat ID above and save settings</li>
              <li>Test your configuration in the Telegram page</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
