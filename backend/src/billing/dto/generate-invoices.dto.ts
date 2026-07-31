import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateInvoicesDto {
  @ApiProperty({ example: '2024-02-01' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ example: '2024-02-29' })
  @IsDateString()
  periodEnd: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
