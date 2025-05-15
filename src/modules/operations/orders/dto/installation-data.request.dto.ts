import { BaseDto } from "src/common/entities/base.dto";
import { CreateAddressDto } from "src/modules/locations/address/dto/create-address.dto";
import { IsArray, IsInstance, IsNotEmpty, IsOptional, IsString, IsUppercase, isUUID, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsISO8601, ValidateNested } from "class-validator";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Coordinator } from "src/modules/coordinators/entities/coordinator.entity";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";
import { UUID } from "crypto";

export class InstallationDataRequesDto extends BaseDto{
    
    @ApiProperty({
        title: "startDate",
        description: "An date string to indicate the date will doing the installation"
    })
    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value))
    startDate: Date;
    
    @ApiProperty({
        title: "Address",
        description: "instalrion's Address, if no exist it created"
    })
    @IsNotEmpty()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;

    @ApiProperty({
        title: 'installers',
        description: 'am installers array'
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    installersIds: UUID[]

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    coordinatorId: string

    @ApiProperty({
        title: 'notes',
        description: "notes for installers"
    })
    @IsString()
    @IsOptional()
    notes?: string
}
