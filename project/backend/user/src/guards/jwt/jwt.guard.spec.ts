import {Test, TestingModule} from '@nestjs/testing';
import {JwtGuard} from './jwt.guard';
import {Reflector} from '@nestjs/core';
import {ExecutionContext, HttpException} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {EnvironmentService} from "../../utils/service/environment/environment.service";
import {Observable, of} from "rxjs";
import {AxiosResponse} from 'axios';

describe('JwtGuard', () => {
    let guard: JwtGuard;
    let reflector: Reflector;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtGuard,
                {
                    provide: Reflector,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        post: jest.fn(),
                    },
                },
                EnvironmentService
            ],
        }).compile();

        guard = module.get<JwtGuard>(JwtGuard);
        reflector = module.get<Reflector>(Reflector);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });


    describe('canActivate', () => {
        it('should return free public route', () => {
            const context = {
                getHandler: () => {
                    return {}
                }
            } as ExecutionContext;

            const reflectorSpy = jest.spyOn(reflector, 'get');
            reflectorSpy.mockReturnValue(true);

            const result = guard.canActivate(context);
            expect(result).toBe(true);
        });

        it('should failed due to missing authorization header', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        headers: {},
                    }),
                }),
                getHandler: () => {
                    return undefined
                }
            } as ExecutionContext;

            const reflectorSpy = jest.spyOn(reflector, 'get');
            reflectorSpy.mockReturnValue(false);

            try {
                guard.canActivate(context)
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException)
            }
        });

        it('should return true for public route', async () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        headers: {
                            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
                        },
                    }),
                }),
                getHandler: () => {
                    return undefined
                }
            } as ExecutionContext;

            const reflectorSpy = jest.spyOn(reflector, 'get');
            reflectorSpy.mockReturnValue(false);

            jest.spyOn(httpService, 'post').mockReturnValue(of({status: 200, data: {valid: true}} as AxiosResponse));


            const result = await guard.canActivate(context);
            expect(result).toBeInstanceOf(Observable);
        });
    });
});
