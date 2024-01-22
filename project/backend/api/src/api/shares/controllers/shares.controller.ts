import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {SharesService} from '../services/shares.service';
import {CreateShareDto} from '../dto/create-share.dto';
import {UpdateShareDto} from '../dto/update-share.dto';
import {Roles} from "../../../decorators/roles/roles.decorator";
import {Role} from "../../../decorators/roles/role";

@Controller('shares')
export class SharesController {
    constructor(private readonly sharesService: SharesService) {
    }

    @Roles(Role.write)
    @Post()
    create(@Body() createShareDto: CreateShareDto) {
        return this.sharesService.create(createShareDto);
    }

    @Roles(Role.read)
    @Get()
    findAll() {
        return this.sharesService.findAll();
    }

    @Roles(Role.read)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sharesService.findOne(+id);
    }

    @Roles(Role.write)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShareDto: UpdateShareDto) {
        return this.sharesService.update(+id, updateShareDto);
    }
}
