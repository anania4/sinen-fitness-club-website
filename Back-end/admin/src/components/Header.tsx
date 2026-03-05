import React, { useState } from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { NewMemberModal } from './NewMemberModal';

interface Props {
  onRefresh: () => void;
}

export const Header: React.FC<Props> = ({ onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96 border border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search members, leads, or payments..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-slate-600 relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <button className="text-slate-400 hover:text-slate-600">
            <HelpCircle className="w-6 h-6" />
          </button>
          <div className="h-8 w-[1px] bg-slate-100 mx-2" />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            + New Member
          </button>
        </div>
      </header>

      <NewMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onRefresh} 
      />
    </>
  );
};
