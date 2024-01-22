import {Controller, Get, HttpCode, HttpException, HttpStatus} from "@nestjs/common";
import {AppService} from './app.service';
import {Public} from "./decorators/public/public.decorator";

@Controller("/health")
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @Public()
    health(): string {
        return "ok"
    }

    @Get("/liveness")
    @HttpCode(200)
    @Public()
    async liveness() {
        if (!this.appService.live()) {
            throw new HttpException('Not alive', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/readiness")
    @HttpCode(200)
    @Public()
    async readiness() {
        if (!this.appService.ready()) {
            throw new HttpException('Not ready', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/probeness")
    @HttpCode(200)
    @Public()
    async probeness() {
        if (!this.appService.probe()) {
            throw new HttpException('Not probe', HttpStatus.BAD_REQUEST);
        }
    }
}
