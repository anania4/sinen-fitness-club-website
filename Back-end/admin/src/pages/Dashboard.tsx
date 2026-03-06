import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { ExpiringMembersTable } from '../components/ExpiringMembersTable';
import { LeadsTable } from '../components/LeadsTable';
import { RecentPaymentsTable } from '../components/RecentPaymentsTable';
import { RevenueChart } from '../components/RevenueChart';
import { DashboardStats, Member, Lead, Payment, RevenueData } from '../types';
import { Users, UserCheck, Clock, UserPlus } from 'lucide-react';

interface Props {
  onRefresh: () => void;
}

export const Dashboard: React.FC<Props> = ({ onRefresh }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [expiringMembers, setExpiringMembers] = useState<Member[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, expiringRes, leadsRes, paymentsRes, revenueRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/expiring-members'),
        fetch('/api/dashboard/leads'),
        fetch('/api/dashboard/payments'),
        fetch('/api/dashboard/revenue')
      ]);

      const [statsData, expiringData, leadsData, paymentsData, revenueData] = await Promise.all([
        statsRes.json(),
        expiringRes.json(),
        leadsRes.json(),
        paymentsRes.json(),
        revenueRes.json()
      ]);

      setStats(statsData);
      setExpiringMembers(expiringData);
      setLeads(leadsData);
      setPayments(paymentsData);
      setRevenue(revenueData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Dashboard Overview</h2>
        <p className="text-gray-500 font-medium">Welcome back! Here's what's happening at your gym today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value={stats?.totalMembers || 0} 
          icon={Users} 
          description="Total registered members"
          color="bg-orange-500"
        />
        <StatCard 
          title="Active Members" 
          value={stats?.activeMembers || 0} 
          icon={UserCheck} 
          description="Members with active plans"
          color="bg-orange-500"
        />
        <StatCard 
          title="Expiring Soon" 
          value={stats?.expiringSoon || 0} 
          icon={Clock} 
          description="Expiring in next 14 days"
          color="bg-orange-500"
        />
        <StatCard 
          title="New Leads" 
          value={stats?.newLeads || 0} 
          icon={UserPlus} 
          description="Pending trial requests"
          color="bg-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart data={revenue} />
          <ExpiringMembersTable members={expiringMembers} onRefresh={fetchData} />
        </div>
        
        <div className="space-y-8">
          <LeadsTable leads={leads} onRefresh={fetchData} />
          <RecentPaymentsTable payments={payments} />
        </div>
      </div>
    </div>
  );
};
