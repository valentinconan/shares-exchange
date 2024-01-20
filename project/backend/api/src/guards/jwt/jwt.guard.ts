import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Reflector} from "@nestjs/core";
import {HttpService} from '@nestjs/axios'
import {map, Observable} from "rxjs";

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(private readonly reflector: Reflector, private readonly httpService: HttpService) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const skipAuth = this.reflector.get<boolean>("skip-jwt", context.getHandler());

        if (skipAuth) {
            console.log("skipping Jwtguard")
            // Exclure cette route du guard
            return true;
        }

        const request = context.switchToHttp().getRequest();

        //precheck of authorization header presence
        const token = this.extractTokenFromHeader(request);

        console.log(token)
        //then call user module in order to validate token


        return this.validateToken(token).pipe(
            map((isValid) => {
                console.log(isValid)
                return isValid;
            }),
        );
    }

    private validateToken(token: string) {
        //todo vco variabilise url here
        return this.httpService.post("http://localhost:3001/validate-token", {token}).pipe(
            map((response) => {
                return response.status >= 200 && response.status <= 299 && response.data.valid;
            }));
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
