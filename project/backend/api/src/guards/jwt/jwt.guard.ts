import {CanActivate, ExecutionContext, HttpException, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Reflector} from "@nestjs/core";
import {HttpService} from '@nestjs/axios'
import {catchError, map, Observable} from 'rxjs';
import {AxiosError} from 'axios';

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

        if (!token) {
            console.error('No authorization header found')
            throw new HttpException('forbidden', 403);
        }

        //then call user module in order to validate token
        return this.validateToken(token).pipe(
            map((isValid) => {
                return isValid;
            }),
        );
    }

    private validateToken(token: string) {
        //todo vco variabilise url here
        return this.httpService.post("http://localhost:3001/validate-token", {token}).pipe(
            map((response) => {
                return response.status >= 200 && response.status <= 299 && response.data.valid;
            }),
            catchError((error: AxiosError) => {
                // Traitez ici l'erreur
                if (error.response) {
                    // L'appel a été fait et le serveur a répondu avec un code d'erreur
                    console.error('Erreur de réponse:', error.response.data);
                    throw new HttpException('forbidden', 403);
                } else if (error.request) {
                    // L'appel a été fait mais aucune réponse n'a été reçue
                    console.error('Aucune réponse reçue:', error.request);
                    throw new HttpException(error.request.data.error, error.request.status);
                } else {
                    // Une erreur s'est produite lors de la configuration de la requête
                    console.error('Erreur de configuration de la requête:', error.message);
                    throw new HttpException('Bad request', 400);
                }

                // Renvoyer une observable d'erreur pour que le flux puisse être interrompu
                throw new HttpException('Bad request', 400);
            }),);
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
