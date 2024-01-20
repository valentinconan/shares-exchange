import {Controller, Get, HttpCode, HttpException, HttpStatus} from "@nestjs/common";
import {AppService} from './app.service';
import {SkipJwt} from "./decorators/skip-jwt/skip-jwt.decorator";

@Controller("/health")
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @SkipJwt()
    health(): string {
        return "ok"
    }

    @Get("/liveness")
    @HttpCode(200)
    //todo vco uncomment @SkipJwt()
    async liveness() {
        if (!this.appService.live()) {
            throw new HttpException('Not alive', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/readiness")
    @HttpCode(200)
    @SkipJwt()
    async readiness() {
        if (!this.appService.ready()) {
            throw new HttpException('Not ready', HttpStatus.BAD_REQUEST);
        }
    }

    @Get("/probeness")
    @HttpCode(200)
    @SkipJwt()
    async probeness() {
        if (!this.appService.probe()) {
            throw new HttpException('Not probe', HttpStatus.BAD_REQUEST);
        }
    }
}
