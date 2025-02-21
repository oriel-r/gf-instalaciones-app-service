import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
