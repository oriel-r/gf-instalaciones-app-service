import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TaxCategory } from '../enum/taxCategory.enum';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'installer' })
export class Installer {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    type: 'enum',
    enum: TaxCategory,
  })
  taxCondition: TaxCategory;

  @Column({ type: 'text', nullable: true })
  queries: string;

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

  @OneToOne(() => User, (user) => user.installer, { nullable: false, cascade: true, eager: true })
  @JoinColumn()
  user: User;
}
