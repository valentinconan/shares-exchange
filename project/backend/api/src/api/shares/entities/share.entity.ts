import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Share {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string

    @Column()
    quantity: number

    @Column()
    price: number
}
