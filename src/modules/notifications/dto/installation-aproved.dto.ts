import { IsArray, IsInstance, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateNotificationDto } from "./create-notification.dto";
import { ValidateNested } from "@nestjs/class-validator";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Address } from "src/modules/locations/address/entities/address.entity";

export class InstallationApprovedDto {
    @IsUUID()
    clientId: string

    @IsArray()
    @ValidateNested({each: true})
    installers: Installer[]

    @IsInstance(Address)
    address: Address

    @IsOptional()
    @IsString()
    orderId: string

    constructor(client: string, installers: Installer[], address: Address, orderId: string) {
        this.clientId = client
        this.installers = installers
        this.address = address
        this.orderId = orderId
}
}