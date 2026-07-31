import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { InvoiceStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @ApiProperty({ enum: InvoiceStatus, required: false })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}
