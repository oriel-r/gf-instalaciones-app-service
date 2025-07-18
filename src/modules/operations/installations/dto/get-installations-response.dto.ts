import { InstallationStatus } from 'src/common/enums/installations-status.enum';
import { Installation } from '../entities/installation.entity';
import { BaseDto } from 'src/common/entities/base.dto';
import { AddressResponseDto } from 'src/modules/locations/address/dto/address-response.dto';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class GetInstallationsDto extends BaseDto {
  id: string;
  images: string[] | null;
  startDate: Date | null;
  endDate: Date | null;
  coordinator: User[] | null;
  installers: User[] | null;
  status: InstallationStatus;
  address: AddressResponseDto | null;

  constructor(data: Installation) {
    super(data);

    this.id = data.id;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.status = data.status;
    this.coordinator =
      data.coordinator &&
      data.coordinator.map((coordinator) => coordinator.user);
    this.installers =
      data.installers && data.installers.map((installer) => installer.user);
    this.address = data.address ? new AddressResponseDto(data.address) : null;
  }
}
