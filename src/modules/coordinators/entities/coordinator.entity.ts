import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('coordinators')
export class Coordinator extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @OneToMany(() => Installation, (installation) => installation.coordinator)
  installations: Installation[]; 
}
