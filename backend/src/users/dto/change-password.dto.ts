import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The password the user is signing in with today',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Replacement password, at least 8 characters' })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @Matches(/[A-Za-z]/, { message: 'New password must contain a letter' })
  @Matches(/\d/, { message: 'New password must contain a number' })
  newPassword: string;
}
