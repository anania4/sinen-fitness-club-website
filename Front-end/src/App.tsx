import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Registration from './Registration';
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
import AdminLayout from './AdminLayout';


export default function App() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Registration />} />
      <Route path='/admin'element={ <AdminLayout />} >
          <Route index element={<Dashboard key={refreshTrigger} onRefresh={handleRefresh} />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="telegram" element={<TelegramPage />} />
            <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
