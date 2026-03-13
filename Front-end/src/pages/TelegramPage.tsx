import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Users, Settings as SettingsIcon, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface TelegramSettings {
  telegram_bot_token: string;
  telegram_chat_id: string;
  reminder_days: number;
  auto_reminders_enabled: boolean;
  gym_phone: string;
  gym_name: string;
}

interface TelegramStats {
  configured: boolean;
  auto_reminders_enabled: boolean;
  sent_today: number;
  successful_today: number;
  failed_today: number;
  total_sent: number;
  total_successful: number;
  success_rate: number;
}

export const TelegramPage: React.FC = () => {
  const [settings, setSettings] = useState<TelegramSettings>({
    telegram_bot_token: '',
    telegram_chat_id: '',
    reminder_days: 7,
    auto_reminders_enabled: true,
    gym_phone: '',
    gym_name: 'Sinen Gym'
  });
  const [stats, setStats] = useState<TelegramStats | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setConfigured(!!(data.telegram_bot_token && data.telegram_chat_id));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/telegram/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendTest = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/telegram/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('✅ Test message sent successfully!');
        setMessage('');
        fetchStats();
      } else {
        alert(`❌ Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendReminders = async () => {
    if (!confirm('Send reminders to all eligible members now?')) return;
    
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/telegram/send-reminders`, {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ Sent ${data.sent} reminders successfully!`);
        fetchStats();
      } else {
        alert(`❌ Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Failed to send reminders');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-white">Telegram Reminders</h1>
        <button
          onClick={handleSendReminders}
          disabled={!configured || sending}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-bold uppercase rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm"
        >
          <Send className="w-4 h-4" />
          Send Reminders Now
        </button>
      </div>

      {!configured && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-[2rem] p-6">
          <div className="flex items-start gap-3">
            <SettingsIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-black text-orange-500 uppercase mb-2">Configuration Required</h3>
              <p className="text-gray-400 text-sm mb-3">
                Please configure your Telegram bot token and chat ID in Settings to enable reminders.
              </p>
              <a
                href="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-bold uppercase rounded-full hover:bg-orange-600 transition-colors text-sm"
              >
                Go to Settings
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bot Status</h3>
          </div>
          <p className="text-xl font-black text-white">{configured ? 'Configured' : 'Not Set'}</p>
          <p className="text-xs text-gray-500 mt-1">{configured ? 'Ready to send' : 'Configure in settings'}</p>
        </div>

        <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sent Today</h3>
          </div>
          <p className="text-3xl font-black text-white">{stats?.sent_today || 0}</p>
          <p className="text-xs text-gray-500 mt-1">{stats?.successful_today || 0} successful</p>
        </div>

        <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Sent</h3>
          </div>
          <p className="text-3xl font-black text-white">{stats?.total_sent || 0}</p>
          <p className="text-xs text-gray-500 mt-1">{stats?.success_rate || 0}% success rate</p>
        </div>

        <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Auto Reminders</h3>
          </div>
          <p className="text-xl font-black text-white">{settings.auto_reminders_enabled ? 'Enabled' : 'Disabled'}</p>
          <p className="text-xs text-gray-500 mt-1">Automatic notifications</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
        <h2 className="text-xl font-black text-white uppercase mb-4">Send Test Message</h2>
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Type your test message here..."
            disabled={!configured}
            className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSendTest}
            disabled={!configured || sending || !message.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-black uppercase rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
          >
            <Send className="w-5 h-5" />
            {sending ? 'Sending...' : 'Send Test'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
        <h2 className="text-xl font-black text-white uppercase mb-4">Reminder Schedule</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
            <div className="text-orange-500 font-black text-sm">D-3</div>
            <div className="flex-1">
              <p className="text-white text-sm">"Hi [Name], your membership expires in 3 days. Renew to continue access."</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
            <div className="text-orange-500 font-black text-sm">D-1</div>
            <div className="flex-1">
              <p className="text-white text-sm">"Hi [Name], your membership expires tomorrow. Renew now!"</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
            <div className="text-orange-500 font-black text-sm">D-day</div>
            <div className="flex-1">
              <p className="text-white text-sm">"Hi [Name], your membership expires today. Don't lose access!"</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
            <div className="text-red-500 font-black text-sm">D+1,2,3</div>
            <div className="flex-1">
              <p className="text-white text-sm">"Hi [Name], your membership has expired. Renew to reactivate your membership."</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
        <h2 className="text-xl font-black text-white uppercase mb-4">How It Works</h2>
        <div className="space-y-3 text-gray-400 text-sm">
          <p>• Automatic reminders are sent based on membership expiry dates</p>
          <p>• Messages are sent via Telegram bot to the configured chat</p>
          <p>• Configure your bot token and chat ID in Settings to enable this feature</p>
          <p>• Test your configuration using the form above</p>
          <p>• Reminders are sent at D-3, D-1, D-day, and D+1, D+2, D+3 days</p>
        </div>
      </div>
    </div>
  );
};
