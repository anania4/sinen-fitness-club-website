import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, TrendingUp, Users, DollarSign, X } from 'lucide-react';
import { Member, Lead } from '../types';

interface Notification {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Props {
  expiringMembers: Member[];
  leads: Lead[];
  stats: {
    totalMembers: number;
    activeMembers: number;
    expiringSoon: number;
    newLeads: number;
  } | null;
  onDismiss?: (id: string) => void;
}

export const DashboardNotifications: React.FC<Props> = ({ expiringMembers, leads, stats, onDismiss }) => {
  const [dismissedIds, setDismissedIds] = React.useState<string[]>([]);

  const notifications: Notification[] = [];

  // Critical: Expired members
  const expiredMembers = expiringMembers.filter(m => {
    const expiry = new Date(m.expiry_date);
    const today = new Date();
    return expiry < today;
  });

  if (expiredMembers.length > 0) {
    notifications.push({
      id: 'expired-members',
      type: 'error',
      title: `${expiredMembers.length} Expired Membership${expiredMembers.length > 1 ? 's' : ''}`,
      message: `${expiredMembers.length} member${expiredMembers.length > 1 ? 's have' : ' has'} expired memberships. Contact them for renewal.`,
      action: {
        label: 'View Members',
        onClick: () => window.location.href = '/admin/members'
      }
    });
  }

  // Warning: Expiring soon (within 3 days)
  const criticalExpiring = expiringMembers.filter(m => {
    const expiry = new Date(m.expiry_date);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  });

  if (criticalExpiring.length > 0) {
    notifications.push({
      id: 'critical-expiring',
      type: 'warning',
      title: `${criticalExpiring.length} Membership${criticalExpiring.length > 1 ? 's' : ''} Expiring Soon`,
      message: `${criticalExpiring.length} member${criticalExpiring.length > 1 ? 's' : ''} will expire in the next 3 days. Send reminders now.`,
      action: {
        label: 'View Details',
        onClick: () => window.location.href = '/admin/members'
      }
    });
  }

  // Info: New leads to follow up
  const pendingLeads = leads.filter(l => l.status === 'pending');
  if (pendingLeads.length > 0) {
    notifications.push({
      id: 'pending-leads',
      type: 'info',
      title: `${pendingLeads.length} New Lead${pendingLeads.length > 1 ? 's' : ''} Waiting`,
      message: `You have ${pendingLeads.length} pending trial request${pendingLeads.length > 1 ? 's' : ''} to follow up with.`,
      action: {
        label: 'Contact Leads',
        onClick: () => window.location.href = '/admin/leads'
      }
    });
  }

  // Success: Good membership retention
  if (stats && stats.activeMembers > 0 && stats.totalMembers > 0) {
    const retentionRate = (stats.activeMembers / stats.totalMembers) * 100;
    if (retentionRate >= 80) {
      notifications.push({
        id: 'good-retention',
        type: 'success',
        title: 'Excellent Retention Rate',
        message: `${retentionRate.toFixed(0)}% of your members are active. Keep up the great work!`
      });
    }
  }

  // Warning: Low active members
  if (stats && stats.activeMembers > 0 && stats.totalMembers > 0) {
    const activeRate = (stats.activeMembers / stats.totalMembers) * 100;
    if (activeRate < 50) {
      notifications.push({
        id: 'low-active',
        type: 'warning',
        title: 'Low Active Member Rate',
        message: `Only ${activeRate.toFixed(0)}% of members are active. Consider running a re-engagement campaign.`,
        action: {
          label: 'View Members',
          onClick: () => window.location.href = '/admin/members'
        }
      });
    }
  }

  const handleDismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
    if (onDismiss) onDismiss(id);
  };

  const visibleNotifications = notifications.filter(n => !dismissedIds.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-[2rem] border p-4 ${getStyles(notification.type)} relative`}
        >
          <button
            onClick={() => handleDismiss(notification.id)}
            className="absolute top-4 right-4 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-8">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm uppercase mb-1">{notification.title}</h4>
              <p className="text-sm opacity-80 mb-3">{notification.message}</p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  {notification.action.label} →
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
