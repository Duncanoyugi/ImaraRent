import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPhotoDto {
  @ApiProperty({ example: 'https://storage.example.com/photos/ticket-123.jpg' })
  @IsUrl()
  fileUrl: string;
}
