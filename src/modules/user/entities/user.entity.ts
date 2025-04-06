import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../../user-role/entities/user-role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({nullable: false})
  fullName: string;

  @Column()
  email: string;

  @Column()
  birthDate: Date;

  @Column()
  idNumber: string;

  @Column()
  location: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({default: '+54'})
  coverage: string;

  @Column({ default: true })
  isSubscribed: boolean;

  @DeleteDateColumn()
  disabledAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user,  { cascade: true })
  userRoles: UserRole[];
}
