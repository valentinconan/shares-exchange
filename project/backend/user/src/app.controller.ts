import {Controller, Get, HttpCode, HttpException, HttpStatus} from "@nestjs/common";
import {AppService} from './app.service';
import {Public} from "./decorators/public/public.decorator";

@Controller("/health")
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Public()
    @Get()
    health(): string {
        return "ok"
    }

    @Public()
    @Get("/liveness")
    @HttpCode(200)
    async liveness() {
        if (!this.appService.live()) {
            throw new HttpException('Not alive', HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get("/readiness")
    @HttpCode(200)
    async readiness() {
        if (!this.appService.ready()) {
            throw new HttpException('Not ready', HttpStatus.BAD_REQUEST);
        }
    }

    @Public()
    @Get("/probeness")
    @HttpCode(200)
    async probeness() {
        if (!this.appService.probe()) {
            throw new HttpException('Not probe', HttpStatus.BAD_REQUEST);
        }
    }
}
