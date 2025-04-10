import { Installer } from 'src/modules/installer/entities/installer.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, Column } from 'typeorm';

@Entity('coordinators')
export class Coordinator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.coordinator, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp', nullable: true })
  disabledAt: Date | null;

  @OneToMany(() => Installer, (installer) => installer.coordinator)
  installers: Installer[];

  @OneToMany(() => Installation, (installation) => installation.coordinator)
  installations: Installation[]; 
}
