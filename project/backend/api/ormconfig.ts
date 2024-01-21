import {ConnectionOptions} from 'typeorm';
import * as process from "process";
import {Holding} from "./src/api/shares/entities/holding.entity";
import {Order} from "./src/api/shares/entities/order.entity";
import {ShareHolder} from "./src/api/shares/entities/shareholder.entity";
import {Share} from "./src/api/shares/entities/share.entity";
import {Wallet} from "./src/api/shares/entities/wallet.entity";

let url: string = process.env.DB_URL;

url = url ?? "postgres://postgres:password@localhost:5432/nest"
export default {
    type: 'postgres',
    url: url,
    database: 'filmash',
    entities: [Holding, Order, Share, ShareHolder, Wallet],
    synchronize: true,
} as ConnectionOptions;