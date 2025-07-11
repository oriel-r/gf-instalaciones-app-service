import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/entities/roles.entity';
import { v4 as uuid } from 'uuid';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { IsBoolean } from 'class-validator';

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: 'CASCADE',
    eager: true,
  })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Notification, (notification) => notification.receivers, {
    eager: true,
  })
  notifications: Notification[];
}
