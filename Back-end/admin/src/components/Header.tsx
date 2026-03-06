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
      <header className="h-20 bg-zinc-900/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-4 bg-black/50 px-4 py-2 rounded-2xl w-96 border border-white/10">
          <Search className="w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search members, leads, or payments..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white relative transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-zinc-900 rounded-full text-[10px] text-black flex items-center justify-center font-black">
              3
            </span>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 active:scale-95"
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
