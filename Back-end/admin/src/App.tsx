import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/MembersPage';
import { LeadsPage } from './pages/LeadsPage';
import { PlansPage } from './pages/PlansPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TeamPage } from './pages/TeamPage';
import { TelegramPage } from './pages/TelegramPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
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
          <Routes>
            <Route path="/" element={<Dashboard key={refreshTrigger} onRefresh={handleRefresh} />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/telegram" element={<TelegramPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
