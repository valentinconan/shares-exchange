import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ShareHolder} from "./shareholder.entity";
import {Share} from "./share.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ShareHolder)
    shareHolder: ShareHolder

    @OneToOne(() => Share)
    share: Share

    @Column()
    action: string//buy, sell

    @Column()
    quantity: number

    @Column()
    amount: number

    @Column()
    date: Date

}
