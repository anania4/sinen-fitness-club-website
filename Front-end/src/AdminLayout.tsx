import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

function AdminLayout() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 flex flex-col">
        <Header onRefresh={handleRefresh} />
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
         <Outlet/>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
