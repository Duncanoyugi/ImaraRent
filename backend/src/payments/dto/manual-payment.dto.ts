import {
  IsString,
  IsNumber,
  IsUUID,
  IsEnum,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class ManualPaymentDto {
  @ApiProperty({ example: 'cm8tenant123456' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 'CASH-2024-02-15', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'February 2024 rent', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
