import {Test, TestingModule} from '@nestjs/testing';
import {ValidateTokenController} from './validate-token.controller';
import {AuthService} from "../services/auth.service";
import {JwtService} from "@nestjs/jwt";
import {Role} from "../../decorators/roles/role";

describe('ValidateTokenController', () => {
    let controller: ValidateTokenController;
    let authService: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ValidateTokenController],
            providers: [AuthService, JwtService]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        controller = module.get<ValidateTokenController>(ValidateTokenController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should not validate token', async () => {

        jest.spyOn(authService, 'verifyJwtToken').mockResolvedValue(false);
        jest.spyOn(authService, 'extractPayload').mockReturnValue({claims: [Role.admin]});
        let res = await controller.validateToken({token: "fake"})
        expect(res.valid).toBeFalsy();
    });
    it('should validate token', async () => {

        jest.spyOn(authService, 'verifyJwtToken').mockResolvedValue(true);
        jest.spyOn(authService, 'extractPayload').mockReturnValue({claims: [Role.admin]});
        let res = await controller.validateToken({token: "fake"})
        expect(res.valid).toBeTruthy();
        expect(res.payload.claims[0]).toEqual(Role.admin);
    });
});
