import { BaseDto } from "src/common/entities/base.dto";
import { Adress } from "src/modules/locations/adress/entities/adress.entity";
import { Installation } from "../entities/installation.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { CreateAdressDto } from "src/modules/locations/adress/dto/create-adress.dto";
import { IsArray, IsDateString, IsInstance, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { InstallationDataRequesDto } from "../../orders/dto/installation-data.request.dto";

export class CreateInstallationDto extends BaseDto{
    
    @ApiProperty({
        title: "order",
        description: "an uuid"
    })
    @IsNotEmpty()
    @IsUUID()
    order: Order;
    
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
