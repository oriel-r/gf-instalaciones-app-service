import { BaseDto } from "src/common/entities/base.dto";
import { Order } from "../entities/order.entity";
import { Instalation } from "src/modules/operations/instalations/entities/instalation.entity";
import { CreateInstalationDto } from "src/modules/operations/instalations/dto/create-instalation.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsInstance, ValidateNested } from "@nestjs/class-validator";
import { Type } from "class-transformer";
import { InstalationDataRequesDto } from "./instalation-data.request.dto";

export class CreateOrderRequestDto extends BaseDto {

    @ApiProperty({
        title: 'orderNumber',
        description: 'external reference number'
    })
    @IsString()
    orderNumber: string;

    @ApiProperty({
        title: 'title',
        description: 'a reference title'
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        title: 'description',
        description: "a description for the order"
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        title: "instalations",
        description: 'is optional',
        type: [InstalationDataRequesDto]
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => InstalationDataRequesDto)
    instalations: InstalationDataRequesDto[]

}
