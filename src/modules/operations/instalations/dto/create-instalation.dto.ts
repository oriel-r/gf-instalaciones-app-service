import { BaseDto } from "src/common/entities/base.dto";
import { Adress } from "src/modules/locations/adress/entities/adress.entity";
import { Instalation } from "../entities/instalation.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { CreateAdressDto } from "src/modules/locations/adress/dto/create-adress.dto";
import { IsArray, IsDateString, IsInstance, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { InstalationDataRequesDto } from "../../orders/dto/instalation-data.request.dto";

export class CreateInstalationDto extends BaseDto{
    
    @ApiProperty({
        title: "order",
        description: "an uuid"
    })
    @IsNotEmpty()
    @IsUUID()
    order: Order;
    
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
