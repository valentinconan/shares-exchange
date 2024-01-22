import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SharesModule} from './api/shares/shares.module';
import config from "../ormconfig";
import {TypeOrmModule} from '@nestjs/typeorm';
import {APP_FILTER} from "@nestjs/core";
import {ErrorHandlerFilter} from "./filters/error-handler/error-handler.filter";

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        SharesModule],
    controllers: [AppController],
    providers: [{
        provide: APP_FILTER,
        useClass: ErrorHandlerFilter
    }, AppService],
})
export class AppModule {
}
