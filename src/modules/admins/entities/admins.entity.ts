import { User } from "src/modules/user/entities/user.entity";
import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity()
export class Admin extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
}

