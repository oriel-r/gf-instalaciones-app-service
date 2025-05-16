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

export class UpdateInstallationDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  startDate: string;

  @IsOptional()
  @IsArray()
  @IsUUID()
  installersIds?: string[];

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  addressData?: DeepPartial<CreateAddressDto>;
}
