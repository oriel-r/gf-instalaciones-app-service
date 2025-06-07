import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Installation } from "../entities/installation.entity";
import { BaseDto } from "src/common/entities/base.dto";
import { AddressResponseDto } from "src/modules/locations/address/dto/address-response.dto";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";
import { Installer } from "src/modules/installer/entities/installer.entity";

export class GetInstallationsDto extends BaseDto {
    id: string;
    images: string[] | null;
    startDate: Date;
    endDate: Date;
    coordinator: any;
    installers: any
    status: InstallationStatus;
    address: AddressResponseDto;

    constructor(data: Installation) {
        super(data)

        this.id = data.id
        this.startDate = data.startDate
        this.endDate = data.endDate
        this.status = data.status
        this.coordinator = (data.coordinator && data.coordinator)
        this.installers = (data.installers && data.installers.map(installer => installer.user))
        this.address = new AddressResponseDto(data.address)
    }
}