import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InvoiceStatus, PaymentStatus, UnitStatus } from '@prisma/client';
import { ReportRequestDto, ReportPeriod } from './dto';
import moment from 'moment';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateDateRange(
    period: ReportPeriod,
    startDate?: string,
    endDate?: string,
  ) {
    if (period === ReportPeriod.CUSTOM && startDate && endDate) {
      return {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
    }

    const now = new Date();

    switch (period) {
      case ReportPeriod.MONTH:
        return {
          startDate: moment(now).startOf('month').toDate(),
          endDate: moment(now).endOf('month').toDate(),
        };
      case ReportPeriod.QUARTER:
        return {
          startDate: moment(now).startOf('quarter').toDate(),
          endDate: moment(now).endOf('quarter').toDate(),
        };
      case ReportPeriod.YEAR:
        return {
          startDate: moment(now).startOf('year').toDate(),
          endDate: moment(now).endOf('year').toDate(),
        };
      default:
        return {
          startDate: moment(now).startOf('month').toDate(),
          endDate: moment(now).endOf('month').toDate(),
        };
    }
  }

  private getPeriodLabel(
    period: ReportPeriod,
    startDate: Date,
    endDate: Date,
  ): string {
    if (period === ReportPeriod.CUSTOM) {
      return `${moment(startDate).format('MMM D, YYYY')} - ${moment(endDate).format('MMM D, YYYY')}`;
    }
    return period.toUpperCase();
  }

  async generateIncomeStatement(
    organizationId: string,
    userId: string,
    dto: ReportRequestDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const { startDate, endDate } = this.calculateDateRange(
      dto.period || ReportPeriod.MONTH,
      dto.startDate,
      dto.endDate,
    );

    // Get all payments in date range
    const payments = await this.prisma.payment.findMany({
      where: {
        tenant: { organizationId },
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
        status: PaymentStatus.COMPLETED,
      },
      include: {
        allocations: {
          include: {
            invoice: {
              include: {
                lines: true,
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
            organizationId: true,
            userId: true,
            leases: {
              select: {
                id: true,
                unitId: true,
              },
            },
          },
        },
      },
    });

    // Get all invoices in date range
    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenant: { organizationId },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        lines: true,
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            organizationId: true,
            userId: true,
            leases: {
              select: {
                id: true,
                unitId: true,
              },
            },
          },
        },
      },
    });

    // Calculate totals
    let totalRentCollected = 0;
    let totalLateFees = 0;
    let totalUtilities = 0;
    let totalDiscounts = 0;

    payments.forEach((payment) => {
      payment.allocations.forEach((allocation) => {
        if (allocation.invoice) {
          allocation.invoice.lines.forEach((line) => {
            const amount = Number(line.amount);
            switch (line.type) {
              case 'RENT':
                totalRentCollected += amount;
                break;
              case 'LATE_FEE':
                totalLateFees += amount;
                break;
              case 'UTILITY':
                totalUtilities += amount;
                break;
              case 'DISCOUNT':
                totalDiscounts += amount;
                break;
            }
          });
        }
      });
    });

    const totalRentExpected = invoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0,
    );

    const netIncome =
      totalRentCollected + totalLateFees + totalUtilities - totalDiscounts;

    // Monthly breakdown
    const monthlyBreakdown: {
      month: string;
      expected: number;
      collected: number;
      lateFees: number;
      utilities: number;
      collectionRate: number;
    }[] = [];
    const months: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      months.push(moment(current).format('YYYY-MM'));
      current.setMonth(current.getMonth() + 1);
    }

    for (const month of months) {
      const [year, monthNum] = month.split('-').map(Number);
      const monthStart = new Date(year, monthNum - 1, 1);
      const monthEnd = new Date(year, monthNum, 0);

      const monthPayments = payments.filter((p) => {
        const pDate = new Date(p.paymentDate);
        return pDate >= monthStart && pDate <= monthEnd;
      });

      const monthInvoices = invoices.filter((inv) => {
        const invDate = new Date(inv.createdAt);
        return invDate >= monthStart && invDate <= monthEnd;
      });

      let collected = 0;
      let lateFees = 0;
      let utilities = 0;

      monthPayments.forEach((payment) => {
        payment.allocations.forEach((allocation) => {
          if (allocation.invoice) {
            allocation.invoice.lines.forEach((line) => {
              const amount = Number(line.amount);
              switch (line.type) {
                case 'RENT':
                  collected += amount;
                  break;
                case 'LATE_FEE':
                  lateFees += amount;
                  break;
                case 'UTILITY':
                  utilities += amount;
                  break;
              }
            });
          }
        });
      });

      const expected = monthInvoices.reduce(
        (sum, inv) => sum + Number(inv.totalAmount),
        0,
      );

      monthlyBreakdown.push({
        month: moment(monthStart).format('MMM YYYY'),
        expected,
        collected,
        lateFees,
        utilities,
        collectionRate: expected > 0 ? (collected / expected) * 100 : 0,
      });
    }

    // Property breakdown
    const properties = await this.prisma.property.findMany({
      where: { organizationId },
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

    const propertyBreakdown = properties.map((property) => {
      let expected = 0;
      let collected = 0;

      property.units.forEach((unit) => {
        if (unit.leases.length > 0) {
          expected += Number(unit.rentAmount);
        }
      });

      // Calculate collected for this property
      const propertyPayments = payments.filter(
        (p) => p.tenant?.leases?.[0]?.unitId === property.id,
      );
      propertyPayments.forEach((payment) => {
        payment.allocations.forEach((allocation) => {
          if (allocation.invoice) {
            allocation.invoice.lines.forEach((line) => {
              if (line.type === 'RENT') {
                collected += Number(line.amount);
              }
            });
          }
        });
      });

      return {
        propertyId: property.id,
        propertyName: property.name,
        expected,
        collected,
        collectionRate: expected > 0 ? (collected / expected) * 100 : 0,
      };
    });

    return {
      metadata: {
        generatedAt: new Date(),
        period: this.getPeriodLabel(
          dto.period || ReportPeriod.MONTH,
          startDate,
          endDate,
        ),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        organizationId,
        generatedBy: userId,
      },
      summary: {
        totalRentCollected,
        totalRentExpected,
        totalLateFees,
        totalUtilities,
        totalDiscounts,
        netIncome,
        collectionRate:
          totalRentExpected > 0
            ? (totalRentCollected / totalRentExpected) * 100
            : 0,
      },
      monthlyBreakdown,
      propertyBreakdown,
    };
  }

  async generateRentRoll(
    organizationId: string,
    userId: string,
    _dto: ReportRequestDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const properties = await this.prisma.property.findMany({
      where: { organizationId },
      include: {
        units: {
          include: {
            leases: {
              where: { isActive: true },
              include: {
                tenant: true,
              },
            },
          },
          orderBy: { number: 'asc' },
        },
      },
    });

    let totalUnits = 0;
    let occupiedUnits = 0;
    let totalMonthlyRent = 0;
    let avgRent = 0;

    const propertyData = properties.map((property) => {
      const units = property.units.map((unit) => {
        const activeLease = unit.leases[0];
        totalUnits++;
        if (activeLease) {
          occupiedUnits++;
          totalMonthlyRent += Number(unit.rentAmount);
        }

        return {
          unitId: unit.id,
          unitNumber: unit.number,
          tenantName: activeLease
            ? `${activeLease.tenant.firstName} ${activeLease.tenant.lastName}`
            : null,
          rentAmount: Number(unit.rentAmount),
          status: unit.status,
          leaseStatus: activeLease ? 'ACTIVE' : null,
        };
      });

      return {
        propertyId: property.id,
        propertyName: property.name,
        units,
      };
    });

    avgRent = totalUnits > 0 ? totalMonthlyRent / totalUnits : 0;

    return {
      metadata: {
        generatedAt: new Date(),
        period: 'Current',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        organizationId,
        generatedBy: userId,
      },
      summary: {
        totalUnits,
        occupiedUnits,
        vacantUnits: totalUnits - occupiedUnits,
        occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
        totalMonthlyRent,
        averageRent: avgRent,
      },
      properties: propertyData,
    };
  }

  async generateArrearsAging(
    organizationId: string,
    userId: string,
    _dto: ReportRequestDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    // Get all tenants with outstanding balance
    const tenants = await this.prisma.tenant.findMany({
      where: { organizationId },
      include: {
        leases: {
          include: {
            unit: {
              include: {
                property: true,
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
          orderBy: { dueDate: 'asc' },
        },
        payments: true,
      },
    });

    const _tenantsWithArrears = [] as any[];
    let totalArrears = 0;
    let tenantsInArrears = 0;

    // Aging buckets
    const agingBuckets = {
      '0-30 Days': 0,
      '31-60 Days': 0,
      '61-90 Days': 0,
      '90+ Days': 0,
    };

    const tenantArrears: {
      tenantId: string;
      tenantName: string;
      unitNumber: string;
      propertyName: string;
      totalDue: number;
      totalPaid: number;
      balance: number;
      daysOverdue: number;
      oldestInvoiceDate: string | null;
    }[] = [];

    tenants.forEach((tenant) => {
      const totalDue = tenant.invoices.reduce(
        (sum, inv) => sum + Number(inv.totalAmount),
        0,
      );
      const totalPaid = tenant.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
      );
      const balance = totalDue - totalPaid;

      if (balance > 0) {
        tenantsInArrears++;
        totalArrears += balance;

        // Calculate days overdue
        const oldestInvoice = tenant.invoices[0];
        let daysOverdue = 0;
        if (oldestInvoice) {
          daysOverdue = Math.floor(
            (new Date().getTime() - new Date(oldestInvoice.dueDate).getTime()) /
              (1000 * 60 * 60 * 24),
          );
        }

        // Determine aging bucket
        let bucket = '0-30 Days';
        if (daysOverdue > 90) bucket = '90+ Days';
        else if (daysOverdue > 60) bucket = '61-90 Days';
        else if (daysOverdue > 30) bucket = '31-60 Days';

        agingBuckets[bucket] += balance;

        tenantArrears.push({
          tenantId: tenant.id,
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          unitNumber: tenant.leases[0]?.unit?.number || 'N/A',
          propertyName: tenant.leases[0]?.unit?.property?.name || 'N/A',
          totalDue,
          totalPaid,
          balance,
          daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
          oldestInvoiceDate: oldestInvoice?.dueDate?.toISOString() || null,
        });
      }
    });

    const agingBucketsArray = Object.entries(agingBuckets).map(
      ([bucket, amount]) => ({
        bucket,
        amount,
        tenantCount: tenantArrears.filter((t) => {
          const days = t.daysOverdue;
          if (bucket === '0-30 Days') return days <= 30;
          if (bucket === '31-60 Days') return days > 30 && days <= 60;
          if (bucket === '61-90 Days') return days > 60 && days <= 90;
          return days > 90;
        }).length,
      }),
    );

    return {
      metadata: {
        generatedAt: new Date(),
        period: 'Current',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        organizationId,
        generatedBy: userId,
      },
      summary: {
        totalArrears,
        totalTenants: tenants.length,
        tenantsWithArrears: tenantsInArrears,
      },
      agingBuckets: agingBucketsArray,
      tenants: tenantArrears.sort((a, b) => b.balance - a.balance),
    };
  }

  async generateOccupancyReport(
    organizationId: string,
    userId: string,
    _dto: ReportRequestDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const properties = await this.prisma.property.findMany({
      where: { organizationId },
      include: {
        units: true,
      },
    });

    let totalUnits = 0;
    let occupiedUnits = 0;
    let vacantUnits = 0;
    let maintenanceUnits = 0;

    const propertyDetails = properties.map((property) => {
      const units = property.units || [];
      const occupied = units.filter(
        (u) => u.status === UnitStatus.OCCUPIED,
      ).length;
      const vacant = units.filter((u) => u.status === UnitStatus.VACANT).length;
      const maintenance = units.filter(
        (u) => u.status === UnitStatus.MAINTENANCE,
      ).length;

      totalUnits += units.length;
      occupiedUnits += occupied;
      vacantUnits += vacant;
      maintenanceUnits += maintenance;

      return {
        propertyId: property.id,
        propertyName: property.name,
        totalUnits: units.length,
        occupied,
        vacant,
        maintenance,
        occupancyRate: units.length > 0 ? (occupied / units.length) * 100 : 0,
      };
    });

    return {
      metadata: {
        generatedAt: new Date(),
        period: 'Current',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        organizationId,
        generatedBy: userId,
      },
      summary: {
        totalProperties: properties.length,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
        vacancyRate: totalUnits > 0 ? (vacantUnits / totalUnits) * 100 : 0,
      },
      propertyDetails,
    };
  }

  async generateMaintenanceReport(
    organizationId: string,
    userId: string,
    dto: ReportRequestDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const { startDate, endDate } = this.calculateDateRange(
      dto.period || ReportPeriod.MONTH,
      dto.startDate,
      dto.endDate,
    );

    const tickets = await this.prisma.maintenanceTicket.findMany({
      where: {
        unit: {
          property: { organizationId },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter(
      (t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS',
    ).length;
    const completedTickets = tickets.filter(
      (t) => t.status === 'COMPLETED',
    ).length;

    // Average resolution time
    let avgResolutionTime = 0;
    const completedWithDates = tickets.filter(
      (t) => t.status === 'COMPLETED' && t.completedAt,
    );
    if (completedWithDates.length > 0) {
      const totalTime = completedWithDates.reduce((sum, t) => {
        const resolutionTime =
          new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime();
        return sum + resolutionTime;
      }, 0);
      avgResolutionTime =
        totalTime / completedWithDates.length / (1000 * 60 * 60); // Hours
    }

    const totalCost = tickets.reduce((sum, t) => sum + Number(t.cost || 0), 0);

    // Priority breakdown
    const priorityBreakdown = [
      {
        priority: 'LOW',
        count: tickets.filter((t) => t.priority === 'LOW').length,
      },
      {
        priority: 'MEDIUM',
        count: tickets.filter((t) => t.priority === 'MEDIUM').length,
      },
      {
        priority: 'HIGH',
        count: tickets.filter((t) => t.priority === 'HIGH').length,
      },
      {
        priority: 'URGENT',
        count: tickets.filter((t) => t.priority === 'URGENT').length,
      },
    ];

    // Property breakdown
    const properties = await this.prisma.property.findMany({
      where: { organizationId },
    });

    const propertyBreakdown = properties.map((property) => {
      const propertyTickets = tickets.filter(
        (t) => t.unit?.propertyId === property.id,
      );
      return {
        propertyId: property.id,
        propertyName: property.name,
        total: propertyTickets.length,
        open: propertyTickets.filter((t) => t.status === 'OPEN').length,
        completed: propertyTickets.filter((t) => t.status === 'COMPLETED')
          .length,
      };
    });

    return {
      metadata: {
        generatedAt: new Date(),
        period: this.getPeriodLabel(
          dto.period || ReportPeriod.MONTH,
          startDate,
          endDate,
        ),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        organizationId,
        generatedBy: userId,
      },
      summary: {
        totalTickets,
        openTickets,
        inProgressTickets,
        completedTickets,
        averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        totalCost,
      },
      priorityBreakdown,
      propertyBreakdown,
    };
  }

  async generateTenantStatement(
    organizationId: string,
    userId: string,
    tenantId: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
        organizationId,
      },
      include: {
        leases: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Get all invoices
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      include: {
        lines: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get all payments
    const payments = await this.prisma.payment.findMany({
      where: { tenantId },
      orderBy: { paymentDate: 'asc' },
    });

    // Build transaction list
    const transactions: {
      date: string;
      description: string;
      invoiceNumber: string;
      amount: number;
      type: string;
      balance: number;
    }[] = [];
    let runningBalance = 0;

    invoices.forEach((invoice) => {
      invoice.lines.forEach((line) => {
        const amount = Number(line.amount);
        runningBalance += amount;
        transactions.push({
          date: invoice.createdAt.toISOString(),
          description: line.description,
          invoiceNumber: invoice.invoiceNumber,
          amount,
          type: 'invoice',
          balance: runningBalance,
        });
      });
    });

    payments.forEach((payment) => {
      const amount = Number(payment.amount);
      runningBalance -= amount;
      transactions.push({
        date: payment.paymentDate.toISOString(),
        description: `Payment ${payment.method}`,
        invoiceNumber: '',
        amount: -amount,
        type: 'payment',
        balance: runningBalance,
      });
    });

    // Sort by date
    transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const totalCharged = transactions
      .filter((t) => t.type === 'invoice')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPaid = transactions
      .filter((t) => t.type === 'payment')
      .reduce((sum, t) => Math.abs(sum + t.amount), 0);

    return {
      metadata: {
        generatedAt: new Date(),
        period: 'All Time',
        startDate: transactions[0]?.date || new Date().toISOString(),
        endDate: new Date().toISOString(),
        organizationId,
        generatedBy: userId,
      },
      tenantInfo: {
        id: tenant.id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        email: tenant.email,
        phone: tenant.phone,
        unitNumber: tenant.leases[0]?.unit?.number || 'N/A',
        propertyName: tenant.leases[0]?.unit?.property?.name || 'N/A',
      },
      summary: {
        totalCharged,
        totalPaid,
        balance: totalCharged - totalPaid,
      },
      transactions,
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
