import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { InstalationStatus } from "src/common/enums/instalations-status.enum";
import { Adress } from "src/modules/adress/entities/adress.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Column, DeepPartial, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instalation extends BaseEntity {

    @ApiProperty({
        title: 'id',
        description: "instalarion's id"
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        title: 'order',
        description: "instalarion's order"
    })
    @ManyToOne(() => Order, (order) => order.instalarions, {nullable: false})
    order: Order

    @ApiProperty({
        title: 'startDate',
        description: "The day when start the instalation"
    })
    @Column('date', {nullable: false})
    startDate: Date
    
    @ApiProperty({
        title: 'startDate',
        description: "The day when start the instalation"
    })
    @Column('enum', {default: InstalationStatus.PENDING})
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
    @Column('string', {nullable: true})
    notes: string

    @ApiProperty({
        title: 'endDate',
        description: "The day in that the instalation is finished"
    })
    @Column('date', {nullable: false})
    endDate: Date

    constructor(partial: DeepPartial<Instalation>) {
        super()
        Object.assign(this, partial)
    }

}
