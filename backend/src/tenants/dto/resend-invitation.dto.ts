import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendInvitationDto {
  @ApiProperty()
  @IsString()
  tenantId: string;
}
