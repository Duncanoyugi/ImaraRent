import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Log request start
    this.logger.debug(`Request started: ${method} ${url}`, undefined, {
      context: 'HTTP',
      method,
      url,
      ip,
      userAgent,
      userId: request.user?.id,
    });

    return next.handle().pipe(
      tap({
        next: (_data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log success response
          this.logger.logRequest(request, response, duration);

          // Log slow requests (> 1000ms)
          if (duration > 1000) {
            this.logger.warn(
              `Slow request: ${method} ${url} took ${duration}ms`,
              undefined,
              {
                context: 'HTTP',
                method,
                url,
                duration,
                statusCode,
              },
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Request failed: ${method} ${url}`,
            error.stack,
            'HTTP',
            {
              method,
              url,
              duration,
              statusCode: error.status || 500,
              error: error.message,
              userId: request.user?.id,
            },
          );
        },
      }),
    );
  }
}
