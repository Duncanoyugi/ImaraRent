import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private context: string = 'Application';

  private getContext(): string {
    return this.context;
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string, ...optionalParams: any[]) {
    const meta = this.extractMeta(optionalParams);
    const contextStr = context || this.context;
    if (Object.keys(meta).length > 0) {
      console.log(
        `[${new Date().toISOString()}] [${contextStr}] ${message}`,
        meta,
      );
    } else {
      console.log(`[${new Date().toISOString()}] [${contextStr}] ${message}`);
    }
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    ...optionalParams: any[]
  ) {
    const meta = this.extractMeta(optionalParams);
    const contextStr = context || this.context;
    console.error(
      `[${new Date().toISOString()}] [${contextStr}] ERROR: ${message}`,
      trace ? { trace, ...meta } : meta,
    );
  }

  warn(message: any, context?: string, ...optionalParams: any[]) {
    const meta = this.extractMeta(optionalParams);
    const contextStr = context || this.context;
    console.warn(
      `[${new Date().toISOString()}] [${contextStr}] WARN: ${message}`,
      meta,
    );
  }

  debug(message: any, context?: string, ...optionalParams: any[]) {
    const meta = this.extractMeta(optionalParams);
    const contextStr = context || this.context;
    console.debug(
      `[${new Date().toISOString()}] [${contextStr}] DEBUG: ${message}`,
      meta,
    );
  }

  verbose(message: any, context?: string, ...optionalParams: any[]) {
    const meta = this.extractMeta(optionalParams);
    const contextStr = context || this.context;
    console.log(
      `[${new Date().toISOString()}] [${contextStr}] VERBOSE: ${message}`,
      meta,
    );
  }

  private extractMeta(params: any[]): Record<string, any> {
    if (params && params.length > 0 && typeof params[0] === 'object') {
      return params[0];
    }
    return {};
  }

  logRequest(req: any, res: any, duration: number) {
    const { method, url, ip, headers } = req;
    const { statusCode } = res;

    this.log(`${method} ${url} ${statusCode} ${duration}ms`, 'HTTP', {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: headers['user-agent'],
      userId: req.user?.id,
      organizationId: req.user?.organizationId,
    });
  }

  logQuery(query: string, params: any[], duration: number) {
    this.debug(`Query executed in ${duration}ms`, 'Database', {
      query,
      params,
      duration,
    });
  }
}
