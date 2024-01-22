import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {CreateUserDto} from '../dto/create-user.dto';
import {UpdateUserDto} from '../dto/update-user.dto';
import {Right} from "../entities/rights.entity";
import {User} from "../entities/user.entity";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {

        let user: User = await this.userService.create(createUserDto);

        //remove sensitive data from response
        delete user.hash
        delete user.id

        return user;
    }

    @Get()
    async findAll() {
        let users = await this.userService.findAll();
        users.forEach((user) => {
            delete user.hash
            delete user.id
        })
        return users
    }

    @Get(':name')
    async findOne(@Param('name') name: string) {

        let user = await this.userService.findOne(name);
        delete user.hash
        delete user.id
        return user
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    //todo vco admin ROle
    @Get('/rights/:login')
    async retrieveRights(@Param('login') login: string): Promise<Right[]> {
        return await this.userService.retrieveRights(login)
    }
}
