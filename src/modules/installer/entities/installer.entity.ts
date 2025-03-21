    import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
    import { v4 as uuid } from 'uuid';
    import { TaxCategory } from '../../../common/enums/taxCategory.enum';
    import { User } from 'src/modules/user/entities/user.entity';
    import { ApiProperty } from '@nestjs/swagger';
    import { StatusInstaller } from 'src/common/enums/status-installer';
    import { Installation } from 'src/modules/operations/installations/entities/installation.entity';

    @Entity()
    export class Installer {
      @ApiProperty({
        description: 'ID único del instalador.',
        example: '123e4567-e89b-12d3-a456-426614174000',
      })
      @PrimaryGeneratedColumn('uuid')
      id: string = uuid();

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
        default: StatusInstaller.InProcess
      })
      status?: StatusInstaller;

      @OneToOne(() => User, (user) => user.installer, { nullable: false, cascade: true, eager: true })
      @JoinColumn({name: 'user_id'})
      user: User;

      @ManyToMany(() => Installation, (Installation) => Installation.installers)
      @JoinTable({name: 'installer_installation'})
      installations: Installation[];
    }
