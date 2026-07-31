import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @ApiProperty({ example: '2024-02-01' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @ApiProperty({ example: 'February 2024 Rent', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'cm8lease123456' })
  @IsUUID()
  leaseId: string;
}
