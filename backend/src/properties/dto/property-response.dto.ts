import { ApiProperty } from '@nestjs/swagger';

export class PropertyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  county: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  createdById: string;
}

export class PropertyWithStatsDto extends PropertyResponseDto {
  @ApiProperty()
  stats: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    maintenanceUnits: number;
    totalRent: number;
  };
}
