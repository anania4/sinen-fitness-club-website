export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  newLeads: number;
}

export interface Member {
  id: number;
  name: string;
  phone: string;
  emergency_contact?: string;
  plan: string;
  start_date: string;
  expiry_date: string;
  payment_status: string;
  status: string;
  profile_photo?: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  goal: string;
  preferred_time: string;
  status: string;
}

export interface Payment {
  id: number;
  member_name: string;
  amount: number;
  date: string;
  method: string;
}

export interface RevenueData {
  month: string;
  amount: number;
}
