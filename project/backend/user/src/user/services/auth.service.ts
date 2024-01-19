import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {User} from "../entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {
    }

    async generateJwtToken(user: User): Promise<string> {
        //include data into payload
        const payload = {sub: user.login};
        // generate token
        return await this.jwtService.signAsync(payload);
    }

    async verifyJwtToken(token: string): Promise<boolean> {
        let isValid = false;

        try {
            await this.jwtService.verifyAsync(token)
            isValid = true;
        } catch (e) {
            console.error("JWT token is not valid " + e)
        }

        return isValid;
    }
}