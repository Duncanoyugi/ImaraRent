import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/logger/logging.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  const frontendUrl = process.env.FRONTEND_URL;

  app.enableCors({
    origin: frontendUrl
      ? frontendUrl
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : ['http://localhost:5173'],
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global logging interceptor
  const appLogger = app.get(AppLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

  /*
   * Swagger
   *
   * Swagger generation can consume a significant amount of memory
   * in a large NestJS application because it scans controllers,
   * DTOs, decorators and route metadata.
   *
   * Enable it explicitly with ENABLE_SWAGGER=true.
   */
  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('ImaraRent API')
      .setDescription(
        'Property Management System API - Production Ready',
      )
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

    logger.log('📚 Swagger documentation enabled');
  } else {
    logger.log('📚 Swagger documentation disabled');
  }

  // Render provides PORT through the environment.
  const port = Number(process.env.PORT) || 3000;

  // Bind to 0.0.0.0 so Render can detect the application port.
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application running on port ${port}`);
  logger.log(`❤️ Health check: /api/v1/health`);
  logger.log(`📊 Metrics: /api/v1/metrics`);
  logger.log(
    `🔍 Sentry ${process.env.SENTRY_DSN ? 'enabled' : 'disabled'}`,
  );
}

bootstrap().catch((error: unknown) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
