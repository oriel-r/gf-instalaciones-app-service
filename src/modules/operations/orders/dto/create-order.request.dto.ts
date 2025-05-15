import { BaseDto } from "src/common/entities/base.dto";
import { Order } from "../entities/order.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { CreateInstallationDto } from "src/modules/operations/installations/dto/create-installation.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsInstance, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { InstallationDataRequesDto } from "./installation-data.request.dto";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";

export class CreateOrderRequestDto extends BaseDto {

    @ApiProperty({
        title: 'orderNumber',
        description: 'external reference number'
    })
    @IsString()
    orderNumber: string;

    @ApiProperty({
        title: 'client',
        description: 'Send userRole where role is client'
    })
    @IsUUID()
    @IsNotEmpty()
    clientId: string;

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

}
