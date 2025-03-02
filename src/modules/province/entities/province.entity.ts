import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { City } from "src/modules/city/entities/city.entity";
import { Column, DeepPartial, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Province extends BaseEntity {
    @ApiProperty({
        title: 'id',
        description: "province's id"
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        title: "name",
        description: "province's name"
    })
    @Column( 'varchar',{nullable: false})
    name: string

    @ApiProperty({
        title: "cities",
        description: "province's cities"
    })
    @OneToMany(() => City, (city) => city.provice)
    cities: City[]

    constructor(partial: DeepPartial<Province>) {
        super()
        Object.assign(this, partial)
    }

}
