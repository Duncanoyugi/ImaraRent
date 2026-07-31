import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  mpesaTransactionId: string;

  @ApiProperty()
  createdAt: Date;
}

export class InitiateMpesaResponseDto {
  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  checkoutRequestId: string;

  @ApiProperty()
  merchantRequestId: string;

  @ApiProperty()
  status: PaymentStatus;

  @ApiProperty({ description: 'Prompt customer to enter PIN on their phone' })
  message: string;
}

export class PaymentWithAllocationsDto extends PaymentResponseDto {
  @ApiProperty()
  allocations: {
    id: string;
    amount: number;
    invoiceId: string;
    invoiceNumber: string;
    allocatedAt: Date;
  }[];
}
