import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SharesModule} from './api/shares/shares.module';
import config from "../ormconfig";
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        SharesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
