import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Address } from "src/modules/locations/address/entities/address.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";
import { Column, DeepPartial, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
    @ManyToMany(() => Installer, (installer) => installer.installations ,{ onDelete: 'SET NULL', nullable: true, eager: true})
    installers: Installer[] | null;

    @ApiProperty({
        title: 'Coordinator',
        description: "installation coordinators"
    })
    @ManyToOne(() => UserRole, { onDelete: 'SET NULL', nullable: true, eager: true})
    @JoinColumn({name: 'coordinator_id'})
    coordinator: UserRole | null;

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
        title: 'Address',
        description: "inslation Address"
    })
    @ManyToOne(() => Address, (address) => address.installations, {nullable: false, eager: true})
    address: Address

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
