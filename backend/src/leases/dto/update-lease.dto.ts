import { PartialType } from '@nestjs/swagger';
import { CreateLeaseDto } from './create-lease.dto';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsBoolean,
} from 'class-validator';
import { LeaseStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLeaseDto extends PartialType(CreateLeaseDto) {
  @ApiProperty({ enum: LeaseStatus, required: false })
  @IsOptional()
  @IsEnum(LeaseStatus)
  status?: LeaseStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  terminatedAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  terminationReason?: string;
}
