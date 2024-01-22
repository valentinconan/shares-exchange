import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {Response} from 'express';

@Catch()
export class ErrorHandlerFilter<T> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {

        const response: Response = host.switchToHttp().getResponse<Response>();

        if (exception['code'] === '23505') {
            response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message: 'Entity already exist. Please check your data',
            });
        } else {
            // Gérer d'autres erreurs si nécessaire
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected error occurred.',
            });
        }
    }
}
