import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import helmet from 'helmet';
import {HttpService} from "@nestjs/axios";
import {ValidationPipe} from "@nestjs/common";
import {JwtGuard} from "./guards/jwt/jwt.guard";
import {RolesGuard} from "./guards/roles/roles.guard";
import {EnvironmentService} from "./utils/service/environment/environment.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.useGlobalGuards(new JwtGuard(new Reflector(), new HttpService(), new EnvironmentService()), new RolesGuard(new Reflector()))
    //Sanitize deserialization data and validation class-validator schema
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}

bootstrap();
