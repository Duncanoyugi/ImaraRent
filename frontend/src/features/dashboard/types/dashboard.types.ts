export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  maintenanceUnits: number;
  totalRentCollected: number;
  totalRentExpected: number;
  collectionRate: number;
  occupancyRate: number;
  totalTenants: number;
  openMaintenanceTickets: number;
  overdueInvoices: number;
}

export interface RevenueDataPoint {
  month: string;
  expected: number;
  collected: number;
}

export interface OccupancyDataPoint {
  month: string;
  occupied: number;
  vacant: number;
}

export interface RecentActivity {
  id: string;
  type: 'payment' | 'tenant' | 'lease' | 'maintenance' | 'property' | 'invoice';
  description: string;
  amount?: number;
  status?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface UpcomingPayment {
  id: string;
  tenantName: string;
  unitNumber: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue';
}

export interface MaintenanceAlert {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS';
  unitNumber: string;
  propertyName: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueData: RevenueDataPoint[];
  occupancyData: OccupancyDataPoint[];
  recentActivity: RecentActivity[];
  upcomingPayments: UpcomingPayment[];
  maintenanceAlerts: MaintenanceAlert[];
}