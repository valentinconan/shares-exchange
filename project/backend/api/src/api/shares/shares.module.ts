import {Module} from '@nestjs/common';
import {SharesService} from './services/shares.service';
import {SharesController} from './controllers/shares.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Holding} from "./entities/holding.entity";
import {Order} from "./entities/order.entity";
import {Share} from "./entities/share.entity";
import {ShareHolder} from "./entities/shareholder.entity";
import {OrdersService} from "./services/orders.service";
import {OrdersController} from "./controllers/orders.controller";
import {Wallet} from "./entities/wallet.entity";
import {WalletsService} from "./services/wallets.service";
import {WalletsController} from "./controllers/wallets.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Holding, Order, Share, ShareHolder, Wallet])],
    controllers: [SharesController, OrdersController, WalletsController],
    providers: [SharesService, OrdersService, WalletsService],
})
export class SharesModule {
}
