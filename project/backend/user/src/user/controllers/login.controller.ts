import {Body, Controller, HttpException, Post} from '@nestjs/common';
import {LoginDto} from "../dto/login.dto";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {Public} from "../../decorators/public/public.decorator";
import {TokenDto} from "../dto/token.dto";

@Controller('login')
export class LoginController {

    constructor(private readonly userService: UserService,
                private readonly authService: AuthService) {
    }

    @Public()
    @Post()
    async login(@Body() login: LoginDto): Promise<TokenDto> {

        let user = await this.userService.validateUser(login.login, login.password)

        let jwtToken = undefined;
        if (user) {
            //generate jwt
            jwtToken = await this.authService.generateJwtToken(user);
        } else {
            throw new HttpException('Incorrect login or password', 403)
        }

        return {token: jwtToken}
    }
}
