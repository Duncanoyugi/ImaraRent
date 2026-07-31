import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

type HandlebarsTemplateFunction = (data: Record<string, any>) => string;

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly templatesDir = path.join(__dirname, '../../templates');
  private compiledTemplates: Map<string, HandlebarsTemplateFunction> =
    new Map();

  constructor(private readonly prisma: PrismaService) {
    this.registerHelpers();
  }

  async render(
    templatePath: string,
    data: Record<string, any>,
    type: NotificationType,
  ): Promise<string> {
    try {
      // Check if template is in database
      const dbTemplate = await this.prisma.notificationTemplate.findFirst({
        where: {
          type,
          templatePath,
          isActive: true,
        },
      });

      let templateContent: string;

      if (dbTemplate) {
        // Use database template
        templateContent = dbTemplate.content;
      } else {
        // Use file-based template
        const fullPath = path.join(this.templatesDir, templatePath);
        if (!fs.existsSync(fullPath)) {
          throw new NotFoundException(`Template not found: ${templatePath}`);
        }
        templateContent = fs.readFileSync(fullPath, 'utf-8');
      }

      // Compile and render
      const compiled = this.compileTemplate(templateContent);
      const result = compiled(data);

      return result;
    } catch (error) {
      this.logger.error(`Failed to render template: ${error.message}`);
      throw error;
    }
  }

  private compileTemplate(content: string): HandlebarsTemplateFunction {
    // Check cache
    const cacheKey = content.substring(0, 100); // Simple cache key
    if (this.compiledTemplates.has(cacheKey)) {
      return this.compiledTemplates.get(cacheKey)!;
    }

    const compiled = Handlebars.compile(content);
    this.compiledTemplates.set(cacheKey, compiled);
    return compiled;
  }

  private registerHelpers() {
    Handlebars.registerHelper('formatDate', (date: Date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });

    Handlebars.registerHelper('formatCurrency', (amount: number) => {
      if (amount === undefined || amount === null) return 'KES 0';
      return `KES ${amount.toLocaleString('en-KE')}`;
    });

    Handlebars.registerHelper('formatPhone', (phone: string) => {
      if (!phone) return '';
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    });

    Handlebars.registerHelper('truncate', (text: string, length: number) => {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    });

    Handlebars.registerHelper('capitalize', (str: string) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    });

    Handlebars.registerHelper(
      'ifEquals',
      (arg1: any, arg2: any, options: any) => {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      },
    );
  }
}
