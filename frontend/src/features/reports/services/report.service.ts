import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type {
  ReportRequest,
  IncomeStatementReport,
  RentRollReport,
  ArrearsAgingReport,
  OccupancyReport,
  MaintenanceReport,
} from '../types/report.types';

export const reportService = {
  generateIncomeStatement: async (data: ReportRequest): Promise<IncomeStatementReport> => {
    const response = await api.post<IncomeStatementReport>(
      API_ROUTES.REPORTS.INCOME_STATEMENT,
      data
    );
    return response;
  },

  generateRentRoll: async (data: ReportRequest): Promise<RentRollReport> => {
    const response = await api.post<RentRollReport>(
      API_ROUTES.REPORTS.RENT_ROLL,
      data
    );
    return response;
  },

  generateArrearsAging: async (data: ReportRequest): Promise<ArrearsAgingReport> => {
    const response = await api.post<ArrearsAgingReport>(
      API_ROUTES.REPORTS.ARREARS_AGING,
      data
    );
    return response;
  },

  generateOccupancy: async (data: ReportRequest): Promise<OccupancyReport> => {
    const response = await api.post<OccupancyReport>(
      API_ROUTES.REPORTS.OCCUPANCY,
      data
    );
    return response;
  },

  generateMaintenance: async (data: ReportRequest): Promise<MaintenanceReport> => {
    const response = await api.post<MaintenanceReport>(
      API_ROUTES.REPORTS.MAINTENANCE,
      data
    );
    return response;
  },

  generateTenantStatement: async (tenantId: string): Promise<unknown> => {
    const response = await api.post<unknown>(
      API_ROUTES.REPORTS.TENANT_STATEMENT.replace(':tenantId', tenantId)
    );
    return response;
  },
};