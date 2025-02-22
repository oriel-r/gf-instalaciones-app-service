import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { format } from 'date-fns';
  
  @Injectable()
  export class DateFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => this.transformDates(data)),
      );
    }
  
    private transformDates(value: any): any {
      if (value instanceof Date) {
        // Formatear la fecha a "dd/MM/yy"
        return format(value, 'dd/MM/yyyy');
      }
  
      if (Array.isArray(value)) {
        // Recursivamente formatear fechas en arrays
        return value.map((item) => this.transformDates(item));
      }
  
      if (typeof value === 'object' && value !== null) {
        // Recorrer las propiedades del objeto y formatear fechas
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            value[key] = this.transformDates(value[key]);
          }
        }
      }
  
      return value;
    }
  }
  