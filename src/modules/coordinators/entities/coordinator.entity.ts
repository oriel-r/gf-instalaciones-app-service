import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('coordinators')
export class Coordinator {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @OneToOne(() => User, (user) => user.coordinator, {
    nullable: false,
    eager: true,
  })
  user: User;

  @OneToMany(() => Installation, (installation) => installation.coordinator)
  installations: Installation[]; 
}
