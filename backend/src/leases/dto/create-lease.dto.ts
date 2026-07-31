import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLeaseDto {
  @ApiProperty({ example: '2024-02-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-01-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rentAmount: number;

  @ApiProperty({ example: 45000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  depositAmount?: number;

  @ApiProperty({ example: 'cm8tenant123456' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'cm8unit123456' })
  @IsString()
  unitId: string;
}
