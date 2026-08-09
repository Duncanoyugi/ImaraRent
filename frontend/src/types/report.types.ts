export type ReportPeriod = 'MONTH' | 'QUARTER' | 'YEAR' | 'CUSTOM';
export type ReportFormat = 'JSON' | 'CSV' | 'PDF';

export interface ReportRequest {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  unitId?: string;
  format?: ReportFormat;
}

export interface ReportMetadata {
  generatedAt: string;
  period: string;
  startDate: string;
  endDate: string;
  organizationId: string;
  generatedBy: string;
}

export interface IncomeStatementReport {
  metadata: ReportMetadata;
  summary: {
    totalRentCollected: number;
    totalRentExpected: number;
    totalLateFees: number;
    totalUtilities: number;
    totalDiscounts: number;
    netIncome: number;
    collectionRate: number;
  };
  monthlyBreakdown: {
    month: string;
    expected: number;
    collected: number;
    lateFees: number;
    utilities: number;
    collectionRate: number;
  }[];
  propertyBreakdown: {
    propertyId: string;
    propertyName: string;
    expected: number;
    collected: number;
    collectionRate: number;
  }[];
}

export interface RentRollReport {
  metadata: ReportMetadata;
  summary: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    occupancyRate: number;
    totalMonthlyRent: number;
    averageRent: number;
  };
  properties: {
    propertyId: string;
    propertyName: string;
    units: {
      unitId: string;
      unitNumber: string;
      tenantName: string | null;
      rentAmount: number;
      status: string;
      leaseStatus: string | null;
    }[];
  }[];
}

export interface ArrearsAgingReport {
  metadata: ReportMetadata;
  summary: {
    totalArrears: number;
    totalTenants: number;
    tenantsWithArrears: number;
  };
  agingBuckets: {
    bucket: string;
    amount: number;
    tenantCount: number;
  }[];
  tenants: {
    tenantId: string;
    tenantName: string;
    unitNumber: string;
    propertyName: string;
    totalDue: number;
    totalPaid: number;
    balance: number;
    daysOverdue: number;
    oldestInvoiceDate: string | null;
  }[];
}

export interface OccupancyReport {
  metadata: ReportMetadata;
  summary: {
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    maintenanceUnits: number;
    occupancyRate: number;
    vacancyRate: number;
  };
  propertyDetails: {
    propertyId: string;
    propertyName: string;
    totalUnits: number;
    occupied: number;
    vacant: number;
    maintenance: number;
    occupancyRate: number;
  }[];
}

export interface MaintenanceReport {
  metadata: ReportMetadata;
  summary: {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    completedTickets: number;
    averageResolutionTime: number;
    totalCost: number;
  };
  priorityBreakdown: {
    priority: string;
    count: number;
  }[];
  propertyBreakdown: {
    propertyId: string;
    propertyName: string;
    total: number;
    open: number;
    completed: number;
  }[];
}