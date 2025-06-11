import { ApiProperty } from "@nestjs/swagger";
import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array";
import { Address } from "src/modules/locations/address/entities/address.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";

export class InstallationGeneralUpdate {

    @ApiProperty({
        description: 'The fully order updated'
    })
    clientId: string[]

    @ApiProperty({
        description: 'The fully order updated'
    })
    coordinatorId: string[]

    @ApiProperty({
        description: 'The fully order updated'
    })
    address: Address


    constructor({order: {client}, coordinator, address}: Installation) {
        this.clientId = getIdsFromAraay(client)
        this.coordinatorId = getIdsFromAraay(coordinator)
        this.address = address
    }
}