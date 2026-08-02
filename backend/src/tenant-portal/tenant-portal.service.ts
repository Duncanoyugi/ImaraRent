import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InvoiceStatus, MaintenanceStatus } from '@prisma/client';
import { UpdateTenantProfileDto } from './dto';

@Injectable()
export class TenantPortalService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(tenantId: string, organizationId: string) {
    // Get tenant with all details
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
        organizationId,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
        leases: {
          where: { isActive: true },
          include: {
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
            invoices: {
              where: {
                status: {
                  in: [
                    InvoiceStatus.PENDING,
                    InvoiceStatus.PARTIALLY_PAID,
                    InvoiceStatus.OVERDUE,
                  ],
                },
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Get balance
    const balance = await this.getBalance(tenantId);

    // Get recent invoices (last 5)
    const recentInvoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        paidAmount: true,
        balance: true,
        status: true,
        dueDate: true,
      },
    });

    // Get recent payments (last 5)
    const recentPayments = await this.prisma.payment.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        paymentDate: true,
        method: true,
        status: true,
        reference: true,
      },
    });

    // Get open maintenance tickets
    const openMaintenanceTickets = await this.prisma.maintenanceTicket.findMany(
      {
        where: {
          tenantId,
          status: {
            not: MaintenanceStatus.CLOSED,
          },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      },
    );

    const activeLease = tenant.leases[0] || null;

    return {
      tenant: {
        id: tenant.id,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
        phone: tenant.phone,
        nationalId: tenant.nationalId,
      },
      unit: tenant.leases[0]?.unit
        ? {
            id: tenant.leases[0].unit.id,
            number: tenant.leases[0].unit.number,
            rentAmount: tenant.leases[0].unit.rentAmount,
            property: {
              id: tenant.leases[0].unit.property.id,
              name: tenant.leases[0].unit.property.name,
              address: tenant.leases[0].unit.property.address,
            },
          }
        : null,
      activeLease: activeLease
        ? {
            id: activeLease.id,
            startDate: activeLease.startDate,
            endDate: activeLease.endDate,
            rentAmount: activeLease.rentAmount,
            status: activeLease.status,
            depositAmount: activeLease.depositAmount,
            depositPaid: activeLease.depositPaid,
          }
        : null,
      balance,
      recentInvoices,
      recentPayments,
      openMaintenanceTickets,
    };
  }

  async getBalance(tenantId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: {
          in: [
            InvoiceStatus.PENDING,
            InvoiceStatus.PARTIALLY_PAID,
            InvoiceStatus.OVERDUE,
          ],
        },
      },
    });

    const totalBalance = invoices.reduce(
      (sum, inv) => sum + Number(inv.balance),
      0,
    );
    const totalDue = invoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0,
    );
    const totalPaid = invoices.reduce(
      (sum, inv) => sum + Number(inv.paidAmount),
      0,
    );

    return {
      totalBalance,
      totalDue,
      totalPaid,
      invoiceCount: invoices.length,
      overdueInvoices: invoices.filter(
        (inv) => inv.status === InvoiceStatus.OVERDUE,
      ).length,
    };
  }

  async getInvoices(tenantId: string, limit?: number, offset?: number) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      include: {
        lines: true,
        allocations: {
          include: {
            payment: {
              select: {
                id: true,
                amount: true,
                paymentDate: true,
                method: true,
                reference: true,
                mpesaTransactionId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit || 50,
      skip: offset || 0,
    });

    return invoices;
  }

  async getInvoice(invoiceId: string, tenantId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
      include: {
        lines: true,
        lease: {
          include: {
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
          },
        },
        allocations: {
          include: {
            payment: {
              select: {
                id: true,
                amount: true,
                paymentDate: true,
                method: true,
                reference: true,
                mpesaTransactionId: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async getPayments(tenantId: string, limit?: number, offset?: number) {
    const payments = await this.prisma.payment.findMany({
      where: { tenantId },
      include: {
        allocations: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                totalAmount: true,
                balance: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit || 50,
      skip: offset || 0,
    });

    return payments;
  }

  async getPayment(paymentId: string, tenantId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        tenantId,
      },
      include: {
        allocations: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                totalAmount: true,
                paidAmount: true,
                balance: true,
                status: true,
                dueDate: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getLease(tenantId: string) {
    const lease = await this.prisma.lease.findFirst({
      where: {
        tenantId,
        isActive: true,
      },
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                county: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
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
          take: 12,
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('No active lease found');
    }

    return lease;
  }

  async updateProfile(tenantId: string, dto: UpdateTenantProfileDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        nationalId: dto.nationalId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        leases: {
          where: { isActive: true },
          include: {
            unit: {
              select: {
                id: true,
                number: true,
                rentAmount: true,
                property: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return tenant;
  }

  async getMaintenanceTickets(
    tenantId: string,
    limit?: number,
    offset?: number,
  ) {
    const tickets = await this.prisma.maintenanceTicket.findMany({
      where: { tenantId },
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
      take: limit || 50,
      skip: offset || 0,
    });

    return tickets;
  }

  async getMaintenanceTicket(ticketId: string, tenantId: string) {
    const ticket = await this.prisma.maintenanceTicket.findFirst({
      where: {
        id: ticketId,
        tenantId,
      },
      include: {
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
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    return ticket;
  }

  async getNotifications(tenantId: string, limit?: number, offset?: number) {
    const notifications = await this.prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit || 50,
      skip: offset || 0,
    });

    return notifications;
  }

  async markNotificationRead(notificationId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        tenantId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // For now, we just return success since we don't have a read status on notification
    // We could add a read field to the Notification model
    return { success: true, message: 'Notification marked as read' };
  }

  async getUnreadNotificationCount(tenantId: string) {
    // Since we don't have a read status yet, we'll return total count
    // In production, you'd add a read field and count unread
    const count = await this.prisma.notification.count({
      where: { tenantId },
    });

    return { count };
  }
}
