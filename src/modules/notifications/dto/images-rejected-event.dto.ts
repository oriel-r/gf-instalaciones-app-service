import { IsString } from "class-validator";
import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Address } from "src/modules/locations/address/entities/address.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";

export class ImagesRejectedEvent {
  
  @IsString()
  address: Address;

  @IsString()
  installationId: string

  @IsString()
  installersIds: string[] | null;

  constructor({address, installers, id}: Installation) {
    this.address = address
    this.installersIds = getIdsFromAraay(installers)
    this.installationId = id
  }

}