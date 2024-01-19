import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {UserController} from './controllers/user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {EnvironmentService} from "../utils/service/environment/environment.service";
import {PasswordService} from "../utils/service/password/password.service";
import {LoginController} from "./controllers/login.controller";
import {AuthService} from "./services/auth.service";
import {JwtModule} from '@nestjs/jwt';
import {ValidateTokenController} from './controllers/validate-token.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? '0f3f14ca-396c-4ef0-beb7-af1e789c361b',
            signOptions: {expiresIn: '1h'},
        }),],
    controllers: [UserController, LoginController, ValidateTokenController],
    providers: [UserService, EnvironmentService, PasswordService, AuthService],
})
export class UserModule {
}
