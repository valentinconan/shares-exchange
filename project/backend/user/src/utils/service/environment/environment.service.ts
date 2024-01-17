import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {

    getOrDefault(name:string, defaultValue:string) : string {
        return process.env[name] ?? defaultValue;
    }
}
