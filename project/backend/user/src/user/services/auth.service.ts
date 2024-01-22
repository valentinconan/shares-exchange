import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {User} from "../entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {
    }

    /**
     * Generate and sign jwt token using user login and rights
     * @param user
     * @return a jwt token
     */
    async generateJwtToken(user: User): Promise<string> {
        //include data into payload
        const payload =
            {
                sub: user.login,
                claims: user.rights.map(right => right.name)
            };
        // generate token
        return await this.jwtService.signAsync(payload);
    }

    /**
     * verify token
     * @param token
     * @return boolean, true if token is valid, false otherwise
     */
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

    /**
     * Extract payload from token
     * @param jwt
     * @return the payload
     */
    extractPayload(jwt: string) {
        return this.jwtService.decode(jwt)
    }
}