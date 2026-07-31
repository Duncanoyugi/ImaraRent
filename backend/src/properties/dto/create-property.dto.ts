import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Sunset Apartments' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Luxury apartments with pool', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123 Ngong Road' })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({ example: 'Nairobi' })
  @IsString()
  @MinLength(2)
  city: string;

  @ApiProperty({ example: 'Nairobi' })
  @IsString()
  @MinLength(2)
  county: string;

  @ApiProperty({ example: '00100', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: -1.2921, required: false })
  @IsOptional()
  @IsLatitude()
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({ example: 36.8219, required: false })
  @IsOptional()
  @IsLongitude()
  @Type(() => Number)
  longitude?: number;
}
