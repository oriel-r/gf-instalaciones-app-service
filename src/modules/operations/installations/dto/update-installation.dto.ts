import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { IsISO8601 } from '@nestjs/class-validator';
import { DeepPartial } from 'typeorm';
import { CreateAddressDto } from 'src/modules/locations/address/dto/create-address.dto';

export class UpdateInstallationDto {

    @IsOptional()
    @IsISO8601()
    startDate: string

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
