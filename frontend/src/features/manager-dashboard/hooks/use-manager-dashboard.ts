import { useQuery } from '@tanstack/react-query';
import { managerDashboardService } from '../services/manager-dashboard.service';

export const MANAGER_DASHBOARD_QUERY_KEY = ['manager-dashboard'];

export const useManagerDashboard = () =>
  useQuery({
    queryKey: MANAGER_DASHBOARD_QUERY_KEY,
    queryFn: () => managerDashboardService.getDashboard(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
