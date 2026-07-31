import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UnitStatus } from '@prisma/client';
import { CreateUnitDto, UpdateUnitDto } from './dto';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, organizationId: string, dto: CreateUnitDto) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    // Verify property exists in this organization
    const property = await this.prisma.property.findFirst({
      where: {
        id: dto.propertyId,
        organizationId,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found in this organization');
    }

    // Check if unit number already exists in this property
    const existingUnit = await this.prisma.unit.findFirst({
      where: {
        propertyId: dto.propertyId,
        number: dto.number,
      },
    });

    if (existingUnit) {
      throw new ConflictException(
        `Unit number ${dto.number} already exists in this property`,
      );
    }

    const unit = await this.prisma.unit.create({
      data: {
        number: dto.number,
        floor: dto.floor,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        squareFeet: dto.squareFeet,
        rentAmount: dto.rentAmount,
        status: dto.status || UnitStatus.VACANT,
        propertyId: dto.propertyId,
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            organizationId: true,
          },
        },
      },
    });

    return unit;
  }

  async bulkCreate(
    userId: string,
    organizationId: string,
    units: CreateUnitDto[],
  ) {
    // Verify all units belong to properties in this organization
    const propertyIds = [...new Set(units.map((u) => u.propertyId))];

    for (const propertyId of propertyIds) {
      const property = await this.prisma.property.findFirst({
        where: {
          id: propertyId,
          organizationId,
        },
      });

      if (!property) {
        throw new NotFoundException(
          `Property ${propertyId} not found in this organization`,
        );
      }
    }

    // Check for duplicate unit numbers within each property
    for (const unit of units) {
      const existingUnit = await this.prisma.unit.findFirst({
        where: {
          propertyId: unit.propertyId,
          number: unit.number,
        },
      });

      if (existingUnit) {
        throw new ConflictException(
          `Unit number ${unit.number} already exists in property ${unit.propertyId}`,
        );
      }
    }

    // Create all units in a transaction
    const createdUnits = await this.prisma.$transaction(
      units.map((dto) =>
        this.prisma.unit.create({
          data: {
            number: dto.number,
            floor: dto.floor,
            bedrooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            squareFeet: dto.squareFeet,
            rentAmount: dto.rentAmount,
            status: dto.status || UnitStatus.VACANT,
            propertyId: dto.propertyId,
          },
        }),
      ),
    );

    return createdUnits;
  }

  async findAll(organizationId: string, userId: string, propertyId?: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const where: any = {
      property: {
        organizationId,
      },
    };

    if (propertyId) {
      where.propertyId = propertyId;
    }

    const units = await this.prisma.unit.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            name: true,
          },
        },
        leases: {
          where: { isActive: true },
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { number: 'asc' },
    });

    return units.map((unit) => {
      const activeLease = unit.leases[0];

      return {
        ...unit,
        currentTenant: activeLease?.tenant || null,
        hasActiveLease: !!activeLease,
      };
    });
  }

  async findOne(id: string, organizationId: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        property: {
          organizationId,
        },
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            organizationId: true,
          },
        },
        leases: {
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        maintenanceTickets: {
          where: { status: { not: 'CLOSED' } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    const activeLease = unit.leases.find((lease) => lease.isActive);

    return {
      ...unit,
      currentTenant: activeLease?.tenant || null,
      activeLease: activeLease || null,
      leaseHistory: unit.leases.filter((lease) => !lease.isActive),
    };
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    dto: UpdateUnitDto,
  ) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        property: {
          organizationId,
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // If updating propertyId, verify new property exists
    if (dto.propertyId) {
      const property = await this.prisma.property.findFirst({
        where: {
          id: dto.propertyId,
          organizationId,
        },
      });

      if (!property) {
        throw new NotFoundException('Property not found in this organization');
      }

      // Check if unit number exists in new property
      const existingUnit = await this.prisma.unit.findFirst({
        where: {
          propertyId: dto.propertyId,
          number: dto.number || unit.number,
          NOT: { id },
        },
      });

      if (existingUnit) {
        throw new ConflictException(
          `Unit number ${dto.number || unit.number} already exists in this property`,
        );
      }
    }

    // If changing status to OCCUPIED, verify there's an active lease
    if (dto.status === UnitStatus.OCCUPIED) {
      const activeLease = await this.prisma.lease.findFirst({
        where: {
          unitId: id,
          isActive: true,
        },
      });

      if (!activeLease) {
        throw new ForbiddenException(
          'Cannot mark unit as occupied without an active lease',
        );
      }
    }

    const updatedUnit = await this.prisma.unit.update({
      where: { id },
      data: dto,
      include: {
        property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedUnit;
  }

  async remove(id: string, organizationId: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        property: {
          organizationId,
        },
      },
      include: {
        leases: {
          where: { isActive: true },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if unit has active lease
    if (unit.leases.length > 0) {
      throw new ForbiddenException(
        'Cannot delete unit with active lease. Terminate the lease first.',
      );
    }

    return this.prisma.unit.delete({
      where: { id },
    });
  }

  private async verifyUserOrganization(userId: string, organizationId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.organizationId !== organizationId) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }
  }
}
