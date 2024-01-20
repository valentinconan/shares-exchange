import {Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {UpdateUserDto} from '../dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {PasswordService} from "../../utils/service/password/password.service";
import {Right} from "../entities/rights.entity";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                private passwordService: PasswordService) {

    }

    async create(createUserDto: CreateUserDto) {
        console.log(JSON.stringify(createUserDto))
        createUserDto['hash'] = this.passwordService.hash("default")
        return await this.userRepository.save(createUserDto);
    }

    findAll() {
        return `This action returns all user`;
    }

    async findOne(login: string) {
        return this.userRepository.findOne({where: {login}})
    }

    async validateUser(login: string, password: string) {
        //generate hash in order to compare with the one stored in DB
        let hash = this.passwordService.hash(password)
        return this.userRepository.findOne({where: {login, hash}})
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async retrieveRights(login: string): Promise<Right[]> {
        let rights: Right[];
        console.log(login)
        let user: User = await this.userRepository.findOne({
            where: {login}, relations: {
                rights: true
            }
        },)
        console.log(JSON.stringify(user))
        if (user) {
            rights = user.rights
        }
        return rights;
    }
}
