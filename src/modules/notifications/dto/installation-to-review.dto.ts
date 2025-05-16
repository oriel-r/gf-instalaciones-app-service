import { IsNotEmpty } from "class-validator";
import { InstallationPostponedDto } from "./installation-postponed.dto";
import { Address } from "src/modules/locations/address/entities/address.entity";

export class InstallationToReviewDto {

    @IsNotEmpty()
    coordinatorId: string;

    @IsNotEmpty()
    address: Address;

    @IsNotEmpty()
    clientId: string

    @IsNotEmpty()
    images: string[]

    constructor(client: string, coordinator: string, address: Address, images: string[]) {
        this.clientId = client
        this.coordinatorId = coordinator
        this.address = address
        this.images = images
    }
}