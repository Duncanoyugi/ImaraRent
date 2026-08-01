import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  Min,
  IsString,
} from 'class-validator';
import { MaintenanceStatus, MaintenancePriority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiProperty({ enum: MaintenanceStatus, required: false })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiProperty({ enum: MaintenancePriority, required: false })
  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
