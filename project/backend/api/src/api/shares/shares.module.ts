import {Module} from '@nestjs/common';
import {SharesService} from './services/shares.service';
import {SharesController} from './controllers/shares.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Holding} from "./entities/holding.entity";
import {Order} from "./entities/order.entity";
import {Share} from "./entities/share.entity";
import {ShareHolder} from "./entities/shareholder.entity";
import {HoldingsController} from "./controllers/holdings.controller";
import {HoldingsService} from "./services/holdings.service";
import {OrdersService} from "./services/orders.service";
import {OrdersController} from "./controllers/orders.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Holding, Order, Share, ShareHolder])],
    controllers: [SharesController, HoldingsController, OrdersController],
    providers: [SharesService, HoldingsService, OrdersService],
})
export class SharesModule {
}
