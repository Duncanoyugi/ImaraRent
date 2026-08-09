import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { reportService } from '../services/report.service';
import { showToast } from '@/app/providers/toast-provider';
import type { ApiError } from '@/lib/api/api-types';
import type { ReportRequest } from '../types/report.types';

export const useIncomeStatement = () => {
  return useMutation({
    mutationFn: (data: ReportRequest) => reportService.generateIncomeStatement(data),
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to generate income statement';
      showToast.error('Generation Failed', message);
    },
  });
};

export const useRentRoll = () => {
  return useMutation({
    mutationFn: (data: ReportRequest) => reportService.generateRentRoll(data),
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to generate rent roll';
      showToast.error('Generation Failed', message);
    },
  });
};

export const useArrearsAging = () => {
  return useMutation({
    mutationFn: (data: ReportRequest) => reportService.generateArrearsAging(data),
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to generate arrears aging';
      showToast.error('Generation Failed', message);
    },
  });
};

export const useOccupancyReport = () => {
  return useMutation({
    mutationFn: (data: ReportRequest) => reportService.generateOccupancy(data),
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to generate occupancy report';
      showToast.error('Generation Failed', message);
    },
  });
};

export const useMaintenanceReport = () => {
  return useMutation({
    mutationFn: (data: ReportRequest) => reportService.generateMaintenance(data),
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to generate maintenance report';
      showToast.error('Generation Failed', message);
    },
  });
};

export const useTenantStatement = () => {
  return useMutation({
    mutationFn: (tenantId: string) => reportService.generateTenantStatement(tenantId),
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to generate tenant statement';
      showToast.error('Generation Failed', message);
    },
  });
};