
import { ConnectionOptions } from 'typeorm';
import * as process from "process";
import {User} from "./src/user/entities/user.entity";

let url: string = process.env.DB_URL;

url=url??"postgres://postgres:password@localhost:5432/nest"
export default {
    type: 'postgres',
    url: url,
    database: 'filmash',
    entities: [User],
    synchronize: true,
} as ConnectionOptions;