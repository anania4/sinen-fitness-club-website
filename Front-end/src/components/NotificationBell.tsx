import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { API_BASE_URL, apiFetch } from '../config';
import { AnimatePresence, motion } from 'motion/react';

interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  link?: string;
  read: boolean;
}

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [statsRes, expiringRes, leadsRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/dashboard/stats`),
        apiFetch(`${API_BASE_URL}/api/dashboard/expiring-members`),
        apiFetch(`${API_BASE_URL}/api/dashboard/leads`)
      ]);

      const [stats, expiringMembers, leads] = await Promise.all([
        statsRes.json(),
        expiringRes.json(),
        leadsRes.json()
      ]);

      const newNotifications: Notification[] = [];

      // Check for expired members
      const expiredMembers = expiringMembers.filter((m: any) => {
        const expiry = new Date(m.expiry_date);
        return expiry < new Date();
      });

      if (expiredMembers.length > 0) {
        newNotifications.push({
          id: 'expired-members',
          type: 'error',
          title: `${expiredMembers.length} Expired Membership${expiredMembers.length > 1 ? 's' : ''}`,
          message: `${expiredMembers.length} member${expiredMembers.length > 1 ? 's have' : ' has'} expired. Contact for renewal.`,
          timestamp: new Date(),
          link: '/admin/members',
          read: false
        });
      }

      // Check for members expiring in next 3 days
      const criticalExpiring = expiringMembers.filter((m: any) => {
        const expiry = new Date(m.expiry_date);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
      });

      if (criticalExpiring.length > 0) {
        newNotifications.push({
          id: 'critical-expiring',
          type: 'warning',
          title: `${criticalExpiring.length} Expiring in 3 Days`,
          message: `Send renewal reminders urgently.`,
          timestamp: new Date(),
          link: '/admin/members',
          read: false
        });
      }

      // Check for pending leads
      const pendingLeads = leads.filter((l: any) => l.status === 'pending');
      if (pendingLeads.length > 0) {
        newNotifications.push({
          id: 'pending-leads',
          type: 'info',
          title: `${pendingLeads.length} New Lead${pendingLeads.length > 1 ? 's' : ''}`,
          message: `Follow up with trial requests.`,
          timestamp: new Date(),
          link: '/admin/leads',
          read: false
        });
      }

      // Check for members expiring in next 7 days
      const weekExpiring = expiringMembers.filter((m: any) => {
        const expiry = new Date(m.expiry_date);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 3 && diffDays <= 7;
      });

      if (weekExpiring.length > 0) {
        newNotifications.push({
          id: 'week-expiring',
          type: 'info',
          title: `${weekExpiring.length} Expiring This Week`,
          message: `Plan renewal outreach.`,
          timestamp: new Date(),
          link: '/admin/members',
          read: false
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      window.location.href = notification.link;
    }
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-orange-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white relative transition-colors"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-zinc-900 rounded-full text-[10px] text-black flex items-center justify-center font-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-black text-white uppercase text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-orange-500 hover:text-orange-400 font-bold uppercase"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                  <p className="text-gray-600 text-xs mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-orange-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 ${getColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-white text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                        <p className="text-gray-600 text-[10px] mt-2 uppercase tracking-wider">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    window.location.href = '/admin';
                    setIsOpen(false);
                  }}
                  className="text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider"
                >
                  View Dashboard
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
