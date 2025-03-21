import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Coordinator } from "src/modules/coordinators/entities/coordinator.entity";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Adress } from "src/modules/locations/adress/entities/adress.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { Column, DeepPartial, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Installation extends BaseEntity {

    @ApiProperty({
        title: 'id',
        description: "instalarion's id"
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        title: 'Installer',
        description: "instalarion's order"
    })
    @ManyToOne(() => Order, (order) => order.installations, {nullable: false})
    order: Order

    @ApiProperty({
        title: 'order',
        description: "installation installer"
    })
    @ManyToMany(() => Installer, (installer) => installer.installations, { onDelete: 'SET NULL', nullable: true})
    installers: Installer[] | null;

    @ApiProperty({
        title: 'Coordinators',
        description: "installation coordinators"
    })
    @ManyToOne(() => Coordinator, (coordinator) => coordinator.installations, { onDelete: 'SET NULL', nullable: true})
    coordinator: Coordinator | null;

    @ApiProperty({
        title: 'startDate',
        description: "The day when start the installation"
    })
    @Column('varchar', {nullable: true})
    startDate: string
    
    @ApiProperty({
        title: 'images',
        description: 'an urls array of images'
    })
    @Column('varchar', {nullable: true, array: true})
    images: string[] | null

    @ApiProperty({
        title: 'startDate',
        description: "The day when start the installation"
    })
    @Column({default: InstallationStatus.PENDING, type: 'enum', enum: InstallationStatus})
    status: InstallationStatus
    
    @ApiProperty({
        title: 'adress',
        description: "inslation adress"
    })
    @ManyToOne(() => Adress, (adress) => adress.installations, {nullable: false, eager: true})
    adress: Adress

    @ApiProperty({
        title: 'notes',
        description: "extra notes for installers"
    })
    @Column('varchar', {nullable: true})
    notes: string

    @ApiProperty({
        title: 'endDate',
        description: "The day in that the installation is finished"
    })
    @Column('date', {nullable: true})
    endDate: Date

    constructor(partial: DeepPartial<Installation>) {
        super()
        Object.assign(this, partial)
    }

}
