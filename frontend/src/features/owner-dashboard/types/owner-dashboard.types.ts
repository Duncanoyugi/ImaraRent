export type {
  DashboardStats,
  DashboardData,
  RevenueDataPoint,
  OccupancyDataPoint,
  RecentActivity,
  UpcomingPayment,
  MaintenanceAlert,
} from '@/features/dashboard/types/dashboard.types';

export interface ArrearsBucketSummary {
  bucket: string;
  amount: number;
  invoiceCount: number;
}

export interface PropertyPerformance {
  id: string;
  name: string;
  city: string;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  monthlyRent: number;
}
