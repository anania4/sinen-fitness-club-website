import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  Send, 
  Settings,
  Dumbbell,
  Users as UsersIcon,
  Megaphone,
  LogOut,
  Ticket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Members', path: '/admin/members' },
  { icon: UserPlus, label: 'Leads', path: '/admin/leads' },
  { icon: Dumbbell, label: 'Plans', path: '/admin/plans' },
  { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
  { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
  { icon: UsersIcon, label: 'Sinen Team', path: '/admin/team' },
  { icon: Ticket, label: 'Daily Passes', path: '/admin/daily-passes' },
  { icon: Send, label: 'Telegram Reminders', path: '/admin/telegram' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-zinc-900 rounded-2xl border border-white/10 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-zinc-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-white/10 z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/images/sinen_logo.png" alt="Sinen Fitness Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Sinen <span className="text-orange-500">Admin</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-black text-black text-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500">Gym Manager</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
