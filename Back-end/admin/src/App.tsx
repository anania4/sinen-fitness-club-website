import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/MembersPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeadsPage } from './pages/LeadsPage';
import { PlansPage } from './pages/PlansPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TelegramPage } from './pages/TelegramPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <Header onRefresh={handleRefresh} />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard key={refreshTrigger} onRefresh={handleRefresh} />} />
            <Route path="/members" element={<MembersPage key={refreshTrigger} />} />
            <Route path="/attendance" element={<AttendancePage key={refreshTrigger} />} />
            <Route path="/leads" element={<LeadsPage key={refreshTrigger} />} />
            <Route path="/plans" element={<PlansPage key={refreshTrigger} />} />
            <Route path="/payments" element={<PaymentsPage key={refreshTrigger} />} />
            <Route path="/telegram" element={<TelegramPage key={refreshTrigger} />} />
            <Route path="/settings" element={<SettingsPage key={refreshTrigger} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
