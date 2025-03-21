import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";
import { BaseDto } from "src/common/entities/base.dto";
import { DeepPartial } from "typeorm";

export class CreateAdressDto extends BaseDto{

    @ApiProperty({
        title: 'street'
    })
    @IsString()
    @IsNotEmpty()
    street: string
    
    @ApiProperty({
        title: "stree's number",
        description: 'this field only acept numeric strings',
        maxLength: 5
    })
    @IsNotEmpty()
    @Length(5)
    @IsNumberString()
    number:string

    @ApiProperty({
        title: 'note',
        description: "add other references"
    })
    @IsNotEmpty()
    @IsString()
    note:string

    @ApiProperty({
        title: "postalCode",
        description: "add postal code"
    })
    @IsNotEmpty()
    @IsString()
    postalCode: string

    @ApiProperty({
        title: 'city',
        description: "city's name"
    })
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty({
        title: 'province',
        description: "province's name"
    })
    @IsNotEmpty()
    @IsString()
    province: string
    
}
