import { IsInstance, IsUUID } from "class-validator"
import { CreateNotificationDto } from "./create-notification.dto"
import { Address } from "src/modules/locations/address/entities/address.entity"

export class InstallationPostponedDto {

    @IsUUID()
    coordinatorId: string

    @IsInstance(Address)
    address: Address

    constructor(coordinator: string, address: Address) {
        this.coordinatorId = coordinator
        this.address = address
    }
}