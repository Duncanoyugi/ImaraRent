import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus, MaintenancePriority } from '@prisma/client';

export class TicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: MaintenancePriority })
  priority: MaintenancePriority;

  @ApiProperty({ enum: MaintenanceStatus })
  status: MaintenanceStatus;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  unitId: string;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  assignedToId: string;
}

export class TicketWithDetailsDto extends TicketResponseDto {
  @ApiProperty()
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

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
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty()
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;

  @ApiProperty()
  photos: {
    id: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];
}
