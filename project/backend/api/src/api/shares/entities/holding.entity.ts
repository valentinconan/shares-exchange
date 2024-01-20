import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ShareHolder} from "./shareholder.entity";
import {Share} from "./share.entity";

@Entity()
export class Holding {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ShareHolder)
    shareHolder: ShareHolder

    @OneToOne(() => Share)
    share: Share

    @Column()
    quantity: number

}
