import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { LeaseStatus, UnitStatus, TenantStatus } from '@prisma/client';
import { CreateLeaseDto, UpdateLeaseDto } from './dto';

@Injectable()
export class LeasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, organizationId: string, dto: CreateLeaseDto) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    // Verify tenant exists and belongs to this organization
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: dto.tenantId,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found in this organization');
    }

    // Verify unit exists and belongs to this organization
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: dto.unitId,
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
      throw new NotFoundException('Unit not found in this organization');
    }

    // Check if unit already has an active lease
    if (unit.leases.length > 0) {
      throw new ConflictException('Unit already has an active lease');
    }

    // Check if tenant has an active lease
    const activeTenantLease = await this.prisma.lease.findFirst({
      where: {
        tenantId: dto.tenantId,
        isActive: true,
      },
    });

    if (activeTenantLease) {
      throw new ConflictException('Tenant already has an active lease');
    }

    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : null;

    if (endDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Create lease
    const lease = await this.prisma.$transaction(async (tx) => {
      // Create lease
      const newLease = await tx.lease.create({
        data: {
          startDate,
          endDate,
          rentAmount: dto.rentAmount,
          depositAmount: dto.depositAmount,
          tenantId: dto.tenantId,
          unitId: dto.unitId,
          createdById: userId,
          status: LeaseStatus.DRAFT,
          isActive: false,
        },
      });

      // Update unit status
      await tx.unit.update({
        where: { id: dto.unitId },
        data: { status: UnitStatus.RESERVED },
      });

      return newLease;
    });

    return this.findOne(lease.id, organizationId, userId);
  }

  async activateLease(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const lease = await this.prisma.lease.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
      },
      include: {
        unit: true,
        tenant: true,
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if (lease.isActive) {
      throw new BadRequestException('Lease is already active');
    }

    // Check if unit still available
    const activeLease = await this.prisma.lease.findFirst({
      where: {
        unitId: lease.unitId,
        isActive: true,
      },
    });

    if (activeLease) {
      throw new ConflictException('Unit already has an active lease');
    }

    // Activate lease
    const activatedLease = await this.prisma.$transaction(async (tx) => {
      const updatedLease = await tx.lease.update({
        where: { id },
        data: {
          status: LeaseStatus.ACTIVE,
          isActive: true,
        },
      });

      // Update unit status to OCCUPIED
      await tx.unit.update({
        where: { id: lease.unitId },
        data: { status: UnitStatus.OCCUPIED },
      });

      // Update tenant status to ACTIVE if not already
      if (lease.tenant.status !== TenantStatus.ACTIVE) {
        await tx.tenant.update({
          where: { id: lease.tenantId },
          data: { status: TenantStatus.ACTIVE },
        });
      }

      return updatedLease;
    });

    // TODO: Generate first invoice for the tenant
    // We'll implement this in the billing module

    return this.findOne(activatedLease.id, organizationId, userId);
  }

  async findAll(
    organizationId: string,
    userId: string,
    status?: LeaseStatus,
    unitId?: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const where: any = {
      unit: {
        property: {
          organizationId,
        },
      },
    };

    if (status) {
      where.status = status;
    }

    if (unitId) {
      where.unitId = unitId;
    }

    const leases = await this.prisma.lease.findMany({
      where,
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
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            paidAmount: true,
            balance: true,
            status: true,
            dueDate: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return leases;
  }

  async findOne(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const lease = await this.prisma.lease.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
      },
      include: {
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                isActive: true,
              },
            },
          },
        },
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    return lease;
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    dto: UpdateLeaseDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const lease = await this.prisma.lease.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
      },
      include: {
        unit: true,
        tenant: true,
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if (lease.isActive && dto.status !== LeaseStatus.TERMINATED) {
      throw new BadRequestException(
        'Active leases can only be updated for termination. Use terminate endpoint.',
      );
    }

    const updateData: any = {};

    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }

    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    if (dto.rentAmount !== undefined) {
      updateData.rentAmount = dto.rentAmount;
    }

    if (dto.depositAmount !== undefined) {
      updateData.depositAmount = dto.depositAmount;
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    if (dto.terminatedAt) {
      updateData.terminatedAt = new Date(dto.terminatedAt);
    }

    if (dto.terminationReason) {
      updateData.terminationReason = dto.terminationReason;
    }

    const updatedLease = await this.prisma.lease.update({
      where: { id },
      data: updateData,
    });

    return this.findOne(updatedLease.id, organizationId, userId);
  }

  async terminateLease(
    id: string,
    organizationId: string,
    userId: string,
    reason?: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const lease = await this.prisma.lease.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
        isActive: true,
      },
      include: {
        unit: true,
        tenant: true,
        invoices: {
          where: {
            status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] },
          },
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('Active lease not found');
    }

    // Check if there are outstanding invoices
    if (lease.invoices.length > 0) {
      throw new ForbiddenException(
        'Cannot terminate lease with outstanding invoices. Clear the balance first.',
      );
    }

    const terminatedLease = await this.prisma.$transaction(async (tx) => {
      const updatedLease = await tx.lease.update({
        where: { id },
        data: {
          status: LeaseStatus.TERMINATED,
          isActive: false,
          terminatedAt: new Date(),
          terminationReason: reason || 'Terminated by admin',
        },
      });

      // Update unit status to VACANT
      await tx.unit.update({
        where: { id: lease.unitId },
        data: { status: UnitStatus.VACANT },
      });

      return updatedLease;
    });

    return this.findOne(terminatedLease.id, organizationId, userId);
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
