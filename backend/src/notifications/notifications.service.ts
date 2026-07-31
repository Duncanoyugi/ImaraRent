import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  NotificationStatus,
  NotificationChannel,
  NotificationType,
} from '@prisma/client';
import { SendNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async send(dto: SendNotificationDto) {
    // Validate recipient
    const recipient = this.getRecipient(dto);

    // Create notification record
    const notification = await this.prisma.notification.create({
      data: {
        type: dto.type,
        channel: dto.channel,
        recipient,
        subject: dto.subject || this.getDefaultSubject(dto.type),
        content: dto.content,
        status: NotificationStatus.PENDING,
        tenantId: dto.tenantId,
        userId: dto.userId,
        retryCount: 0,
      },
    });

    // Queue the notification
    await this.notificationQueue.add(
      'send-notification',
      {
        notificationId: notification.id,
        type: dto.type,
        channel: dto.channel,
        recipient,
        subject: notification.subject,
        content: dto.content,
        metadata: dto.metadata || {},
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    this.logger.log(`Notification queued: ${notification.id} (${dto.channel})`);

    return notification;
  }

  async sendBulk(notifications: SendNotificationDto[]) {
    const results: {
      success: boolean;
      notification?: any;
      error?: string;
      dto?: SendNotificationDto;
    }[] = [];

    for (const dto of notifications) {
      try {
        const result = await this.send(dto);
        results.push({ success: true, notification: result });
      } catch (error) {
        this.logger.error(`Failed to queue notification: ${error.message}`);
        results.push({ success: false, error: error.message, dto });
      }
    }

    return {
      total: notifications.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }

  async sendWithTemplate(
    type: NotificationType,
    channel: NotificationChannel,
    recipient: string,
    templateData: Record<string, any>,
    tenantId?: string,
    userId?: string,
  ) {
    // Get template
    const template = await this.prisma.notificationTemplate.findFirst({
      where: {
        type,
        isActive: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`No template found for ${type}`);
    }

    // Render template (using Handlebars in the processor)
    // For now, we'll pass the template data

    return this.send({
      type,
      channel,
      email: channel === 'EMAIL' ? recipient : undefined,
      phone: channel === 'SMS' ? recipient : undefined,
      subject: template.subject,
      content: template.templatePath, // Will be rendered in processor
      tenantId,
      userId,
      metadata: templateData,
    });
  }

  async getStatus(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async getByTenant(tenantId: string) {
    return this.prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async retryFailed(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.status !== NotificationStatus.FAILED) {
      throw new BadRequestException('Only failed notifications can be retried');
    }

    if (notification.retryCount >= 3) {
      throw new BadRequestException('Max retries reached');
    }

    // Reset status and queue again
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.PENDING,
      },
    });

    await this.notificationQueue.add(
      'send-notification',
      {
        notificationId: notification.id,
        type: notification.type,
        channel: notification.channel,
        recipient: notification.recipient,
        subject: notification.subject,
        content: notification.content,
        metadata: {},
        isRetry: true,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    return { message: 'Notification queued for retry' };
  }

  private getRecipient(dto: SendNotificationDto): string {
    if (dto.channel === 'EMAIL') {
      if (!dto.email) {
        // Try to get from tenant or user
        if (dto.tenantId) {
          // Look up tenant email
          // This would be async, but we'll handle in the processor
        }
        throw new BadRequestException('Email is required for EMAIL channel');
      }
      return dto.email;
    }

    if (dto.channel === 'SMS') {
      if (!dto.phone) {
        throw new BadRequestException('Phone is required for SMS channel');
      }
      return dto.phone;
    }

    if (dto.channel === 'IN_APP') {
      if (!dto.userId) {
        throw new BadRequestException('UserId is required for IN_APP channel');
      }
      return dto.userId;
    }

    throw new BadRequestException('Invalid channel');
  }

  private getDefaultSubject(type: NotificationType): string {
    const subjects = {
      TENANT_INVITATION: 'Welcome to ImaraRent - Complete Your Registration',
      RENT_DUE: 'Rent Due Reminder',
      PAYMENT_RECEIVED: 'Payment Confirmation',
      LEASE_EXPIRING: 'Lease Expiring Soon',
      MAINTENANCE_UPDATE: 'Maintenance Request Update',
      ANNOUNCEMENT: 'Important Announcement',
    };
    return subjects[type] || 'Notification from ImaraRent';
  }
}
