import {Controller, Get, Req} from '@nestjs/common';
import {WalletsService} from "../services/wallets.service";
import {Roles} from "../../../decorators/roles/roles.decorator";
import {Role} from "../../../decorators/roles/role";

@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletService: WalletsService) {
    }

    @Roles(Role.read)
    @Get()
    findOne(@Req() request) {
        return this.walletService.findByName(request.user.login);
    }

}
