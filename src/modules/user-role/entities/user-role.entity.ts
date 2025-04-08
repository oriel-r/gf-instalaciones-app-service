import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/entities/roles.entity';
import { v4 as uuid } from 'uuid';
import { Notification } from 'src/modules/notifications/entities/notification.entity';

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE', eager: true})
  role: Role;

  @ManyToMany(() => Notification, (notification) => notification.receivers, {eager: true})
  notifications: Notification[]
}
