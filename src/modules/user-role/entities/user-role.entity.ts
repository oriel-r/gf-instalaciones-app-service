import { Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/entities/roles.entity';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  role: Role;
}
