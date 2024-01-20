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

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
