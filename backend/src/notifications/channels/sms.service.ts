import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface SmsOptions {
  to: string;
  message: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string | undefined;
  private readonly username: string | undefined;
  private readonly senderId: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get('AFRICA_TALKING_API_KEY');
    this.username = this.config.get('AFRICA_TALKING_USERNAME');
    this.senderId = this.config.get('AFRICA_TALKING_SENDER_ID') || 'ImaraRent';
    this.baseUrl = 'https://api.africastalking.com/version1/messaging';
  }

  async send(options: SmsOptions): Promise<boolean> {
    if (!this.apiKey || !this.username) {
      this.logger.warn(
        "Africa's Talking configuration incomplete. SMS service will be disabled.",
      );
      return false;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}`,
        {
          username: this.username,
          to: options.to,
          message: options.message,
          from: this.senderId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            apiKey: this.apiKey,
          },
        },
      );

      const result = response.data;
      if (result.SMSMessageData?.Recipients?.length > 0) {
        const recipient = result.SMSMessageData.Recipients[0];
        if (recipient.status === 'Success') {
          this.logger.log(`SMS sent to ${options.to}: ${recipient.messageId}`);
          return true;
        } else {
          this.logger.error(
            `SMS failed for ${options.to}: ${recipient.status}`,
          );
          return false;
        }
      }

      this.logger.error(`SMS response invalid: ${JSON.stringify(result)}`);
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${options.to}: ${error.response?.data || error.message}`,
      );
      return false;
    }
  }

  async sendBulk(
    recipients: string[],
    message: string,
  ): Promise<{ success: string[]; failed: string[] }> {
    const results: { success: string[]; failed: string[] } = {
      success: [],
      failed: [],
    };

    for (const recipient of recipients) {
      try {
        const success = await this.send({ to: recipient, message });
        if (success) {
          results.success.push(recipient);
        } else {
          results.failed.push(recipient);
        }
      } catch {
        results.failed.push(recipient);
      }
    }

    return results;
  }
}
