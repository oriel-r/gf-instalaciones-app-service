import { BaseDto } from "src/common/entities/base.dto";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from "class-validator";
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
    @IsNotEmpty()
    installation: InstallationDataRequesDto

}
