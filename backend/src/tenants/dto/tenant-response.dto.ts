import { ApiProperty } from '@nestjs/swagger';
import { TenantStatus } from '@prisma/client';

export class TenantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  nationalId: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ enum: TenantStatus })
  status: TenantStatus;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TenantWithUnitDto extends TenantResponseDto {
  @ApiProperty()
  unit: {
    id: string;
    number: string;
    property: {
      id: string;
      name: string;
    };
  };

  @ApiProperty()
  activeLease: {
    id: string;
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    status: string;
  } | null;
}
