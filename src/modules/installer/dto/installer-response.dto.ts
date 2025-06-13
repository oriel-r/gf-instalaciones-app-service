import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { TaxCategory } from 'src/common/enums/taxCategory.enum';
import { InstallerUserBasicDto } from './installer-user-basic.dto';

export class InstallerResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ enum: TaxCategory })
  taxCondition: TaxCategory;

  @Expose()
  @ApiProperty({ required: false })
  queries?: string;

  @Expose()
  @ApiProperty()
  hasPersonalAccidentInsurance: boolean;

  @Expose()
  @ApiProperty()
  canWorkAtHeight: boolean;

  @Expose()
  @ApiProperty()
  canTensionFrontAndBackLonas: boolean;

  @Expose()
  @ApiProperty()
  canInstallCorporealSigns: boolean;

  @Expose()
  @ApiProperty()
  canInstallFrostedVinyl: boolean;

  @Expose()
  @ApiProperty()
  canInstallVinylOnWallsOrGlass: boolean;

  @Expose()
  @ApiProperty()
  canDoCarWrapping: boolean;

  @Expose()
  @ApiProperty()
  hasOwnTransportation: boolean;

  @Expose()
  @ApiProperty({ enum: StatusInstaller, required: false })
  status?: StatusInstaller;

  @Expose()
  @Type(() => InstallerUserBasicDto)
  @ApiProperty({ type: () => InstallerUserBasicDto })
  user: InstallerUserBasicDto;
}
