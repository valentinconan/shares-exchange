import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from '@nestjs/common';
import {Response} from 'express';

@Catch()
export class ErrorHandlerFilter<T> implements ExceptionFilter {

    private readonly logger = new Logger(ErrorHandlerFilter.name);

    catch(exception: T, host: ArgumentsHost) {

        const response: Response = host.switchToHttp().getResponse<Response>();

        if (exception['code'] === '23505') {
            response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message: 'Entity already exist. Please check your data',
            });
        } else if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: exception.getResponse(),
            });
        } else {
            this.logger.error(exception, exception['stack'])

            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected error occurred.',
            });
        }
    }
}