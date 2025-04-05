import { ApiProperty } from "@nestjs/swagger";
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


    constructor(clientId: string, coordinatorId: string, address: Address) {
        this.clientId = clientId
        this.coordinatorId = coordinatorId
        this.address = address
    }
}