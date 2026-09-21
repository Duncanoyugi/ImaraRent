import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface Sender {
  email: string;
  name?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client?: BrevoClient;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('BREVO_API_KEY');

    if (this.isEnabled() && apiKey) {
      this.client = new BrevoClient({
        apiKey,
        timeoutInSeconds: 30,
        maxRetries: 3,
      });
    } else if (this.isEnabled()) {
      this.logger.warn(
        'BREVO_API_KEY is not configured. Email delivery is disabled.',
      );
    } else {
      this.logger.log('Email delivery is disabled by MAIL_ENABLED.');
    }
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.client) {
      this.logger.error('Brevo email client is not initialized');
      return false;
    }

    try {
      const sender = this.getSender(options.from);
      const result = await this.client.transactionalEmails.sendTransacEmail({
        sender,
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || this.stripHtml(options.html),
      });

      this.logger.log(`Email sent to ${options.to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  async sendBulk(
    recipients: string[],
    options: Omit<EmailOptions, 'to'>,
  ): Promise<{ success: string[]; failed: string[] }> {
    const results: { success: string[]; failed: string[] } = {
      success: [],
      failed: [],
    };

    for (const recipient of recipients) {
      const sent = await this.send({ ...options, to: recipient });
      if (sent) {
        results.success.push(recipient);
      } else {
        results.failed.push(recipient);
      }
    }

    return results;
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.account.getAccount();
      return true;
    } catch (error) {
      this.logger.error(
        `Brevo connection verification failed: ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  private isEnabled(): boolean {
    return this.config.get<string>('MAIL_ENABLED')?.toLowerCase() !== 'false';
  }

  private getSender(from?: string): Sender {
    const configuredEmail = this.config.get<string>('MAIL_FROM_EMAIL');
    const configuredName = this.config.get<string>('MAIL_FROM_NAME');
    const sender = from || configuredEmail;

    if (!sender) {
      throw new Error('MAIL_FROM_EMAIL is not configured');
    }

    const match = sender.match(/^\s*(?:([^<>]+?)\s*)?<([^<>\s]+)>\s*$/);
    if (match) {
      return { email: match[2], name: match[1]?.trim() };
    }

    return { email: sender.trim(), name: configuredName };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
