import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let message = exception.message;

    // Si el response es un objeto con 'message' (como en BadRequestException), lo usamos
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const res: any = exceptionResponse;
      message = res.message || message;
    }

    response.status(status).json({
      status: status,
      message,
      error: HttpStatus[status] || 'Error',
    });
  }
}
