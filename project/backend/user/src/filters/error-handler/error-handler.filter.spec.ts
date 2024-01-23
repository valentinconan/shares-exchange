import {ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {ErrorHandlerFilter} from './error-handler.filter';

describe('ErrorHandlerFilter', () => {
    let errorHandlerFilter: ErrorHandlerFilter<any>;
    let mockResponse: Response;

    beforeEach(() => {
        errorHandlerFilter = new ErrorHandlerFilter<any>();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
    });

    it('should handle duplicate key violation error (code 23505)', () => {
        const mockException = {code: '23505'};

        errorHandlerFilter.catch(mockException, createMockArgumentsHost(mockResponse));

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: HttpStatus.CONFLICT,
            message: 'Entity already exist. Please check your data',
        });
    });

    it('should handle HttpException', () => {
        const mockHttpException = new HttpException('Custom error message', HttpStatus.BAD_REQUEST);

        errorHandlerFilter.catch(mockHttpException, createMockArgumentsHost(mockResponse));

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Custom error message',
        });
    });

    it('should handle generic exception', () => {
        const mockException = new Error('Unexpected error');

        errorHandlerFilter.catch(mockException, createMockArgumentsHost(mockResponse));

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Unexpected error occurred.',
        });
    });

    function createMockArgumentsHost(response: Response): ArgumentsHost {
        return {
            switchToHttp: () => ({
                getResponse: () => response,
            }),
        } as any;
    }
});
