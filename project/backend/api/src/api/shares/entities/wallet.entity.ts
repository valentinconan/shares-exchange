import {Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ShareHolder} from "./shareholder.entity";
import {Holding} from "./holding.entity";

@Entity()
export class Wallet {

    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn()
    @OneToOne(() => ShareHolder)
    shareHolder: ShareHolder

    @JoinTable()
    @ManyToMany(() => Holding, {cascade: true})
    holdings: Holding[]

}
