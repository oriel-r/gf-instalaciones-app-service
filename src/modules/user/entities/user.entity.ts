import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @Column({ unique: true })
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
