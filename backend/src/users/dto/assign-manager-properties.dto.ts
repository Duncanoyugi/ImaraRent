import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class AssignManagerPropertiesDto {
  @ApiProperty({ example: ['prop_123', 'prop_456'] })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  propertyIds: string[];
}