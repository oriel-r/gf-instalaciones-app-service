import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Installation } from "../entities/installation.entity";
import { BaseDto } from "src/common/entities/base.dto";
import { AdresResponseDto } from "src/modules/locations/adress/dto/adress-response.dto";

export class GetInstallationsDto extends BaseDto {
    id: string;
    images: string[] | null;
    startDate: string;
    endDate: Date;
    status: InstallationStatus;
    adress: AdresResponseDto;

    constructor(data: Installation) {
        super(data)

        this.id = data.id
        this.startDate = data.startDate
        this.endDate = data.endDate
        this.status = data.status
        this.adress = new AdresResponseDto(data.adress)
    }
}