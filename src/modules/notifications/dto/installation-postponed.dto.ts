import { IsInstance, IsUUID } from "class-validator"
import { CreateNotificationDto } from "./create-notification.dto"
import { Address } from "src/modules/locations/address/entities/address.entity"
import { Installation } from "src/modules/operations/installations/entities/installation.entity"
import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array"

export class InstallationPostponedDto {

    @IsUUID()
    coordinatorId: string[]

    @IsInstance(Address)
    address: Address

    constructor({coordinator, address}: Installation) {
        this.coordinatorId = getIdsFromAraay(coordinator)
        this.address = address
    }s
}