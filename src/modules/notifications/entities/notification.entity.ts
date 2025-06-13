import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({
    title: 'message',
    description: 'a fully description of the notification',
  })
  @Column({ type: 'varchar', nullable: true })
  message: string;

  @ManyToMany(() => UserRole, (userRole) => userRole.notifications)
  @JoinTable()
  receivers: UserRole[];
}
