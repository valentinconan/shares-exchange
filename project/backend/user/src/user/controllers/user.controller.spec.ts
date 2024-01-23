import {Test, TestingModule} from '@nestjs/testing';
import {UserController} from './user.controller';
import {UserService} from '../services/user.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Right} from "../entities/rights.entity";
import {PasswordService} from "../../utils/service/password/password.service";
import {EnvironmentService} from "../../utils/service/environment/environment.service";

describe('UserController', () => {
    let controller: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, PasswordService, EnvironmentService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Right),
                    useValue: {},
                }]
        }).compile();

        userService = module.get<UserService>(UserService);
        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a user ', async () => {
        const user = new User()
        user.login = "toto"
        user.hash = "fakeHash"
        user.id = 1337
        jest.spyOn(userService, 'create').mockResolvedValue(user)

        let createdUser = await controller.create(undefined);
        expect(createdUser.login).toEqual("toto");
        expect(createdUser.hash).toBeUndefined();
        expect(createdUser.id).toBeUndefined();
    });

    it('should find all users ', async () => {
        const user = new User()
        user.login = "toto"
        user.hash = "fakeHash"
        user.id = 1337
        jest.spyOn(userService, 'findAll').mockResolvedValue([user, user, user])

        let createdUsers = await controller.findAll();

        createdUsers.forEach((createdUser) => {

            expect(createdUser.login).toEqual("toto");
            expect(createdUser.hash).toBeUndefined();
            expect(createdUser.id).toBeUndefined();
        })
    });


    it('should find one user by name ', async () => {
        const user = new User()
        user.login = "toto"
        user.hash = "fakeHash"
        user.id = 1337
        jest.spyOn(userService, 'findOne').mockResolvedValue(user)

        let foundUser = await controller.findOne(user.login);

        expect(foundUser.login).toEqual("toto");
        expect(foundUser.hash).toBeUndefined();
        expect(foundUser.id).toBeUndefined();
    });
});
