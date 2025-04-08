import { TaxCategory } from 'src/common/enums/taxCategory.enum';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { Role } from 'src/modules/user/entities/roles.entity';

export class InstallerResponseDto {
  id: string;
  taxCondition: TaxCategory;
  queries?: string;
  hasPersonalAccidentInsurance: boolean;
  canWorkAtHeight: boolean;
  canTensionFrontAndBackLonas: boolean;
  canInstallCorporealSigns: boolean;
  canInstallFrostedVinyl: boolean;
  canInstallVinylOnWallsOrGlass: boolean;
  canDoCarWrapping: boolean;
  hasOwnTransportation: boolean;
  status?: StatusInstaller;

  user: {
    id: string;
    fullName: string;
    email: string;
    birthDate: Date;
    idNumber: string;
    country: string;
    address: string;
    location: string;
    coverage?: string;
    phone: string;
    createdAt: Date;
    isSubscribed?: boolean;
    disabledAt?: Date;
    userRoles: {
      id: string;
      role: {
        id: string;
        name: string;
      };
    }[];
  };
}
