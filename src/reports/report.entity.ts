import { User } from "../users/user.entity";
import { Entity,Column,PrimaryGeneratedColumn, ManyToOne } from "typeorm";


@Entity()
export class Report{


    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    make:string;

    @Column()
    model:string;

    @Column()
    lat: number;

    @Column()
    lng:number;

    @Column()
    mileage:number;

    @Column()
    year:number;

    @Column()
    price:number;

    @Column({default: false})
    approved: boolean;

    @ManyToOne(()=>User, (user) => user.reports)
    user:User;


}