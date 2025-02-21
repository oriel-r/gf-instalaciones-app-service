import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity()
export class Coordinator {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  department: string;

  @Column()
  region: string;

  @OneToOne(() => User, (user) => user.coordinator)
  user: User;
}   

