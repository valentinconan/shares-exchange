import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "../services/auth.service";
import {TokenDto} from "../dto/token.dto";

@Controller('validate-token')
export class ValidateTokenController {

    constructor(private readonly authService: AuthService) {

    }

    @Post()
    async validateToken(@Body() token: TokenDto): Promise<any> {

        let valid: boolean = await this.authService.verifyJwtToken(token.token)

        return {valid, payload: this.authService.extractPayload(token.token)}
    }
}

