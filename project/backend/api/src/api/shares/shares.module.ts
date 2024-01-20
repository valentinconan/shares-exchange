import {Module} from '@nestjs/common';
import {SharesService} from './shares.service';
import {SharesController} from './shares.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Holding} from "./entities/holding.entity";
import {Order} from "./entities/order.entity";
import {Share} from "./entities/share.entity";
import {ShareHolder} from "./entities/shareholder.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Holding, Order, Share, ShareHolder])],
    controllers: [SharesController],
    providers: [SharesService],
})
export class SharesModule {
}
