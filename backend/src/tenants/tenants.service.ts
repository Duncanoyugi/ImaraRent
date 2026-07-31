import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { TenantStatus } from '@prisma/client';
import { hash } from 'argon2';
import * as crypto from 'crypto';
import { CreateTenantDto, UpdateTenantDto, AcceptInvitationDto } from './dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, organizationId: string, dto: CreateTenantDto) {
    // Verify user belongs to this organization
    await this.verifyUserOrganization(userId, organizationId);

    // Verify unit exists and belongs to this organization
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: dto.unitId,
        property: {
          organizationId,
        },
      },
      include: {
        property: true,
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

    // Check if tenant email already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { email: dto.email },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this email already exists');
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        nationalId: dto.nationalId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        organizationId,
        status: TenantStatus.PENDING,
        invitationToken: token,
        invitationSentAt: new Date(),
        invitationExpires: expiresAt,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    // TODO: Queue invitation email/SMS
    // We'll implement this in the notifications module

    return {
      ...tenant,
      invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`,
    };
  }

  async findAll(organizationId: string, userId: string, status?: TenantStatus) {
    await this.verifyUserOrganization(userId, organizationId);

    const where: any = {
      organizationId,
    };

    if (status) {
      where.status = status;
    }

    const tenants = await this.prisma.tenant.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        leases: {
          where: { isActive: true },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            rentAmount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tenants.map((tenant) => {
      const activeLease = tenant.leases?.[0] || null;

      return {
        ...tenant,
        activeLease,
        hasUserAccount: !!tenant.userId,
      };
    });
  }

  async findOne(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        leases: {
          include: {
            unit: {
              select: {
                id: true,
                number: true,
                property: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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
              take: 5,
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        maintenanceTickets: {
          where: { status: { not: 'CLOSED' } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const activeLease = tenant.leases.find((lease) => lease.isActive);
    const leaseHistory = tenant.leases.filter((lease) => !lease.isActive);

    return {
      ...tenant,
      activeLease: activeLease || null,
      leaseHistory,
      totalInvoices: tenant.leases.reduce(
        (sum, lease) => sum + lease.invoices.length,
        0,
      ),
      totalPayments: tenant.payments?.length || 0,
      totalMaintenanceTickets: tenant.maintenanceTickets?.length || 0,
    };
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    dto: UpdateTenantDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        nationalId: dto.nationalId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        status: dto.status,
      },
    });

    return updatedTenant;
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        invitationToken: dto.token,
      },
      include: {
        organization: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (tenant.status !== TenantStatus.PENDING) {
      throw new BadRequestException(
        'Invitation has already been used or expired',
      );
    }

    if (tenant.invitationExpires && tenant.invitationExpires < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user already exists with this email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: tenant.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Hash password
    const passwordHash = await hash(dto.password);

    // Create user account in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: tenant.email,
          passwordHash,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          phone: tenant.phone,
          role: 'TENANT',
          organizationId: tenant.organizationId,
          isActive: true,
        },
      });

      // Update tenant with user and status
      const updatedTenant = await tx.tenant.update({
        where: { id: tenant.id },
        data: {
          userId: user.id,
          status: TenantStatus.ACTIVE,
          invitationAcceptedAt: new Date(),
          invitationToken: null,
          invitationExpires: null,
        },
      });

      return { user, tenant: updatedTenant };
    });

    return result;
  }

  async resendInvitation(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (tenant.status !== TenantStatus.PENDING) {
      throw new BadRequestException('Only pending invitations can be resent');
    }

    // Check resend cooldown (5 minutes)
    if (tenant.invitationResendAt) {
      const cooldownMinutes = 5;
      const cooldownMs = cooldownMinutes * 60 * 1000;
      const timeSinceLastResend =
        Date.now() - new Date(tenant.invitationResendAt).getTime();

      if (timeSinceLastResend < cooldownMs) {
        const remainingMinutes = Math.ceil(
          (cooldownMs - timeSinceLastResend) / 60000,
        );
        throw new BadRequestException(
          `Please wait ${remainingMinutes} minute(s) before resending`,
        );
      }
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updatedTenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        invitationToken: token,
        invitationExpires: expiresAt,
        invitationSentAt: new Date(),
        invitationResendAt: new Date(),
      },
    });

    // TODO: Queue invitation email/SMS

    return {
      ...updatedTenant,
      invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`,
    };
  }

  async cancelInvitation(
    id: string,
    organizationId: string,
    userId: string,
    reason?: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (tenant.status !== TenantStatus.PENDING) {
      throw new BadRequestException(
        'Only pending invitations can be cancelled',
      );
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledBy: userId,
        cancellationReason: reason || 'Cancelled by admin',
        invitationToken: null,
        invitationExpires: null,
      },
    });

    return updatedTenant;
  }

  async deleteTenant(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        leases: {
          where: { isActive: true },
        },
        invoices: {
          where: {
            status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Check if tenant has active lease
    if (tenant.leases.length > 0) {
      throw new ForbiddenException(
        'Cannot delete tenant with active lease. Terminate the lease first.',
      );
    }

    // Check if tenant has outstanding invoices
    if (tenant.invoices.length > 0) {
      throw new ForbiddenException(
        'Cannot delete tenant with outstanding invoices. Clear the balance first.',
      );
    }

    // Soft delete
    const deletedTenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.INACTIVE,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return deletedTenant;
  }

  async getTenantByUnit(
    unitId: string,
    organizationId: string,
    userId: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const lease = await this.prisma.lease.findFirst({
      where: {
        unitId,
        isActive: true,
        tenant: {
          organizationId,
          status: TenantStatus.ACTIVE,
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
        invoices: {
          where: {
            status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] },
          },
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('No active tenant found for this unit');
    }

    const tenant = lease.tenant;
    const outstandingBalance = lease.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.balance),
      0,
    );

    return {
      ...tenant,
      activeLease: lease,
      outstandingBalance: outstandingBalance || 0,
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
