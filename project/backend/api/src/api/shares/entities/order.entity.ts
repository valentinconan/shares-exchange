import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ShareHolder} from "./shareholder.entity";
import {Share} from "./share.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => ShareHolder)
    @JoinColumn()
    shareHolder: ShareHolder

    @ManyToOne(() => Share)
    @JoinColumn()
    share: Share

    @Column()
    action: string//buy, sell

    @Column()
    quantity: number

    @Column()
    amount: number

    @Column()
    date: Date

    @Column()
    purchasePrice: number
}
