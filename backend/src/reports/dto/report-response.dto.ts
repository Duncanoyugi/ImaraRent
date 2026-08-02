import { ApiProperty } from '@nestjs/swagger';

export class ReportMetadataDto {
  @ApiProperty()
  generatedAt: Date;

  @ApiProperty()
  period: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  generatedBy: string;
}

export class IncomeStatementReportDto {
  @ApiProperty()
  metadata: ReportMetadataDto;

  @ApiProperty()
  summary: {
    totalRentCollected: number;
    totalRentExpected: number;
    totalLateFees: number;
    totalUtilities: number;
    totalDiscounts: number;
    netIncome: number;
    collectionRate: number;
  };

  @ApiProperty({ type: 'array' })
  monthlyBreakdown: {
    month: string;
    expected: number;
    collected: number;
    lateFees: number;
    utilities: number;
    collectionRate: number;
  }[];

  @ApiProperty({ type: 'array' })
  propertyBreakdown: {
    propertyId: string;
    propertyName: string;
    expected: number;
    collected: number;
    collectionRate: number;
  }[];
}

export class RentRollReportDto {
  @ApiProperty()
  metadata: ReportMetadataDto;

  @ApiProperty()
  summary: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    occupancyRate: number;
    totalMonthlyRent: number;
    averageRent: number;
  };

  @ApiProperty({ type: 'array' })
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

export class ArrearsAgingReportDto {
  @ApiProperty()
  metadata: ReportMetadataDto;

  @ApiProperty()
  summary: {
    totalArrears: number;
    totalTenants: number;
    tenantsWithArrears: number;
  };

  @ApiProperty({ type: 'array' })
  agingBuckets: {
    bucket: string;
    amount: number;
    tenantCount: number;
  }[];

  @ApiProperty({ type: 'array' })
  tenants: {
    tenantId: string;
    tenantName: string;
    unitNumber: string;
    propertyName: string;
    totalDue: number;
    totalPaid: number;
    balance: number;
    daysOverdue: number;
    oldestInvoiceDate: string;
  }[];
}

export class OccupancyReportDto {
  @ApiProperty()
  metadata: ReportMetadataDto;

  @ApiProperty()
  summary: {
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    maintenanceUnits: number;
    occupancyRate: number;
    vacancyRate: number;
  };

  @ApiProperty({ type: 'array' })
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

export class MaintenanceReportDto {
  @ApiProperty()
  metadata: ReportMetadataDto;

  @ApiProperty()
  summary: {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    completedTickets: number;
    averageResolutionTime: number;
    totalCost: number;
  };

  @ApiProperty({ type: 'array' })
  priorityBreakdown: {
    priority: string;
    count: number;
  }[];

  @ApiProperty({ type: 'array' })
  propertyBreakdown: {
    propertyId: string;
    propertyName: string;
    total: number;
    open: number;
    completed: number;
  }[];
}

export class TenantStatementReportDto {
  @ApiProperty()
  metadata: ReportMetadataDto;

  @ApiProperty()
  tenantInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    unitNumber: string;
    propertyName: string;
  };

  @ApiProperty()
  summary: {
    totalCharged: number;
    totalPaid: number;
    balance: number;
  };

  @ApiProperty({ type: 'array' })
  transactions: {
    date: string;
    description: string;
    invoiceNumber: string;
    amount: number;
    type: 'invoice' | 'payment';
    balance: number;
  }[];
}
