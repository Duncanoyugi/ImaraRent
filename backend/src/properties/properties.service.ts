import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole, UnitStatus } from '@prisma/client';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, organizationId: string, dto: CreatePropertyDto) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const property = await this.prisma.property.create({
      data: {
        ...dto,
        organizationId,
        createdById: userId,
      },
    });

    return property;
  }

  async findAll(organizationId: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const properties = await this.prisma.property.findMany({
      where: { organizationId },
      include: {
        units: {
          select: {
            id: true,
            number: true,
            status: true,
            rentAmount: true,
          },
        },
        _count: {
          select: { units: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats for each property
    return properties.map((property) => {
      const totalUnits = property.units.length;
      const occupiedUnits = property.units.filter(
        (u) => u.status === UnitStatus.OCCUPIED,
      ).length;
      const vacantUnits = property.units.filter(
        (u) => u.status === UnitStatus.VACANT,
      ).length;
      const maintenanceUnits = property.units.filter(
        (u) => u.status === UnitStatus.MAINTENANCE,
      ).length;
      const totalRent = property.units.reduce(
        (sum, u) => sum + Number(u.rentAmount),
        0,
      );

      const { _count, ...propertyData } = property;

      return {
        ...propertyData,
        stats: {
          totalUnits,
          occupiedUnits,
          vacantUnits,
          maintenanceUnits,
          totalRent,
          occupancyRate:
            totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
        },
      };
    });
  }

  async findOne(id: string, organizationId: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const property = await this.prisma.property.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        units: {
          include: {
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
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    dto: UpdatePropertyDto,
  ) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const property = await this.prisma.property.findFirst({
      where: { id, organizationId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.property.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, organizationId: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    // Check if user is owner
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can delete properties');
    }

    const property = await this.prisma.property.findFirst({
      where: { id, organizationId },
      include: {
        units: {
          include: {
            leases: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Check if property has active leases
    const hasActiveLeases = property.units.some(
      (unit) => unit.leases.length > 0,
    );
    if (hasActiveLeases) {
      throw new ForbiddenException('Cannot delete property with active leases');
    }

    // Delete property and cascade to units (but not leases - already checked)
    return this.prisma.property.delete({
      where: { id },
    });
  }

  async getStats(organizationId: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    const [properties, units, unitsByStatus] = await Promise.all([
      this.prisma.property.count({ where: { organizationId } }),
      this.prisma.unit.count({
        where: { property: { organizationId } },
      }),
      this.prisma.unit.groupBy({
        by: ['status'],
        where: { property: { organizationId } },
        _count: true,
      }),
    ]);

    const statusCounts = {
      VACANT: 0,
      OCCUPIED: 0,
      MAINTENANCE: 0,
      RESERVED: 0,
    };

    unitsByStatus.forEach((item) => {
      statusCounts[item.status] = item._count;
    });

    const occupiedUnits = statusCounts.OCCUPIED;
    const occupancyRate = units > 0 ? (occupiedUnits / units) * 100 : 0;

    return {
      totalProperties: properties,
      totalUnits: units,
      occupiedUnits,
      vacantUnits: statusCounts.VACANT,
      maintenanceUnits: statusCounts.MAINTENANCE,
      reservedUnits: statusCounts.RESERVED,
      occupancyRate,
    };
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
