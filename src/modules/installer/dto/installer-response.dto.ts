import { ApiProperty } from '@nestjs/swagger';
import { TaxCategory } from 'src/common/enums/taxCategory.enum';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { InstallerUserBasicDto } from './installer-user-basic.dto';

export class InstallerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: TaxCategory })
  taxCondition: TaxCategory;

  @ApiProperty({ required: false })
  queries?: string;

  @ApiProperty()
  hasPersonalAccidentInsurance: boolean;

  @ApiProperty()
  canWorkAtHeight: boolean;

  @ApiProperty()
  canTensionFrontAndBackLonas: boolean;

  @ApiProperty()
  canInstallCorporealSigns: boolean;

  @ApiProperty()
  canInstallFrostedVinyl: boolean;

  @ApiProperty()
  canInstallVinylOnWallsOrGlass: boolean;

  @ApiProperty()
  canDoCarWrapping: boolean;

  @ApiProperty()
  hasOwnTransportation: boolean;

  @ApiProperty({ enum: StatusInstaller, required: false })
  status?: StatusInstaller;

  @ApiProperty({ type: () => InstallerUserBasicDto })
  user: InstallerUserBasicDto;
}
