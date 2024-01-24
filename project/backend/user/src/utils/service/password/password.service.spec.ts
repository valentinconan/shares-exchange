import {Test, TestingModule} from '@nestjs/testing';
import {PasswordService} from './password.service';
import {EnvironmentService} from "../environment/environment.service";

describe('PasswordService', () => {
    let service: PasswordService;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PasswordService, EnvironmentService],

        }).compile();

        service = module.get<PasswordService>(PasswordService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should hash password using default PWD_SALT', () => {
        expect(service.hash("password")).toEqual("a31eaf2cfa61dbc7fb10d0783d94673dccbc87b934f38825a2aa34adb855894c856e5d0f56592699ab4686a62a0b6f1326cac42450c61901e0c71cbb580afb2b")
    });
    it('should hash password using override PWD_SALT', () => {

        try {
            process.env.PWD_SALT = "myCustomSalt"
            expect(service.hash("password")).toEqual("4c05f5118a5f259dcbaeae2a02196cc83b95ed99f986de6c4b00ac122c5a8305c9aec9ac4dbbc200425bb0506177824c59e8ae14afc282547c5f4d2a8ef232ea")
        } finally {
            delete process.env.PWD_SALT
        }
    });
});
