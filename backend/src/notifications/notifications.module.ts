import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationProcessor } from './notification.processor';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { InAppService } from './channels/in-app.service';
import { TemplateService } from './channels/template.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationProcessor,
    EmailService,
    SmsService,
    InAppService,
    TemplateService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
