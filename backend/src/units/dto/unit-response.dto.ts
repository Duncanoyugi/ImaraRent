import { ApiProperty } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';

export class UnitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  floor: string;

  @ApiProperty()
  bedrooms: number;

  @ApiProperty()
  bathrooms: number;

  @ApiProperty()
  squareFeet: number;

  @ApiProperty()
  rentAmount: number;

  @ApiProperty({ enum: UnitStatus })
  status: UnitStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  propertyId: string;
}

export class UnitWithTenantDto extends UnitResponseDto {
  @ApiProperty()
  currentTenant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
}
