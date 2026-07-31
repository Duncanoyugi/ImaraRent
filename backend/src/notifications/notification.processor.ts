import { Logger, OnModuleInit } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationStatus } from '@prisma/client';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { InAppService } from './channels/in-app.service';
import { TemplateService } from './channels/template.service';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly inAppService: InAppService,
    private readonly templateService: TemplateService,
  ) {
    super();
  }

  onModuleInit() {
    this.logger.log('Notification processor initialized');
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const {
      notificationId,
      type,
      channel,
      recipient,
      subject,
      content,
      metadata,
      isRetry: _isRetry,
    } = job.data;

    this.logger.log(`Processing notification ${notificationId} via ${channel}`);

    try {
      let success = false;
      const sentAt = new Date();

      // Render content if it's a template path
      let renderedContent = content;
      if (content.endsWith('.hbs') || content.includes('{{')) {
        renderedContent = await this.templateService.render(
          content,
          metadata || {},
          type,
        );
      }

      // Send via appropriate channel
      switch (channel) {
        case 'EMAIL':
          success = await this.emailService.send({
            to: recipient,
            subject: subject || 'Notification from ImaraRent',
            html: renderedContent,
            text: this.stripHtml(renderedContent),
          });
          break;

        case 'SMS':
          success = await this.smsService.send({
            to: recipient,
            message: this.stripHtml(renderedContent).substring(0, 160), // SMS length limit
          });
          break;

        case 'IN_APP':
          success = await this.inAppService.send({
            userId: recipient,
            title: subject || 'Notification',
            body: renderedContent,
          });
          break;

        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      if (success) {
        // Update notification status
        await this.prisma.notification.update({
          where: { id: notificationId },
          data: {
            status: NotificationStatus.SENT,
            sentAt: sentAt,
            error: null,
          },
        });

        this.logger.log(
          `Notification ${notificationId} sent successfully via ${channel}`,
        );
        return { success: true };
      } else {
        throw new Error('Channel returned failure');
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification ${notificationId}: ${error.message}`,
      );

      // Update notification status
      const retryCount = await this.getRetryCount(notificationId);
      const newRetryCount = retryCount + 1;

      const status =
        newRetryCount >= 3
          ? NotificationStatus.FAILED
          : NotificationStatus.PENDING;

      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status,
          error: error.message,
          retryCount: newRetryCount,
        },
      });

      throw error; // BullMQ will retry if attempts remain
    }
  }

  private async getRetryCount(notificationId: string): Promise<number> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
      select: { retryCount: true },
    });
    return notification?.retryCount || 0;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
