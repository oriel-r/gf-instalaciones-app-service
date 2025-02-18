import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaxCategory } from 'src/modules/installer/enum/taxCategory.enum';

export class ExtendedInstallerDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthdate?: Date;

  @IsString()
  identificationNumber: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  adress: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;
  @IsString()
  confirmPassword: string;

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
