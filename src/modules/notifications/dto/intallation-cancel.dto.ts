import { IsString, ValidateNested } from "class-validator";
import { Installer } from "src/modules/installer/entities/installer.entity";

export class InstallationCancelDto {

    @IsString()
    clientId?: string

    @IsString()
    coordinatorId: string

    @ValidateNested({each:true})
    installers: Installer[]

    constructor(coordinatorId: string, installers: Installer[], clientId?: string) {
        this.coordinatorId = coordinatorId,
        this.installers = installers,
        this.clientId = clientId
    }
}