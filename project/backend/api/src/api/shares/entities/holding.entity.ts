import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Holding {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    shareName: string

    @Column()
    quantity: number

}
