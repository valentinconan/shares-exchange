import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HttpException} from "@nestjs/common";

describe('AppController', () => {
    let controller: AppController;
    let service: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        controller = app.get<AppController>(AppController);
        service = app.get<AppService>(AppService);
    });

    describe('root', () => {
        it('should return "ok"', () => {
            expect(controller.health()).toBe('ok');
        });


        it('should be alive', () => {
            jest.spyOn(service, 'live').mockImplementation(() => true);
            controller.liveness()
        })
        it('should not be alive', async () => {
            jest.spyOn(service, 'live').mockImplementation(() => false);
            await expect(controller.liveness()).rejects.toThrow(HttpException);
        })
        it('should be probe', () => {
            jest.spyOn(service, 'probe').mockImplementation(() => true);
            controller.probeness()
        })
        it('should not be probe', async () => {
            jest.spyOn(service, 'probe').mockImplementation(() => false);
            await expect(controller.probeness()).rejects.toThrow(HttpException);
        })
        it('should be ready', () => {
            jest.spyOn(service, 'ready').mockImplementation(() => true);
            controller.readiness()
        })
        it('should be ready', async () => {
            jest.spyOn(service, 'ready').mockImplementation(() => false);
            await expect(controller.readiness()).rejects.toThrow(HttpException);
        })
    });
});
