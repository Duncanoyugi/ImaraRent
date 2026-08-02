import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/logger/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors
  const appLogger = app.get(AppLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('ImaraRent API')
    .setDescription('Property Management System API - Production Ready')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Organizations')
    .addTag('Users')
    .addTag('Properties')
    .addTag('Units')
    .addTag('Tenants')
    .addTag('Leases')
    .addTag('Billing')
    .addTag('Payments')
    .addTag('Notifications')
    .addTag('Maintenance')
    .addTag('Tenant Portal')
    .addTag('Reports')
    .addTag('Health')
    .addTag('Metrics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log startup
  logger.log(`🚀 Application running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs on http://localhost:${port}/api/docs`);
  logger.log(`❤️  Health check on http://localhost:${port}/api/v1/health`);
  logger.log(`📊 Metrics on http://localhost:${port}/api/v1/metrics`);
  logger.log(`🔍 Sentry ${process.env.SENTRY_DSN ? 'enabled' : 'disabled'}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
