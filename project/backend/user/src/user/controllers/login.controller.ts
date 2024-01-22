import {Body, Controller, Post} from '@nestjs/common';
import {LoginDto} from "../dto/login.dto";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {Public} from "../../decorators/public/public.decorator";

@Controller('login')
export class LoginController {

    constructor(private readonly userService: UserService,
                private readonly authService: AuthService) {
    }

    @Public()
    @Post()
    async login(@Body() login: LoginDto) {

        let user = await this.userService.validateUser(login.login, login.password)

        let jwtToken = undefined;
        if (user) {
            //generate jwt
            jwtToken = await this.authService.generateJwtToken(user);
        }

        return {token: jwtToken}
    }
}
