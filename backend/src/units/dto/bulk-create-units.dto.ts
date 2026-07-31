import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';

export class BulkCreateUnitsDto {
  @ApiProperty({ type: [CreateUnitDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUnitDto)
  units: CreateUnitDto[];
}
