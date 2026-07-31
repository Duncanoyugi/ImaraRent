import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.config.get('SMTP_HOST');
    const port = this.config.get('SMTP_PORT');
    const user = this.config.get('SMTP_USER');
    const pass = this.config.get('SMTP_PASS');

    if (!host || !port || !user || !pass) {
      this.logger.warn(
        'SMTP configuration incomplete. Email service will be disabled.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const from =
        options.from ||
        this.config.get('EMAIL_FROM') ||
        'noreply@imararent.com';

      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        html: options.html,
      });

      this.logger.log(`Email sent to ${options.to}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${error.message}`,
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
      try {
        await this.send({ ...options, to: recipient });
        results.success.push(recipient);
      } catch (error) {
        this.logger.error(
          `Failed to send email to ${recipient}: ${error.message}`,
        );
        results.failed.push(recipient);
      }
    }

    return results;
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      this.logger.error(
        `SMTP connection verification failed: ${error.message}`,
      );
      return false;
    }
  }
}
