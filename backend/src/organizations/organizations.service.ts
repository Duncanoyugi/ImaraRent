import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, id);

    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
        properties: {
          select: {
            id: true,
            name: true,
            city: true,
            createdAt: true,
            _count: {
              select: { units: true },
            },
          },
        },
        tenants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Calculate stats
    const stats = {
      totalUsers: organization.users.length,
      totalProperties: organization.properties.length,
      totalTenants: organization.tenants.length,
    };

    return { ...organization, stats };
  }

  async update(id: string, userId: string, dto: UpdateOrganizationDto) {
    // Verify user belongs to this organization and is an owner
    await this.verifyUserOrganization(userId, id);
    await this.verifyUserIsOwner(userId, id);

    const organization = await this.prisma.organization.update({
      where: { id },
      data: dto,
    });

    return organization;
  }

  async getUsers(id: string, userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, id);

    return this.prisma.user.findMany({
      where: { organizationId: id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats(id: string, _userId: string) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(_userId, id);

    const [totalUsers, totalProperties, totalTenants, totalUnits] =
      await Promise.all([
        this.prisma.user.count({ where: { organizationId: id } }),
        this.prisma.property.count({ where: { organizationId: id } }),
        this.prisma.tenant.count({ where: { organizationId: id } }),
        this.prisma.unit.count({
          where: { property: { organizationId: id } },
        }),
      ]);

    return {
      totalUsers,
      totalProperties,
      totalTenants,
      totalUnits,
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

  private async verifyUserIsOwner(userId: string, _organizationId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can perform this action');
    }
  }
}
