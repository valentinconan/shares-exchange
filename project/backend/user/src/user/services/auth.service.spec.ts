import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from "./auth.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../entities/user.entity";
import {Right} from "../entities/rights.entity";

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, JwtService],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate jwt token', async () => {

        jest.spyOn(jwtService, 'signAsync').mockResolvedValue("fakeToken");

        const user = new User()
        user.login = 'jdoe';
        user.rights = [];
        const readRight = new Right()
        readRight.name = 'read'
        user.rights.push(readRight)

        const token = await service.generateJwtToken(user)

        expect(token).toEqual("fakeToken");
    });


    it('should verify jwt token', async () => {

        jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(Promise.resolve())


        const token = await service.verifyJwtToken("fakeToken")

        expect(jwtService.verifyAsync).toHaveBeenCalled()
        expect(token).toBeTruthy()
    });
    it('should failed when verifying jwt token', async () => {

        jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(Promise.reject())


        const token = await service.verifyJwtToken("fakeToken")

        expect(jwtService.verifyAsync).toHaveBeenCalled()
        expect(token).toBeFalsy()
    });

});
