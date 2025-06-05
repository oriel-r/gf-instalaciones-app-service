import {
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsISO8601,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DeepPartial } from 'typeorm';
import { CreateAddressDto } from 'src/modules/locations/address/dto/create-address.dto';
import { IsTodayOrAffterToday } from 'src/common/decorators/is-affter-today.valitaion';

export class UpdateInstallationDto {
  @IsOptional()
  @IsISO8601()
  @IsTodayOrAffterToday()
  startDate?: string;

  @IsOptional()
  @IsArray()
  installersIds?: string[];

  @IsUUID()
  @IsOptional()
  coordinatorsIds?: string[];

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsOptional()
  @Type(() => CreateAddressDto)
  addressData?: DeepPartial<CreateAddressDto>;
}
