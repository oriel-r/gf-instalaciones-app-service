import { BaseDto } from "src/common/entities/base.dto";
import { Adress } from "src/modules/locations/adress/entities/adress.entity";
import { Instalation } from "../entities/instalation.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { CreateAdressDto } from "src/modules/locations/adress/dto/create-adress.dto";
import { IsDateString, IsInstance, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInstalationDto extends BaseDto{
    
    @ApiProperty({
        title: "order",
        description: "an uuid"
    })
    @IsNotEmpty()
    @IsUUID()
    order: Order;
    
    @ApiProperty({
        title: "startDate",
        description: "An date string to indicate the date will doing the instalation"
    })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;
    
    @ApiProperty({
        title: "adress",
        description: "instalrion's adress, if no exist it created"
    })
    @IsNotEmpty()
    @IsInstance(CreateAdressDto)
    adress: CreateAdressDto;

    @ApiProperty({
        title: 'notes',
        description: "notes for installers"
    })
    @IsString()
    @IsOptional()
    notes?: string
}
