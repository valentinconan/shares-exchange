import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {EnvironmentService} from "../utils/service/environment/environment.service";
import {PasswordService} from "../utils/service/password/password.service";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, EnvironmentService, PasswordService],
})
export class UserModule {
}
