import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MemoryLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Mem');

  private heap() {
    return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + ' MB';
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const label = `${req.method} ${req.url}`;
    const before = this.heap();

    this.logger.debug(`⇢  ${label} | before ${before}`);

    return next.handle().pipe(
      tap(() => {
        global.gc?.(); // necesita --expose-gc (véase abajo)
        this.logger.debug(`⇠  ${label} | after  ${this.heap()}`);
      }),
    );
  }
}
