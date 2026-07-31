import {
  IsEnum,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationChannel } from '@prisma/client';

export class SendNotificationDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ example: 'tenant@example.com' })
  @ValidateIf((o) => o.channel === 'EMAIL')
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+254712345678' })
  @ValidateIf((o) => o.channel === 'SMS')
  @IsPhoneNumber('KE')
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: true })
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}
