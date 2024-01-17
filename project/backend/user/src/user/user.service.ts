import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {PasswordService} from "../utils/service/password/password.service";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                private passwordService: PasswordService) {

    }

    create(createUserDto: CreateUserDto) {
        console.log(JSON.stringify(createUserDto))
        createUserDto['hash'] = this.passwordService.hash("default")
        return this.userRepository.save(createUserDto);
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
