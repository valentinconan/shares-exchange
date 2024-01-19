import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {EnvironmentService} from "../utils/service/environment/environment.service";
import {PasswordService} from "../utils/service/password/password.service";
import {LoginController} from "./login/login.controller";
import {AuthService} from "./auth.service";
import {JwtModule} from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? '0f3f14ca-396c-4ef0-beb7-af1e789c361b',
            signOptions: {expiresIn: '1h'},
        }),],
    controllers: [UserController, LoginController],
    providers: [UserService, EnvironmentService, PasswordService, AuthService],
})
export class UserModule {
}
