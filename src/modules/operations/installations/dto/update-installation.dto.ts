import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { IsISO8601 } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { CreateAddressDto } from 'src/modules/locations/address/dto/create-address.dto';
import { Transform } from 'class-transformer';

export class UpdateInstallationDto {

    @IsOptional()
    @IsISO8601()
    @Transform(({ value }) => new Date(value))
    startDate: Date

    @IsOptional()
    @IsArray()
    installersIds: string[]

    @IsUUID()
    @IsOptional()
    coordinatorId?: string

    @IsUUID()
    @IsOptional()
    addressId?: string

    @IsOptional()
    addressData?: DeepPartial<CreateAddressDto>
}
