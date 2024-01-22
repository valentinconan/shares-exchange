import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {CreateUserDto} from '../dto/create-user.dto';
import {UpdateUserDto} from '../dto/update-user.dto';
import {Right} from "../entities/rights.entity";
import {User} from "../entities/user.entity";
import {Roles} from "../../decorators/roles/roles.decorator";
import {Role} from "../../decorators/roles/role";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Roles(Role.admin)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {

        let user: User = await this.userService.create(createUserDto);

        //remove sensitive data from response
        delete user?.hash
        delete user?.id

        return user;
    }

    @Roles(Role.admin)
    @Get()
    async findAll() {
        let users = await this.userService.findAll();
        users.forEach((user) => {
            delete user?.hash
            delete user?.id
        })
        return users
    }

    @Roles(Role.admin)
    @Get(':name')
    async findOne(@Param('name') name: string) {

        let user = await this.userService.findOne(name);
        delete user?.hash
        delete user?.id
        return user
    }

    @Roles(Role.admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Roles(Role.admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Roles(Role.admin)
    @Get('/rights/:login')
    async retrieveRights(@Param('login') login: string): Promise<Right[]> {
        return await this.userService.retrieveRights(login)
    }
}
