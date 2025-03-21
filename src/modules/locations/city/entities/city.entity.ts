import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { Adress } from "src/modules/locations/adress/entities/adress.entity";
import { Province } from "src/modules/locations/province/entities/province.entity";
import { Column, DeepPartial, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class City extends BaseEntity {
    @ApiProperty({
        title: 'id',
        description: "city's id"
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        title: "name",
        description: "city's name"
    })
    @Column( 'varchar',{nullable: false})
    name: string

    @ApiProperty({
        title: "cities",
        description: "city's province"
    })
    @ManyToOne(() => Province, (province) => province.cities, {eager: true})
    province: Province


    @ApiProperty({
        title: 'adresses'
    })
    @OneToMany(() => Adress, (adress) => adress.city)
    adresses: Adress[]

    constructor(partial: DeepPartial<City>) {
        super()
        Object.assign(this, partial)
    }    

}
