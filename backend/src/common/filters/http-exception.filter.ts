import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        error = exception.name;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj.message as string | string[]) ?? exception.message;
        error = (resObj.error as string) ?? exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      // Never leak raw SQL/driver errors to the client.
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Database Error';

      const driverError = (exception as any).driverError;
      const code = driverError?.code;

      if (code === 'ER_DUP_ENTRY') {
        message = 'A record with this value already exists.';
      } else if (
        code === 'ER_NO_REFERENCED_ROW' ||
        code === 'ER_NO_REFERENCED_ROW_2'
      ) {
        message = 'Referenced record does not exist.';
      } else if (
        code === 'ER_ROW_IS_REFERENCED' ||
        code === 'ER_ROW_IS_REFERENCED_2'
      ) {
        message = 'Cannot delete: this record is referenced by other data.';
      } else {
        message = 'A database error occurred while processing the request.';
      }

      this.logger.error(
        `QueryFailedError: ${exception.message}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
