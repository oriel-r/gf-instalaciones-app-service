    import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
    import { v4 as uuid } from 'uuid';
    import { TaxCategory } from '../../../common/enums/taxCategory.enum';
    import { ApiProperty } from '@nestjs/swagger';
    import { StatusInstaller } from 'src/common/enums/status-installer';
    import { Instalation } from 'src/modules/operations/instalations/entities/instalation.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';

    @Entity({ name: 'installers' })
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

      @OneToOne(() => UserRole)
      @JoinColumn()
      userRoleDetail: UserRole;

      @ManyToMany(() => Instalation, (Instalation) => Instalation.installers)
      @JoinTable()
      instalations: Instalation[];
    }
