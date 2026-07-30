import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: '0712345678', required: false })
  @IsOptional()
  @IsPhoneNumber('KE')
  phone?: string;

  @ApiProperty({ example: 'My Property Company' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  organizationName: string;

  @ApiProperty({ example: 'Nairobi', required: false })
  @IsOptional()
  @IsString()
  organizationAddress?: string;
}
