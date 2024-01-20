import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Right} from "./rights.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    lastName: string

    @Column()
    firstName: string

    @Column({nullable: false, unique: true})
    login: string

    @Column()
    hash: string

    @ManyToMany(() => Right, {cascade: true})
    @JoinTable()
    rights: Right[]

}
