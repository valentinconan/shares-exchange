import {Test, TestingModule} from '@nestjs/testing';
import {LoginController} from './login.controller';
import {LoginDto} from "../dto/login.dto";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Right} from "../entities/rights.entity";
import {PasswordService} from "../../utils/service/password/password.service";
import {JwtService} from "@nestjs/jwt";
import {EnvironmentService} from "../../utils/service/environment/environment.service";

describe('LoginController', () => {
    let controller: LoginController;
    let userService: UserService;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [UserService, AuthService, PasswordService, JwtService, EnvironmentService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {findOne: jest.fn()},
                },
                {
                    provide: getRepositoryToken(Right),
                    useValue: {},
                }]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        controller = module.get<LoginController>(LoginController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should not login', async () => {
        let loginDto = new LoginDto()
        loginDto.login = "admin"
        loginDto.password = "defaut"

        jest.spyOn(userService, 'validateUser').mockResolvedValue(undefined)

        let res = await controller.login(loginDto)
        expect(res['token']).toBeUndefined();
    });

    it('should login', async () => {

        let loginDto = new LoginDto()
        loginDto.login = "admin"
        loginDto.password = "defaut"

        let user = new User()
        jest.spyOn(userService, 'validateUser').mockResolvedValue(user)
        jest.spyOn(authService, 'generateJwtToken').mockResolvedValue("fakeJwt")

        let res = await controller.login(loginDto)
        expect(res['token']).toEqual("fakeJwt");
    });


});
