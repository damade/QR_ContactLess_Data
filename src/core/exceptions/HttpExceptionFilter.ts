import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getErrorMessage } from '../utils/helpers/error.helper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = getErrorMessage(exception);

    response
      .status(status)
      .json({
        code: status,
        success: false,
        message,
        data: {},
        timestamp: new Date().toISOString()
      });
  }
}
