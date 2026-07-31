import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateUnitDto {
  @ApiProperty({ example: 'A101' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  number: string;

  @ApiProperty({ example: '3rd Floor', required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bedrooms?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bathrooms?: number;

  @ApiProperty({ example: 850, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  squareFeet?: number;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rentAmount: number;

  @ApiProperty({ enum: UnitStatus, default: UnitStatus.VACANT })
  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;

  @ApiProperty({ example: 'cm8abcdef789012' })
  @IsString()
  propertyId: string;
}
