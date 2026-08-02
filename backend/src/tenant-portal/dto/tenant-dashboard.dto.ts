import { ApiProperty } from '@nestjs/swagger';

export class TenantDashboardDto {
  @ApiProperty()
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  @ApiProperty()
  unit: {
    id: string;
    number: string;
    rentAmount: number;
    property: {
      id: string;
      name: string;
      address: string;
    };
  };

  @ApiProperty()
  activeLease: {
    id: string;
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    status: string;
  } | null;

  @ApiProperty()
  balance: {
    totalBalance: number;
    totalDue: number;
    totalPaid: number;
    invoiceCount: number;
    overdueInvoices: number;
  };

  @ApiProperty()
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    dueDate: Date;
  }[];

  @ApiProperty()
  recentPayments: {
    id: string;
    amount: number;
    paymentDate: Date;
    method: string;
    status: string;
    reference: string;
  }[];

  @ApiProperty()
  openMaintenanceTickets: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: Date;
  }[];
}
