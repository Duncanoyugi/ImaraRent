import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Maina Properties Ltd' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'info@mainaproperties.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+254712345678', required: false })
  @IsOptional()
  @IsPhoneNumber('KE')
  phone?: string;

  @ApiProperty({ example: 'Nairobi, Kenya', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
