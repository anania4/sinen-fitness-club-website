import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Registration from './Registration';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/MembersPage';
import { LeadsPage } from './pages/LeadsPage';
import { PlansPage } from './pages/PlansPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TeamPage } from './pages/TeamPage';
import { TelegramPage } from './pages/TelegramPage';
import { SettingsPage } from './pages/SettingsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { DailyPassesPage } from './pages/DailyPassesPage';
import { LoginPage } from './pages/LoginPage';
import AdminLayout from './AdminLayout';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';


export default function App() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/admin' element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
            <Route index element={<Dashboard key={refreshTrigger} onRefresh={handleRefresh} />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="daily-passes" element={<DailyPassesPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="telegram" element={<TelegramPage />} />
              <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
