import { IsNotEmpty, IsOptional, IsString, MaxLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BlogCategory extends BaseEntity {
    
    @ApiProperty({
        title: 'id',
        description: 'Autogemerated UUID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        title: 'title',
        description: "category's title",
        type: 'string',
        example: "Captación de clientes"
    })
    @IsString()
    @IsNotEmpty()
    @Column({type: 'varchar', nullable: false})
    title: string

    @ApiProperty({
        title: 'description',
        description: "category's description",
        type: 'string',
        maxLength: 160,
        example: 'An description of the category'
    })
    @IsString()
    @IsOptional()
    @MaxLength(160)
    @Column({type:'varchar', nullable: true, })
    description: string

    


}