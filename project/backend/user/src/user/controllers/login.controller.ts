import {Body, Controller, Post} from '@nestjs/common';
import {LoginDto} from "../dto/login.dto";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

@Controller('login')
export class LoginController {

    constructor(private readonly userService: UserService,
                private readonly authService: AuthService) {
    }

    @Post()
    async login(@Body() login: LoginDto) {

        let user = await this.userService.validateUser(login.login, login.password)

        let jwtToken = undefined;
        if (user) {
            console.log(`User with login ${login} is logged [${JSON.stringify(user)}]`)

            //generate jwt
            jwtToken = await this.authService.generateJwtToken(user);
        }

        return {token: jwtToken}
    }
}
