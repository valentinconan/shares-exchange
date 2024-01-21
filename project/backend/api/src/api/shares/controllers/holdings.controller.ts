import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {CreateShareDto} from '../dto/create-share.dto';
import {UpdateShareDto} from '../dto/update-share.dto';
import {HoldingsService} from "../services/holdings.service";

@Controller('holdings')
export class HoldingsController {
    constructor(private readonly holdingService: HoldingsService) {
    }

    @Post()
    create(@Body() createShareDto: CreateShareDto) {
        return this.holdingService.create(createShareDto);
    }


    @Get(':name')
    findOne(@Param('name') name: string) {
        return this.holdingService.findByName(name);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShareDto: UpdateShareDto) {
        return this.holdingService.update(+id, updateShareDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.holdingService.remove(+id);
    }
}
