import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { InstalationStatus } from "src/common/enums/instalations-status.enum";
import { Coordinator } from "src/modules/coordinators/entities/coordinator.entity";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Adress } from "src/modules/locations/adress/entities/adress.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { Column, DeepPartial, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instalation extends BaseEntity {

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
    @ManyToOne(() => Order, (order) => order.instalations, {nullable: false})
    order: Order

    @ApiProperty({
        title: 'order',
        description: "installation installer"
    })
    @ManyToMany(() => Installer, (installer) => installer.instalations, { onDelete: 'SET NULL' })
    installers: Installer[];

    @ApiProperty({
        title: 'Coordinators',
        description: "installation coordinators"
    })
    @ManyToOne(() => Coordinator, (coordinator) => coordinator.instalations, { onDelete: 'SET NULL' })
    coordinator: Coordinator;

    @ApiProperty({
        title: 'startDate',
        description: "The day when start the instalation"
    })
    @Column('varchar', {nullable: true})
    startDate: string
    
    @ApiProperty({
        title: 'images',
        description: 'an urls array of images'
    })
    @Column('array', {nullable: true})
    images: string[] | null

    @ApiProperty({
        title: 'startDate',
        description: "The day when start the instalation"
    })
    @Column({default: InstalationStatus.PENDING, type: 'enum', enum: InstalationStatus})
    status: InstalationStatus
    
    @ApiProperty({
        title: 'adress',
        description: "inslation adress"
    })
    @ManyToOne(() => Adress, (adress) => adress.instalations, {nullable: false})
    adress: Adress

    @ApiProperty({
        title: 'notes',
        description: "extra notes for installers"
    })
    @Column('varchar', {nullable: true})
    notes: string

    @ApiProperty({
        title: 'endDate',
        description: "The day in that the instalation is finished"
    })
    @Column('date', {nullable: true})
    endDate: Date

    constructor(partial: DeepPartial<Instalation>) {
        super()
        Object.assign(this, partial)
    }

}
