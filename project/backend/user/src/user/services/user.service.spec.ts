import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from './user.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Right} from "../entities/rights.entity";
import {PasswordService} from "../../utils/service/password/password.service";
import {EnvironmentService} from "../../utils/service/environment/environment.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {Repository} from "typeorm";

describe('UserService', () => {
    let service: UserService;
    let rightRepositoryService;
    let userRepositoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, PasswordService, EnvironmentService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn()
                    },
                },
                {
                    provide: getRepositoryToken(Right),
                    useValue: {
                        find: jest.fn()
                    },
                }],
        }).compile();

        service = module.get<UserService>(UserService);
        rightRepositoryService = module.get<Repository<Right>>(getRepositoryToken(Right))
        userRepositoryService = module.get<Repository<User>>(getRepositoryToken(User))

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        let userDto = new CreateUserDto("Doe", "John", "jdoe", []);

        const rights: Right[] = [];
        const readRight = new Right();
        readRight.name = 'READ';
        rights.push(readRight)
        const writeRight = new Right();
        writeRight.name = 'WRITE';
        rights.push(writeRight)

        jest.spyOn(rightRepositoryService, 'find').mockResolvedValue(rights)
        jest.spyOn(userRepositoryService, 'save').mockImplementation(async (user) => {
            // just return the parameter of the original call
            return user;
        });

        const user = await service.create(userDto);

        expect(user.hash).toBeDefined();
        expect(user.rights).toBeDefined();
        expect(user.rights.find(right => right.name === 'READ')).toBeDefined();
        expect(user.rights.find(right => right.name === 'WRITE')).toBeDefined();
    });

    it('should find all users', async () => {

        const users = [new User(), new User(), new User()]
        jest.spyOn(userRepositoryService, 'find').mockResolvedValue(users)

        const user = await service.findAll();

        expect(user).toBeDefined();
        expect(user.length).toEqual(3);
    });

    it('should find a user by login', async () => {

        const login = 'jdoe'

        await service.findOne(login);

        expect(userRepositoryService.findOne).toHaveBeenCalledWith({
            where: {login},
            relations: {
                rights: true,
            },
        });
    });

    it('should find a user by login', async () => {

        const login = 'jdoe'

        await service.validateUser(login, "default");

        expect(userRepositoryService.findOne).toHaveBeenCalledWith({
            where: {
                login,
                hash: 'b96452118f0205191326194a8cb974e45c5f1368f77e7f6c7c49b135b56ea5b01f362c9ea621a2c4f22f44181be4a19d0062b5cb77a5f65c51f0f4fee4557e98'
            },
            relations: {
                rights: true,
            },
        });
    });

    it('should retrieve user rights', async () => {

        const login = 'jdoe'

        const user = new User();
        user.rights = []
        user.rights.push(new Right())
        jest.spyOn(userRepositoryService, 'findOne').mockResolvedValue(user)

        let retrivedRight = await service.retrieveRights(login);

        expect(userRepositoryService.findOne).toHaveBeenCalledWith({
            where: {
                login
            },
            relations: {
                rights: true,
            },
        });
        expect(retrivedRight).toEqual(user.rights)

    });
});
