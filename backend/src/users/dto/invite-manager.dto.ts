import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteManagerDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Wanjiru' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'jane.wanjiru@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+254798765432', required: false })
  @IsOptional()
  @IsPhoneNumber('KE')
  phone?: string;

  @ApiProperty({
    example: ['prop_123', 'prop_456'],
    required: false,
    description: 'Property IDs to assign to the manager',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  propertyIds?: string[];
}
