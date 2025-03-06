import { Installer } from 'src/modules/installer/entities/installer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuid } from 'uuid';
/* import { Installer } from './installer.entity';
import { Installation } from './installation.entity'; */

@Entity('coordinators')
export class Coordinator {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @OneToOne(() => User, (user) => user.coordinator, {
    nullable: false,
    cascade: true,
    eager: true,
  })
  user: User;

  @ManyToMany(() => Installer, (installer) => installer.coordinators)
  @JoinTable() 
  installers: Installer[];

  /* @OneToMany(() => Installation, (installation) => installation.coordinator)
  installations: Installation[];  */ 
}
