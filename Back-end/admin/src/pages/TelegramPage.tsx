import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Users, Settings as SettingsIcon } from 'lucide-react';

interface TelegramSettings {
  botToken: string;
  chatId: string;
  reminderDays: string;
}

export const TelegramPage: React.FC = () => {
  const [settings, setSettings] = useState<TelegramSettings>({ botToken: '', chatId: '', reminderDays: '7' });
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings({
        botToken: data.telegramBotToken || '',
        chatId: data.telegramChatId || '',
        reminderDays: data.reminderDays || '7'
      });
      setConfigured(!!(data.telegramBotToken && data.telegramChatId));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSendTest = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      // This would call a Telegram API endpoint - placeholder for now
      alert('Test message sent! (Note: Telegram integration needs to be implemented on backend)');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black uppercase italic text-white">Telegram Reminders</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Reminder Days</h3>
          </div>
          <p className="text-3xl font-black text-white">{settings.reminderDays}</p>
          <p className="text-xs text-gray-500 mt-1">Days before expiry</p>
        </div>

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
            <Send className="w-6 h-6 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Auto Reminders</h3>
          </div>
          <p className="text-xl font-black text-white">Enabled</p>
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
        <h2 className="text-xl font-black text-white uppercase mb-4">How It Works</h2>
        <div className="space-y-3 text-gray-400 text-sm">
          <p>• Automatic reminders are sent to members {settings.reminderDays} days before their membership expires</p>
          <p>• Messages are sent via Telegram bot to the configured chat</p>
          <p>• Configure your bot token and chat ID in Settings to enable this feature</p>
          <p>• Test your configuration using the form above</p>
        </div>
      </div>
    </div>
  );
};
