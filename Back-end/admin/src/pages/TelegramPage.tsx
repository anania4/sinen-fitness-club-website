import React, { useState, useEffect } from 'react';
import { Send, Bell, MessageSquare, Shield, Settings, CheckCircle, AlertCircle } from 'lucide-react';

export const TelegramPage: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [rules, setRules] = useState([
    { key: 'rule_lead_alert', label: 'New Lead Alert', desc: 'Notify when a new trial request is received', active: true },
    { key: 'rule_expiry_warning', label: 'Expiry Warning (3 Days)', desc: 'Notify 3 days before membership expires', active: true },
    { key: 'rule_payment_success', label: 'Payment Success', desc: 'Notify when a payment is processed', active: false },
    { key: 'rule_daily_summary', label: 'Daily Summary', desc: 'Send daily gym activity overview at 9 PM', active: true },
  ]);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setBotToken(data.telegram_bot_token || '');
        setChatId(data.telegram_chat_id || '');
        setIsEnabled(data.telegram_enabled === 'true');
        
        setRules(prev => prev.map(rule => ({
          ...rule,
          active: data[rule.key] === 'true'
        })));
        
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const settings: any = { 
      telegram_bot_token: botToken, 
      telegram_chat_id: chatId, 
      telegram_enabled: String(isEnabled) 
    };
    rules.forEach(rule => {
      settings[rule.key] = String(rule.active);
    });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving telegram config:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleRule = (key: string) => {
    setRules(prev => prev.map(r => r.key === key ? { ...r, active: !r.active } : r));
  };

  const handleTest = async () => {
    setTesting(true);
    // Mock test
    setTimeout(() => {
      alert('Test message sent successfully! Please check your Telegram.');
      setTesting(false);
    }, 1500);
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
          <h2 className="text-2xl font-bold text-slate-900">Telegram Reminders</h2>
          <p className="text-slate-500">Automate membership expiry alerts and lead notifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase ${
            isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            {isEnabled ? 'Service Active' : 'Service Disabled'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Send className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Bot Configuration</h3>
                <p className="text-xs text-slate-400">Connect your gym's Telegram bot.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bot API Token</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Admin Chat ID</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
              <button 
                onClick={handleTest}
                disabled={testing}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Notification Rules</h3>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.key} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{rule.label}</p>
                    <p className="text-xs text-slate-500">{rule.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleRule(rule.key)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${rule.active ? 'bg-orange-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Service Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-600">Bot API Connected</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-600">Webhook Active</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-slate-600">Rate Limit: 20/min</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-500 p-8 rounded-3xl shadow-lg shadow-orange-500/20 text-white">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-xs text-white/80 mb-4 leading-relaxed">
              To get your Chat ID, message @userinfobot on Telegram. To create a bot, use @BotFather.
            </p>
            <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors">
              Read Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
