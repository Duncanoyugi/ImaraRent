import { IsString, IsNumber, IsUUID, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class InitiateMpesaPaymentDto {
  @ApiProperty({ example: 'cm8invoice123456' })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: '0712345678' })
  @IsString()
  @MaxLength(12)
  phoneNumber: string;
}
