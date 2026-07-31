import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
