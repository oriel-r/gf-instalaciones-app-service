import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { TaxCategory } from '../enum/taxCategory.enum';

export class CreateInstallerDto extends CreateUserDto {
  @IsEnum(TaxCategory)
  taxCondition: TaxCategory;

  @IsString()
  @IsOptional()
  queries?: string;

  @IsBoolean()
  hasPersonalAccidentInsurance: boolean;

  @IsBoolean()
  canWorkAtHeight: boolean;

  @IsBoolean()
  canTensionFrontAndBackLonas: boolean;

  @IsBoolean()
  canInstallCorporealSigns: boolean;

  @IsBoolean()
  canInstallFrostedVinyl: boolean;

  @IsBoolean()
  canInstallVinylOnWallsOrGlass: boolean;

  @IsBoolean()
  canDoCarWrapping: boolean;

  @IsBoolean()
  hasOwnTransportation: boolean;
}
