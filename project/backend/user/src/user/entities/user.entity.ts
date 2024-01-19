import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
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

    @OneToMany(() => Right, (right) => right.user, {cascade: true})
    rights: Right[]
}
