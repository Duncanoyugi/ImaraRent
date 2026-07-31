import {
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Mary' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Wambui' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'mary.wambui@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+254712345678' })
  @IsPhoneNumber('KE')
  phone: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'cm8unit123456' })
  @IsString()
  unitId: string;
}
