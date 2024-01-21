import {Controller, Get, Param} from '@nestjs/common';
import {WalletsService} from "../services/wallets.service";

@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletService: WalletsService) {
    }


    @Get(':name')
    findOne(@Param('name') name: string) {
        return this.walletService.findByName(name);
    }

}
