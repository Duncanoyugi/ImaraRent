import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TenantStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @ApiProperty({ enum: TenantStatus, required: false })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}
