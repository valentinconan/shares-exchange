import {Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {PasswordService} from "../../utils/service/password/password.service";
import {Right} from "../entities/rights.entity";
import {plainToInstance} from "class-transformer";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(Right) private rightRepository: Repository<Right>,
                private passwordService: PasswordService) {

    }

    async create(createUserDto: CreateUserDto) {

        let user: User = plainToInstance(User, createUserDto);

        user.hash = this.passwordService.hash("default")

        const existingRights: Right[] = await this.rightRepository.find();

        const requestedRights: string[] = ['READ', 'WRITE', ...createUserDto.rights];

        const rightsToAdd: string[] = requestedRights.filter((requestedRight) =>
            existingRights.some((existingRight: Right): boolean => existingRight.name === requestedRight),
        );

        user.rights = existingRights.filter((right: Right) => rightsToAdd.includes(right.name));

        //if some right doesn't exist, create them
        for (const requestedRight of requestedRights) {
            if (!rightsToAdd.includes(requestedRight)) {
                const newRight: Right = new Right();
                newRight.name = requestedRight;
                user.rights.push(newRight);
            }
        }


        return await this.userRepository.save(user);
    }

    findAll() {
        return this.userRepository.find();
    }

    async findOne(login: string): Promise<User> {
        return this.userRepository.findOne({
            where: {login}, relations: {
                rights: true
            }
        })
    }

    async validateUser(login: string, password: string): Promise<User> {
        //generate hash in order to compare with the one stored in DB
        let hash = this.passwordService.hash(password)
        return this.userRepository.findOne({
            where: {login, hash}, relations: {
                rights: true
            }
        })
    }

    async retrieveRights(login: string): Promise<Right[]> {
        let rights: Right[];
        let user: User = await this.userRepository.findOne({
            where: {login}, relations: {
                rights: true
            }
        },)
        if (user) {
            rights = user.rights
        }
        return rights;
    }
}
