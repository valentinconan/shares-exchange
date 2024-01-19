import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import config from "../ormconfig";
import {TypeOrmModule} from '@nestjs/typeorm';
import {PasswordService} from './utils/service/password/password.service';
import {EnvironmentService} from "./utils/service/environment/environment.service";

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService, EnvironmentService, PasswordService],
})
export class AppModule {
}
