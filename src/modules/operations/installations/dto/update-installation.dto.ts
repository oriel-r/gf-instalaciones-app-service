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
import { IsAfterToday } from 'src/common/decorators/is-affter-today.valitaion';

export class UpdateInstallationDto {
  @IsOptional()
  @IsISO8601()
  @IsAfterToday()
  startDate?: string;

  @IsOptional()
  @IsArray()
  installersIds?: string[];

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsOptional()
  @Type(() => CreateAddressDto)
  addressData?: DeepPartial<CreateAddressDto>;
}
