import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  url: string;

  @Column()
  mimetype: string;

  @CreateDateColumn()
  createdAt: Date;

  /* @ManyToOne(() => Installation, (installation) => installation.images)
  installation: Installation; */
}
