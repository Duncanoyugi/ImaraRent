import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceLineType } from '@prisma/client';
import { Type } from 'class-transformer';

export class AddInvoiceLineDto {
  @ApiProperty({ example: 'Water bill - February 2024' })
  @IsString()
  description: string;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: InvoiceLineType, default: InvoiceLineType.UTILITY })
  @IsEnum(InvoiceLineType)
  type: InvoiceLineType;
}
