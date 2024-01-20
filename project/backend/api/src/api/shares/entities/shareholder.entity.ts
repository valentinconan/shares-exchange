import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ShareHolder {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    login: string

}