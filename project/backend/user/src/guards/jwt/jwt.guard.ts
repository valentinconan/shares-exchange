import {CanActivate, ExecutionContext, HttpException, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Reflector} from "@nestjs/core";
import {HttpService} from '@nestjs/axios'
import {catchError, map, Observable} from 'rxjs';
import {AxiosError} from 'axios';
import {EnvironmentService} from "../../utils/service/environment/environment.service";

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(private readonly reflector: Reflector, private readonly httpService: HttpService, private readonly environmentService: EnvironmentService) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const publicDecorator = this.reflector.get<boolean>("public", context.getHandler());

        if (publicDecorator) {
            // Exclude this call from guard validation
            return true;
        }

        const request = context.switchToHttp().getRequest();

        //precheck of authorization header presence
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            console.error('No authorization header found')
            throw new HttpException('forbidden', 403);
        }

        //then call user module in order to validate token
        return this.validateToken(token).pipe(
            map((isValid) => {
                if (!isValid?.valid) {
                    throw new HttpException('forbidden', 403)
                }
                request.user = {
                    login: isValid.payload.sub,
                    roles: isValid.payload.claims
                };
                return isValid.valid;
            }),
        );
    }

    private validateToken(token: string) {

        return this.httpService.post(`http://${this.environmentService.getOrDefault("USER_HOSTNAME", "user:3000")}/validate-token`, {token}).pipe(
            map((response) => {

                if (response.status >= 200 && response.status <= 299 && response.data.valid) {
                    return response.data
                } else {
                    return false
                }
            }),
            catchError((error: AxiosError) => {
                // Managing error...
                if (error.response) {
                    // Call ok but reponse in error
                    console.error('Erreur de réponse:', error.response.data);
                    throw new HttpException('forbidden', 403);
                } else if (error.request) {
                    // Call ok but no response received
                    console.error('Aucune réponse reçue:', error.request);
                    throw new HttpException(error.request.data.error, error.request.status);
                } else {
                    // Error in request configuration
                    console.error('Erreur de configuration de la requête:', error.message);
                    throw new HttpException('Bad request', 400);
                }

            }),);
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}