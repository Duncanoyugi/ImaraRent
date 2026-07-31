import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InvoiceStatus, LeaseStatus, InvoiceLineType } from '@prisma/client';
import {
  CreateInvoiceDto,
  GenerateInvoicesDto,
  UpdateInvoiceDto,
  AddInvoiceLineDto,
} from './dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async generateInvoices(organizationId: string, dto: GenerateInvoicesDto) {
    // Find all active leases in this organization
    const activeLeases = await this.prisma.lease.findMany({
      where: {
        unit: {
          property: {
            organizationId,
          },
        },
        isActive: true,
        status: LeaseStatus.ACTIVE,
      },
      include: {
        tenant: true,
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (activeLeases.length === 0) {
      return { message: 'No active leases found', generated: 0 };
    }

    const invoices: any[] = [];
    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(dto.periodEnd);
    dueDate.setDate(dueDate.getDate() + 5); // 5 days grace period

    for (const lease of activeLeases) {
      // Check if invoice already exists for this period
      const existingInvoice = await this.prisma.invoice.findFirst({
        where: {
          leaseId: lease.id,
          issueDate: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
      });

      if (existingInvoice) {
        continue; // Skip if already generated
      }

      // Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber();

      // Create invoice
      const invoice = await this.prisma.$transaction(async (tx) => {
        const newInvoice = await tx.invoice.create({
          data: {
            invoiceNumber,
            issueDate: new Date(),
            dueDate,
            totalAmount: Number(lease.rentAmount),
            paidAmount: 0,
            balance: Number(lease.rentAmount),
            status: InvoiceStatus.PENDING,
            description: `Rent for ${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`,
            tenantId: lease.tenantId,
            leaseId: lease.id,
          },
        });

        // Create invoice line for rent
        await tx.invoiceLine.create({
          data: {
            description: `Monthly rent - ${periodStart.toLocaleDateString()} to ${periodEnd.toLocaleDateString()}`,
            amount: Number(lease.rentAmount),
            type: InvoiceLineType.RENT,
            invoiceId: newInvoice.id,
          },
        });

        return newInvoice;
      });

      invoices.push(invoice);
    }

    return {
      message: `Generated ${invoices.length} invoices`,
      generated: invoices.length,
      invoices,
    };
  }

  async createManualInvoice(
    organizationId: string,
    userId: string,
    dto: CreateInvoiceDto,
  ) {
    // Verify user belongs to organization
    await this.verifyUserOrganization(userId, organizationId);

    // Verify lease exists and belongs to organization
    const lease = await this.prisma.lease.findFirst({
      where: {
        id: dto.leaseId,
        unit: {
          property: {
            organizationId,
          },
        },
        isActive: true,
      },
      include: {
        tenant: true,
      },
    });

    if (!lease) {
      throw new NotFoundException(
        'Active lease not found in this organization',
      );
    }

    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = await this.prisma.$transaction(async (tx) => {
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          issueDate: new Date(),
          dueDate: new Date(dto.dueDate),
          totalAmount: dto.totalAmount,
          paidAmount: 0,
          balance: dto.totalAmount,
          status: InvoiceStatus.PENDING,
          description: dto.description || 'Manual invoice',
          tenantId: lease.tenantId,
          leaseId: dto.leaseId,
        },
      });

      // Create invoice line
      await tx.invoiceLine.create({
        data: {
          description: dto.description || 'Manual charge',
          amount: dto.totalAmount,
          type: InvoiceLineType.RENT,
          invoiceId: newInvoice.id,
        },
      });

      return newInvoice;
    });

    return this.findOne(invoice.id, organizationId, userId);
  }

  async addInvoiceLine(
    invoiceId: string,
    organizationId: string,
    userId: string,
    dto: AddInvoiceLineDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenant: {
          organizationId,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (
      invoice.status === InvoiceStatus.PAID ||
      invoice.status === InvoiceStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot add lines to paid or cancelled invoice',
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Create invoice line
      const line = await tx.invoiceLine.create({
        data: {
          description: dto.description,
          amount: dto.amount,
          type: dto.type,
          invoiceId: invoiceId,
        },
      });

      // Update invoice totals
      const totalAmount = Number(invoice.totalAmount) + dto.amount;
      const balance = totalAmount - Number(invoice.paidAmount);

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          totalAmount,
          balance,
          status: balance > 0 ? InvoiceStatus.PENDING : InvoiceStatus.PAID,
        },
      });

      return { line, invoice: updatedInvoice };
    });

    return result;
  }

  async findAll(
    organizationId: string,
    userId: string,
    status?: InvoiceStatus,
    tenantId?: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const where: any = {
      tenant: {
        organizationId,
      },
    };

    if (status) {
      where.status = status;
    }

    if (tenantId) {
      where.tenantId = tenantId;
    }

    const invoices = await this.prisma.invoice.findMany({
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
        lease: {
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
          },
        },
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invoices;
  }

  async findOne(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        tenant: {
          organizationId,
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
        lines: {
          orderBy: { createdAt: 'asc' },
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
                status: true,
              },
            },
          },
          orderBy: { allocatedAt: 'asc' },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    dto: UpdateInvoiceDto,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        tenant: {
          organizationId,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (
      invoice.status === InvoiceStatus.PAID ||
      invoice.status === InvoiceStatus.CANCELLED
    ) {
      throw new BadRequestException('Cannot update paid or cancelled invoice');
    }

    const updateData: any = {};

    if (dto.dueDate) {
      updateData.dueDate = new Date(dto.dueDate);
    }

    if (dto.totalAmount !== undefined) {
      updateData.totalAmount = dto.totalAmount;
      updateData.balance = dto.totalAmount - Number(invoice.paidAmount);
    }

    if (dto.description) {
      updateData.description = dto.description;
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return this.findOne(updatedInvoice.id, organizationId, userId);
  }

  async voidInvoice(
    id: string,
    organizationId: string,
    userId: string,
    reason?: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        tenant: {
          organizationId,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot void a paid invoice');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Invoice already voided');
    }

    const voidedInvoice = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.CANCELLED,
        description: invoice.description
          ? `${invoice.description} (Voided: ${reason || 'No reason provided'})`
          : `Voided: ${reason || 'No reason provided'}`,
      },
    });

    return voidedInvoice;
  }

  async getTenantInvoices(
    tenantId: string,
    organizationId: string,
    userId: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.invoice.findMany({
      where: {
        tenantId,
      },
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTenantBalance(
    tenantId: string,
    organizationId: string,
    userId: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

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
      tenantId,
      totalBalance,
      totalDue,
      totalPaid,
      invoiceCount: invoices.length,
      overdueInvoices: invoices.filter(
        (inv) => inv.status === InvoiceStatus.OVERDUE,
      ).length,
    };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
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
