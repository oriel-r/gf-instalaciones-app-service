import { IsString, ValidateNested } from "class-validator";
import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";

export class InstallationCancelDto {

    @IsString()
    clientId?: string[]

    @IsString()
    coordinatorId: string[]

    @ValidateNested({each:true})
    installers: Installer[]

    constructor({coordinator, installers, order:{client}}: Installation) {
        this.coordinatorId = getIdsFromAraay(coordinator),
        this.installers = installers as Installer[],
        this.clientId = getIdsFromAraay(client)
    }
}