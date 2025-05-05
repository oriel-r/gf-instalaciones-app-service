import { BaseDto } from "src/common/entities/base.dto";
import { Order } from "../entities/order.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { CreateInstallationDto } from "src/modules/operations/installations/dto/create-installation.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsInstance, ValidateNested } from "class-validator";
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

    @IsOptional()
    @IsBoolean()
    completed: boolean
    
}
