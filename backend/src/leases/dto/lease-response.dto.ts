import { ApiProperty } from '@nestjs/swagger';
import { LeaseStatus } from '@prisma/client';

export class LeaseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  rentAmount: number;

  @ApiProperty()
  depositAmount: number;

  @ApiProperty()
  depositPaid: boolean;

  @ApiProperty({ enum: LeaseStatus })
  status: LeaseStatus;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  leaseDocumentUrl: string;

  @ApiProperty()
  terminatedAt: Date;

  @ApiProperty()
  terminationReason: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class LeaseWithDetailsDto extends LeaseResponseDto {
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
    property: {
      id: string;
      name: string;
      address: string;
    };
  };

  @ApiProperty()
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty()
  invoices: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    dueDate: Date;
  }[];
}
