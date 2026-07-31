import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

interface InAppOptions {
  userId: string;
  title: string;
  body: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class InAppService {
  private readonly logger = new Logger(InAppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async send(options: InAppOptions): Promise<boolean> {
    try {
      // Store in-app notification
      await this.prisma.inAppNotification.create({
        data: {
          userId: options.userId,
          title: options.title,
          body: options.body,
          metadata: options.metadata || {},
          read: false,
        },
      });

      this.logger.log(`In-app notification created for user ${options.userId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to create in-app notification: ${error.message}`,
      );
      return false;
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.inAppNotification.updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to mark notification as read: ${error.message}`,
      );
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await this.prisma.inAppNotification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to mark all notifications as read: ${error.message}`,
      );
      return false;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.inAppNotification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async getNotifications(userId: string, limit = 20, offset = 0) {
    return this.prisma.inAppNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
