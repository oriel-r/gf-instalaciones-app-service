import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/entities/base.dto";
import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";

export class CreateNotificationDto {
    
    @ApiProperty({
        description: 'A title for the notifications'
    })
    title: string;
    
    @ApiProperty({
        description: 'detalled notifiaction data'
    })
    message: string;
    
    @ApiProperty({})
    receivers: UserRole[]

}
  


