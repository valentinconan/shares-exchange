import {Injectable} from '@nestjs/common';
import * as crypto from 'crypto';
import {EnvironmentService} from "../environment/environment.service";

@Injectable()
export class PasswordService {

    constructor(private environmentService: EnvironmentService) {
    }

    hash(password: string): string {
        // Creating a unique salt for a particular user
        let salt = this.environmentService.getOrDefault(
            "PWD_SALT",
            "7fe1134dd079ed1ae117f19db5c8e04");

        // Hashing user's salt and password with 1000 iterations,
        return crypto.pbkdf2Sync(
            password,
            salt,
            1000,
            64,
            `sha512`)
            .toString(`hex`);
    }
}
