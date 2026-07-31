import { PartialType } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { UnitStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiProperty({ enum: UnitStatus, required: false })
  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
}
