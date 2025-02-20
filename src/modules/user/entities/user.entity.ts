import { Installer } from 'src/modules/installer/entities/installer.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Role } from './roles.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';
import { Admin } from 'src/modules/admins/entities/admins.entity';

@Entity({ name: 'users' })
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

  @Column({ default: true })
  isSubscribed: boolean;

  @DeleteDateColumn()
  disabledAt?: Date;

  @OneToOne(() => Installer, (installer) => installer.user, { nullable: true })
  installer?: Installer | null;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @OneToOne(() => Coordinator, (coordinator) => coordinator.user, { nullable: true })
  coordinator: Coordinator;

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  admin: Admin;
}
