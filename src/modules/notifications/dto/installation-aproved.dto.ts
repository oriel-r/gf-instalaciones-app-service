import { IsArray, IsInstance, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateNotificationDto } from "./create-notification.dto";
import { ValidateNested } from "class-validator";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Address } from "src/modules/locations/address/entities/address.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array";

export class InstallationApprovedDto {
    @IsUUID()
    clientId: string[]

    @IsArray()
    @ValidateNested({each: true})
    installers: Installer[]

    @IsInstance(Address)
    address: Address

    @IsOptional()
    @IsString()
    orderId: string

    @IsOptional()
    @IsArray()
    images?: string[]

    constructor({order:{id, client}, installers, address, images}: Installation) {
        this.clientId = getIdsFromAraay(client)
        this.installers = installers as Installer[]
        this.address = address
        this.orderId = id
        this.images = images as string[]
}
}