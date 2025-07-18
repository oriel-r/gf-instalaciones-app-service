import { ApiProperty } from '@nestjs/swagger';
import { timestamp } from 'rxjs';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order extends BaseEntity {
  @ApiProperty({
    title: 'id',
    description: 'autogenerated uuid for internal use',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    title: 'Client',
    description: "order's client",
  })
  @ManyToMany(() => UserRole, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinTable({ name: 'client_id' })
  client: UserRole[] | null;

  @ApiProperty({
    title: 'orderNumber',
    description: 'the order number inserted by admin',
  })
  @Column({ nullable: true, type: 'varchar' })
  orderNumber: string;

  @ApiProperty({
    title: 'title',
    description: "Order's title",
  })
  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @ApiProperty({
    title: 'description',
    description: "order's description",
  })
  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @ApiProperty({
    title: 'description',
    description: "order's status",
  })
  @Column({ nullable: true, type: 'timestamptz' })
  endDate: Date | null;

  @ApiProperty({
    title: 'progress',
    description: "order that all order's installations are completed",
    type: 'boolean',
    default: 'false',
  })
  @Column('boolean', { default: false })
  completed: boolean;

  @ApiProperty({
    title: 'progress',
    description: "order's progress",
    type: 'number',
  })
  @Column('varchar', { default: '0/0' })
  installationsFinished: string;

  @ApiProperty({
    title: 'progress',
    description: "order's progress",
    type: 'number',
  })
  @Column('decimal', { precision: 5, scale: 2, default: 0.0 })
  progress: number;

  @Column('int', { default: 0 })
  notifiedInstallations: number;

  @ApiProperty({
    title: 'installations',
    description: 'list of installations',
    type: [Installation],
  })
  @OneToMany(() => Installation, (installation) => installation.order, {
    nullable: true,
    eager: true,
  })
  installations: Installation[];

  @Column({ default: null, nullable: true, type: 'timestamptz' })
  finishedAt: Date | null;

  constructor(partial: DeepPartial<Order>) {
    super();
    Object.assign(this, partial);
  }
}
