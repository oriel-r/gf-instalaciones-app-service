import { ApiProperty } from "@nestjs/swagger";
import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { Order } from "src/modules/operations/orders/entities/order.entity";
import { CreateNotificationDto } from "./create-notification.dto";
import { UUID } from "crypto";
import { Address } from "src/modules/locations/address/entities/address.entity";

export class InstallationGeneralUpdate {

    @ApiProperty({
        description: 'The fully order updated'
    })
    clientId: string

    @ApiProperty({
        description: 'The fully order updated'
    })
    coordinatorId: string

    @ApiProperty({
        description: 'The fully order updated'
    })
    address: Address

    @ApiProperty({
        description: 'The fully order updated'
    })
    newStatus: InstallationStatus

    constructor(clientId: string, coordinatorId: string, address: Address, newStatus: InstallationStatus) {
        this.clientId = clientId
        this.coordinatorId = coordinatorId
        this.address = address,
        this.newStatus = newStatus
    }
}