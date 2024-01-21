import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ShareHolder} from "./shareholder.entity";
import {Share} from "./share.entity";

@Entity()
export class Holding {

    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn()
    @OneToOne(() => ShareHolder)
    shareHolder: ShareHolder

    @JoinTable()
    @ManyToMany(() => Share)
    share: Share[]

    @Column()
    quantity: number

}
