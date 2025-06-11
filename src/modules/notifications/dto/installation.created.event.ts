import { IsString } from "class-validator";
import { add } from "date-fns";
import { getIdsFromAraay } from "src/common/helpers/get-ids-from-array";
import { Address } from "src/modules/locations/address/entities/address.entity";
import { Installation } from "src/modules/operations/installations/entities/installation.entity";

export class InstallationCreatedEvent {
  
  coordinatorsIds: string[]
  
  installersIds: string[]

  address: Address

  constructor({coordinator, installers, address}: Installation) {
    this.coordinatorsIds = getIdsFromAraay(coordinator)
    this.installersIds = getIdsFromAraay(installers)
    this.address = address
  }
}
