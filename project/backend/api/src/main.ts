import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {JwtGuard} from "./guards/jwt/jwt.guard";
import {HttpService} from "@nestjs/axios";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards(new JwtGuard(new Reflector(), new HttpService()))
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(3000);
}

bootstrap();
