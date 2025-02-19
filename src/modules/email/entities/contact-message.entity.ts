import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({name: 'contact_message'})
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: number = uuid();

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
