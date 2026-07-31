import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma/prisma.service';
import { BillingService } from './billing.service';

@Injectable()
export class InvoiceSchedulerService {
  private readonly logger = new Logger(InvoiceSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  @Cron('0 0 1 * *') // Run at midnight on the 1st of every month
  async generateMonthlyInvoices() {
    this.logger.log('Starting monthly invoice generation...');

    try {
      // Get all organizations with active leases
      const organizations = await this.prisma.organization.findMany({
        select: { id: true },
      });

      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      let totalGenerated = 0;

      for (const org of organizations) {
        try {
          const result = await this.billingService.generateInvoices(org.id, {
            periodStart: periodStart.toISOString(),
            periodEnd: periodEnd.toISOString(),
          });

          totalGenerated += result.generated;

          if (result.generated > 0) {
            this.logger.log(
              `Generated ${result.generated} invoices for organization ${org.id}`,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to generate invoices for organization ${org.id}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Monthly invoice generation complete. Total: ${totalGenerated}`,
      );
    } catch (error) {
      this.logger.error(`Monthly invoice generation failed: ${error.message}`);
    }
  }

  @Cron('0 0 * * *') // Run daily at midnight
  async updateOverdueInvoices() {
    this.logger.log('Checking for overdue invoices...');

    try {
      const overdueInvoices = await this.prisma.invoice.updateMany({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            in: ['PENDING', 'PARTIALLY_PAID'],
          },
        },
        data: {
          status: 'OVERDUE',
        },
      });

      if (overdueInvoices.count > 0) {
        this.logger.log(`Updated ${overdueInvoices.count} invoices to OVERDUE`);
      }
    } catch (error) {
      this.logger.error(`Failed to update overdue invoices: ${error.message}`);
    }
  }
}
