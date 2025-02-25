import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body) {
      request.body = this.parseDates(request.body);
    }
    return next.handle().pipe(
      map(data => this.transformDates(data))
    );
  }

  private parseDates(value: any): any {
    if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [day, month, year] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.parseDates(item));
    }
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          value[key] = this.parseDates(value[key]);
        }
      }
    }
    return value;
  }

  private transformDates(value: any): any {
    if (value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }
    if (Array.isArray(value)) {
      return value.map(item => this.transformDates(item));
    }
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          value[key] = this.transformDates(value[key]);
        }
      }
    }
    return value;
  }
}

  