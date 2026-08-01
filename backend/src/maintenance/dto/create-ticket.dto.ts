import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenancePriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ example: 'Leaking tap in kitchen' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example:
      'The kitchen tap has been leaking for 3 days and water is damaging the cabinet.',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    enum: MaintenancePriority,
    default: MaintenancePriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;

  @ApiProperty({ example: 'cm8unit123456' })
  @IsUUID()
  unitId: string;
}
