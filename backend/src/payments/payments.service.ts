import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaymentStatus, PaymentMethod, InvoiceStatus } from '@prisma/client';
import { MpesaService } from './mpesa.service';
import { InitiateMpesaPaymentDto, ManualPaymentDto } from './dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mpesaService: MpesaService,
  ) {}

  async initiateMpesaPayment(
    organizationId: string,
    userId: string,
    dto: InitiateMpesaPaymentDto,
  ) {
    // Verify user belongs to organization
    await this.verifyUserOrganization(userId, organizationId);

    // Find invoice
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: dto.invoiceId,
        tenant: {
          organizationId,
        },
      },
      include: {
        tenant: true,
        lease: {
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

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Check if invoice is already paid
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid');
    }

    // Check if amount exceeds balance
    if (dto.amount > Number(invoice.balance)) {
      throw new BadRequestException(
        `Amount (${dto.amount}) exceeds balance (${Number(invoice.balance)})`,
      );
    }

    // Generate idempotency key
    const idempotencyKey = randomUUID();

    // Create payment record
    const payment = await this.prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          amount: dto.amount,
          paymentDate: new Date(),
          method: PaymentMethod.MPESA,
          status: PaymentStatus.PENDING,
          tenantId: invoice.tenantId,
        },
      });

      return newPayment;
    });

    // Initiate STK Push
    const phoneNumber = dto.phoneNumber.replace(/\D/g, '');
    const formattedPhone = phoneNumber.startsWith('0')
      ? `254${phoneNumber.substring(1)}`
      : phoneNumber.startsWith('254')
        ? phoneNumber
        : `254${phoneNumber}`;

    const accountReference = `INV-${invoice.invoiceNumber}`;

    let mpesaResponse;
    try {
      mpesaResponse = await this.mpesaService.initiateStkPush(
        formattedPhone,
        dto.amount,
        accountReference,
      );

      // Update payment with M-Pesa details
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          mpesaTransactionId: mpesaResponse.checkoutRequestId,
          mpesaResponse: mpesaResponse,
          reference: mpesaResponse.checkoutRequestId,
        },
      });

      // Store idempotency key
      await this.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "IdempotencyKey" (key, payment_id, created_at)
          VALUES (${idempotencyKey}, ${payment.id}, NOW())
        `;
      });

      return {
        paymentId: payment.id,
        checkoutRequestId: mpesaResponse.checkoutRequestId,
        merchantRequestId: mpesaResponse.merchantRequestId,
        status: PaymentStatus.PENDING,
        message: 'Please enter your PIN on your phone to complete payment',
      };
    } catch (error) {
      // Update payment as failed
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          mpesaResponse: { error: error.message },
        },
      });

      throw new BadRequestException(
        `Payment initiation failed: ${error.message}`,
      );
    }
  }

  async handleMpesaCallback(callbackData: any) {
    this.logger.log('Received M-Pesa callback');

    try {
      // Extract data from callback
      const stkCallback = callbackData.Body?.stkCallback;

      if (!stkCallback) {
        this.logger.error('Invalid callback structure:', callbackData);
        return { ResultCode: 1, ResultDesc: 'Invalid callback data' };
      }

      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const resultCode = stkCallback.ResultCode;

      // Find payment by checkout request ID
      const payment = await this.prisma.payment.findFirst({
        where: {
          mpesaTransactionId: checkoutRequestId,
        },
        include: {
          tenant: true,
        },
      });

      if (!payment) {
        this.logger.error(
          `Payment not found for checkout request: ${checkoutRequestId}`,
        );
        return { ResultCode: 1, ResultDesc: 'Payment not found' };
      }

      // Check if payment already processed
      if (payment.status !== PaymentStatus.PENDING) {
        this.logger.warn(
          `Payment already processed: ${payment.id} (status: ${payment.status})`,
        );
        return { ResultCode: 0, ResultDesc: 'Payment already processed' };
      }

      // Process based on result code
      if (resultCode === 0) {
        // Success
        await this.processSuccessfulPayment(payment, stkCallback);
        this.logger.log(`Payment ${payment.id} completed successfully`);
        return { ResultCode: 0, ResultDesc: 'Payment processed successfully' };
      } else {
        // Failure
        await this.processFailedPayment(payment, stkCallback);
        this.logger.warn(
          `Payment ${payment.id} failed: ${stkCallback.ResultDesc}`,
        );
        return { ResultCode: 1, ResultDesc: 'Payment failed' };
      }
    } catch (error) {
      this.logger.error('Error processing M-Pesa callback:', error);
      return {
        ResultCode: 1,
        ResultDesc: 'Internal error processing callback',
      };
    }
  }

  private async processSuccessfulPayment(payment: any, stkCallback: any) {
    // Parse metadata
    const metadata = this.mpesaService.parseCallbackMetadata({
      Body: { stkCallback },
    });

    if (!metadata) {
      throw new Error('Failed to parse callback metadata');
    }

    await this.prisma.$transaction(async (tx) => {
      // Update payment
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          mpesaTransactionId:
            metadata.receiptNumber || payment.mpesaTransactionId,
          mpesaResponse: { ...stkCallback, metadata },
          callbackPayload: stkCallback,
        },
      });

      // Find all pending invoices for this tenant
      const invoices = await tx.invoice.findMany({
        where: {
          tenantId: payment.tenantId,
          status: {
            in: [
              InvoiceStatus.PENDING,
              InvoiceStatus.PARTIALLY_PAID,
              InvoiceStatus.OVERDUE,
            ],
          },
          balance: { gt: 0 },
        },
        orderBy: { dueDate: 'asc' }, // Pay oldest first
      });

      if (invoices.length === 0) {
        // No pending invoices - create credit note
        this.logger.warn(`No pending invoices for tenant ${payment.tenantId}`);
        return;
      }

      let remainingAmount = Number(updatedPayment.amount);
      const allocations: any[] = [];

      // Allocate payment to invoices
      for (const invoice of invoices) {
        if (remainingAmount <= 0) break;

        const invoiceBalance = Number(invoice.balance);
        const allocationAmount = Math.min(remainingAmount, invoiceBalance);

        // Create allocation
        await tx.paymentAllocation.create({
          data: {
            amount: allocationAmount,
            paymentId: payment.id,
            invoiceId: invoice.id,
          },
        });

        // Update invoice
        const newPaidAmount = Number(invoice.paidAmount) + allocationAmount;
        const newBalance = invoiceBalance - allocationAmount;

        let newStatus = invoice.status;
        if (newBalance <= 0) {
          newStatus = InvoiceStatus.PAID;
        } else if (newPaidAmount > 0) {
          newStatus = InvoiceStatus.PARTIALLY_PAID;
        }

        await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaidAmount,
            balance: newBalance,
            status: newStatus,
          },
        });

        allocations.push({
          invoiceId: invoice.id,
          amount: allocationAmount,
          invoiceNumber: invoice.invoiceNumber,
        });

        remainingAmount -= allocationAmount;
      }

      // If there's remaining amount, create a credit note
      if (remainingAmount > 0) {
        this.logger.log(
          `Remaining amount ${remainingAmount} will be stored as credit`,
        );
        // TODO: Create credit note or store as tenant credit
      }
    });
  }

  private async processFailedPayment(payment: any, stkCallback: any) {
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        callbackPayload: stkCallback,
        mpesaResponse: stkCallback,
      },
    });
  }

  async recordManualPayment(
    organizationId: string,
    userId: string,
    dto: ManualPaymentDto,
  ) {
    // Verify user belongs to organization
    await this.verifyUserOrganization(userId, organizationId);

    // Verify tenant belongs to organization
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: dto.tenantId,
        organizationId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Create payment
    const payment = await this.prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          amount: dto.amount,
          paymentDate: new Date(),
          method: dto.method,
          status: PaymentStatus.COMPLETED,
          reference: dto.reference || `MANUAL-${Date.now()}`,
          tenantId: dto.tenantId,
        },
      });

      // Find pending invoices
      const invoices = await tx.invoice.findMany({
        where: {
          tenantId: dto.tenantId,
          status: {
            in: [
              InvoiceStatus.PENDING,
              InvoiceStatus.PARTIALLY_PAID,
              InvoiceStatus.OVERDUE,
            ],
          },
          balance: { gt: 0 },
        },
        orderBy: { dueDate: 'asc' },
      });

      let remainingAmount = Number(newPayment.amount);

      for (const invoice of invoices) {
        if (remainingAmount <= 0) break;

        const invoiceBalance = Number(invoice.balance);
        const allocationAmount = Math.min(remainingAmount, invoiceBalance);

        await tx.paymentAllocation.create({
          data: {
            amount: allocationAmount,
            paymentId: newPayment.id,
            invoiceId: invoice.id,
          },
        });

        const newPaidAmount = Number(invoice.paidAmount) + allocationAmount;
        const newBalance = invoiceBalance - allocationAmount;

        let newStatus = invoice.status;
        if (newBalance <= 0) {
          newStatus = InvoiceStatus.PAID;
        } else if (newPaidAmount > 0) {
          newStatus = InvoiceStatus.PARTIALLY_PAID;
        }

        await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaidAmount,
            balance: newBalance,
            status: newStatus,
          },
        });

        remainingAmount -= allocationAmount;
      }

      return newPayment;
    });

    return payment;
  }

  async findAll(organizationId: string, userId: string, tenantId?: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const where: any = {
      tenant: {
        organizationId,
      },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        allocations: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                totalAmount: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string, userId: string) {
    await this.verifyUserOrganization(userId, organizationId);

    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
        tenant: {
          organizationId,
        },
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

  async getTenantPayments(
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

    return this.prisma.payment.findMany({
      where: { tenantId },
      include: {
        allocations: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async queryPaymentStatus(
    organizationId: string,
    userId: string,
    checkoutRequestId: string,
  ) {
    await this.verifyUserOrganization(userId, organizationId);

    const payment = await this.prisma.payment.findFirst({
      where: {
        mpesaTransactionId: checkoutRequestId,
        tenant: {
          organizationId,
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    try {
      const status =
        await this.mpesaService.queryPaymentStatus(checkoutRequestId);

      // Update payment if status changed
      if (status.ResultCode === 0 && payment.status === PaymentStatus.PENDING) {
        await this.handleMpesaCallback({
          Body: {
            stkCallback: {
              CheckoutRequestID: checkoutRequestId,
              ResultCode: 0,
              ResultDesc: 'Success',
              CallbackMetadata: status.CallbackMetadata,
            },
          },
        });
      }

      return {
        paymentId: payment.id,
        status: payment.status,
        mpesaResponse: status,
      };
    } catch (error) {
      return {
        paymentId: payment.id,
        status: payment.status,
        error: error.message,
      };
    }
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
