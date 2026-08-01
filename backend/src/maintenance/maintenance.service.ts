import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  MaintenanceStatus,
  MaintenancePriority,
  UserRole,
} from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto, AddPhotoDto } from './dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(
    tenantId: string,
    organizationId: string,
    userId: string,
    dto: CreateTicketDto,
  ) {
    // Verify tenant belongs to this organization
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
        organizationId,
      },
      include: {
        user: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found in this organization');
    }

    // Verify unit belongs to this organization
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: dto.unitId,
        property: {
          organizationId,
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found in this organization');
    }

    // Create ticket
    const ticket = await this.prisma.maintenanceTicket.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority || MaintenancePriority.MEDIUM,
        status: MaintenanceStatus.OPEN,
        tenantId,
        unitId: dto.unitId,
        createdById: userId,
      },
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
            email: true,
          },
        },
      },
    });

    // TODO: Send notification to managers
    // We'll implement this when we have the notification module fully integrated

    return ticket;
  }

  async findAll(
    organizationId: string,
    userId: string,
    status?: MaintenanceStatus,
    unitId?: string,
    assignedToId?: string,
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

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const tickets = await this.prisma.maintenanceTicket.findMany({
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
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        photos: true,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return tickets;
  }

  async findOne(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const ticket = await this.prisma.maintenanceTicket.findFirst({
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
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        photos: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    return ticket;
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    dto: UpdateTicketDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const ticket = await this.prisma.maintenanceTicket.findFirst({
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
          select: {
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
                name: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    // Check if user has permission to update
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Tenants can only update their own tickets (add info)
    if (user.role === UserRole.TENANT) {
      if (ticket.createdById !== userId) {
        throw new ForbiddenException('You can only update your own tickets');
      }

      // Tenants can only update description
      const updateData: any = {};
      if (dto.title) updateData.title = dto.title;
      if (dto.description) updateData.description = dto.description;
      // Tenants cannot change status, priority, assignment, or cost

      const updatedTicket = await this.prisma.maintenanceTicket.update({
        where: { id },
        data: updateData,
      });

      return this.findOne(updatedTicket.id, organizationId, userId);
    }

    // Owners and Managers can update everything
    const updateData: any = {};

    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.priority) updateData.priority = dto.priority;
    if (dto.status) updateData.status = dto.status;
    if (dto.cost !== undefined && dto.cost !== null) updateData.cost = dto.cost;

    // If assigning to someone
    if (dto.assignedToId) {
      // Verify assigned user exists and belongs to same organization
      const assignedUser = await this.prisma.user.findFirst({
        where: {
          id: dto.assignedToId,
          organizationId,
          role: {
            in: [UserRole.OWNER, UserRole.MANAGER],
          },
        },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          'User not found or not authorized to be assigned',
        );
      }

      updateData.assignedToId = dto.assignedToId;
    }

    // If setting status to COMPLETED, set completedAt
    if (dto.status === MaintenanceStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    const updatedTicket = await this.prisma.maintenanceTicket.update({
      where: { id },
      data: updateData,
    });

    // TODO: Send notification to tenant about status change

    return this.findOne(updatedTicket.id, organizationId, userId);
  }

  async assignTicket(
    id: string,
    organizationId: string,
    userId: string,
    assignToUserId: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const ticket = await this.prisma.maintenanceTicket.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    // Verify assignee exists and is a manager/owner
    const assignee = await this.prisma.user.findFirst({
      where: {
        id: assignToUserId,
        organizationId,
        role: {
          in: [UserRole.OWNER, UserRole.MANAGER],
        },
      },
    });

    if (!assignee) {
      throw new NotFoundException(
        'User not found or not authorized to be assigned',
      );
    }

    const updatedTicket = await this.prisma.maintenanceTicket.update({
      where: { id },
      data: {
        assignedToId: assignToUserId,
        status: MaintenanceStatus.ASSIGNED,
      },
    });

    // TODO: Send notification to assigned user

    return this.findOne(updatedTicket.id, organizationId, userId);
  }

  async completeTicket(
    id: string,
    organizationId: string,
    userId: string,
    resolutionNotes?: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const ticket = await this.prisma.maintenanceTicket.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    const updatedTicket = await this.prisma.maintenanceTicket.update({
      where: { id },
      data: {
        status: MaintenanceStatus.COMPLETED,
        completedAt: new Date(),
        description: resolutionNotes
          ? `${ticket.description}\n\nResolution: ${resolutionNotes}`
          : ticket.description,
      },
    });

    // TODO: Send notification to tenant

    return this.findOne(updatedTicket.id, organizationId, userId);
  }

  async addPhoto(
    id: string,
    organizationId: string,
    userId: string,
    dto: AddPhotoDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const ticket = await this.prisma.maintenanceTicket.findFirst({
      where: {
        id,
        unit: {
          property: {
            organizationId,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    const photo = await this.prisma.maintenancePhoto.create({
      data: {
        fileUrl: dto.fileUrl,
        ticketId: id,
      },
    });

    return photo;
  }

  async getTicketStats(organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const [total, open, assigned, inProgress, completed, byPriority] =
      await Promise.all([
        this.prisma.maintenanceTicket.count({
          where: { unit: { property: { organizationId } } },
        }),
        this.prisma.maintenanceTicket.count({
          where: {
            unit: { property: { organizationId } },
            status: MaintenanceStatus.OPEN,
          },
        }),
        this.prisma.maintenanceTicket.count({
          where: {
            unit: { property: { organizationId } },
            status: MaintenanceStatus.ASSIGNED,
          },
        }),
        this.prisma.maintenanceTicket.count({
          where: {
            unit: { property: { organizationId } },
            status: MaintenanceStatus.IN_PROGRESS,
          },
        }),
        this.prisma.maintenanceTicket.count({
          where: {
            unit: { property: { organizationId } },
            status: MaintenanceStatus.COMPLETED,
          },
        }),
        this.prisma.maintenanceTicket.groupBy({
          by: ['priority'],
          where: { unit: { property: { organizationId } } },
          _count: true,
        }),
      ]);

    const priorityCounts = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    byPriority.forEach((item) => {
      priorityCounts[item.priority] = item._count;
    });

    return {
      total,
      open,
      assigned,
      inProgress,
      completed,
      byPriority: priorityCounts,
    };
  }

  async getMyTickets(userId: string, organizationId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If tenant, get tickets they created
    if (user.role === UserRole.TENANT) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { userId },
      });

      if (!tenant) {
        throw new NotFoundException('Tenant profile not found');
      }

      return this.prisma.maintenanceTicket.findMany({
        where: { tenantId: tenant.id },
        include: {
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
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          photos: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // If manager/owner, get tickets assigned to them
    return this.prisma.maintenanceTicket.findMany({
      where: { assignedToId: userId },
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
            email: true,
          },
        },
        photos: true,
      },
      orderBy: { createdAt: 'desc' },
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
