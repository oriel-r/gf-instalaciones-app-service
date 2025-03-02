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
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  birthDate: Date;

  @Column({ unique: true })
  idNumber: string;

  @Column()
  location: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({default: '+54', nullable: true})
  coverage?: string;

  @Column({ default: true })
  isSubscribed: boolean;

  @DeleteDateColumn()
  disabledAt?: Date;

  @OneToOne(() => Installer, (installer) => installer.user, { nullable: true })
  installer?: Installer | null;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @OneToOne(() => Coordinator, (coordinator) => coordinator.user, { nullable: true })
  coordinator?: Coordinator;

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  admin?: Admin;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
