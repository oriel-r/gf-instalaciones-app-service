import { BaseDto } from "src/common/entities/base.dto";
import { Order } from "../entities/order.entity";
import { Instalation } from "src/modules/instalations/entities/instalation.entity";
import { CreateInstalationDto } from "src/modules/instalations/dto/create-instalation.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsInstance, ValidateNested } from "@nestjs/class-validator";
import { Type } from "class-transformer";

export class UpdateOrderDto extends BaseDto {

    @ApiProperty({
        title: 'orderNumber',
        description: 'external reference number'
    })
    @IsOptional()
    orderNumber?: string;

    @ApiProperty({
        title: 'title',
        description: 'a reference title'
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        title: 'description',
        description: "a description for the order"
    })
    @IsString()
    @IsOptional()
    description?: string;

}
