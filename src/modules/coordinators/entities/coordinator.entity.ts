import { Instalation } from 'src/modules/operations/instalations/entities/instalation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('coordinators')
export class Coordinator extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @OneToMany(() => Instalation, (instalation) => instalation.coordinator)
  instalations: Instalation[]; 
}
