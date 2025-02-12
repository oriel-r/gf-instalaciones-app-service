import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    email: string;

    @Column()
    birthdate?: Date;

    @Column()
    identificationNumber: string;

    @Column()
    location?: string;

    @Column()
    adress: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column()
    confirmPassword: string;

    @Column({ default: true })
    isSubscribed: boolean;

}
