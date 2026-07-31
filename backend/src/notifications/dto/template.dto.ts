import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateTemplateDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'email/tenant-invitation.hbs' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  templatePath: string;

  @ApiProperty({ example: 'Welcome to ImaraRent' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  subject: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}

export class PreviewTemplateDto {
  @ApiProperty({ type: Object, additionalProperties: true })
  data: Record<string, any>;
}
