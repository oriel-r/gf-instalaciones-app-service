import { BaseDto } from "src/common/entities/base.dto";
import { Order } from "../entities/order.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { CreateInstallationDto } from "src/modules/operations/installations/dto/create-installation.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsInstance, ValidateNested } from "@nestjs/class-validator";
import { Type } from "class-transformer";
import { InstallationDataRequesDto } from "./installation-data.request.dto";

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
        title: "installations",
        description: 'is optional',
        type: [InstallationDataRequesDto]
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => InstallationDataRequesDto)
    installations: InstallationDataRequesDto[]

}
