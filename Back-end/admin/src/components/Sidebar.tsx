import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  Send, 
  Settings,
  Dumbbell,
  Clock
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: UserPlus, label: 'Leads', path: '/leads' },
  { icon: Calendar, label: 'Plans', path: '/plans' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Send, label: 'Telegram Reminders', path: '/telegram' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-black text-white h-screen fixed left-0 top-0 flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">GymFlow</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-500">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-slate-500">Gym Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
