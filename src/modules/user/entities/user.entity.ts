import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../../user-role/entities/user-role.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';
import { Admin } from 'src/modules/admins/entities/admins.entity';
import { Exclude } from 'class-transformer';
import { PasswordResetToken } from '../../auth/entities/passwordResetToken.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Exclude()
  @Column()
  password: string;

  @Column({default: '+54'})
  coverage: string;

  @Column({ default: true })
  isSubscribed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  disabledAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Installer, installer => installer.user, { cascade: true })
  installer?: Installer;

  @OneToOne(() => Coordinator, coordinator => coordinator.user, { cascade: true })
  coordinator?: Coordinator;

  @OneToOne(() => Admin, admin => admin.user, { cascade: true })
  admin?: Admin;

  @OneToMany(() => UserRole, (userRole) => userRole.user,  { cascade: true})
  userRoles: UserRole[];

  @OneToMany(() => PasswordResetToken, (passwordResetToken) => passwordResetToken.user, {cascade: true})
  passwordResetToken: PasswordResetToken[];
}
