import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxCategory } from '../../../common/enums/taxCategory.enum';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';

@Entity({ name: 'installers' })
export class Installer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TaxCategory,
  })
  taxCondition: TaxCategory;

  @Column({ type: 'text', nullable: true })
  queries?: string;

  @Column()
  hasPersonalAccidentInsurance: boolean;

  @Column()
  canWorkAtHeight: boolean;

  @Column()
  canTensionFrontAndBackLonas: boolean;

  @Column()
  canInstallCorporealSigns: boolean;

  @Column()
  canInstallFrostedVinyl: boolean;

  @Column()
  canInstallVinylOnWallsOrGlass: boolean;

  @Column()
  canDoCarWrapping: boolean;

  @Column()
  hasOwnTransportation: boolean;

  @Column({
    type: 'enum',
    enum: StatusInstaller,
    default: StatusInstaller.InProcess,
  })
  status?: StatusInstaller;

  @Column({ type: 'timestamp', nullable: true })
  disabledAt: Date | null;

  @OneToOne(() => User, (user) => user.installer, { nullable: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Coordinator, (coordinator) => coordinator.installers, {
    nullable: true,
  })
  coordinator: Coordinator;

  @ManyToMany(() => Installation, (Installation) => Installation.installers)
  @JoinTable()
  installations: Installation[];
}
