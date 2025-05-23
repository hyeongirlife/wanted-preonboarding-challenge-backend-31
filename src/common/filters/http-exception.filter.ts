import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from '../types/error.types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let message = 'Internal server error';
    let details: Record<string, any> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (exceptionResponse.error?.code) {
        errorCode = exceptionResponse.error.code;
        message = exceptionResponse.error.message;
        details = exceptionResponse.error.details;
      } else {
        message = exceptionResponse.message || exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.error(exception);

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
      },
    });
  }
}
