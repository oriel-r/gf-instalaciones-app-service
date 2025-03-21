import { BaseDto } from "src/common/entities/base.dto";
import { CreateAdressDto } from "src/modules/locations/adress/dto/create-adress.dto";
import { IsInstance, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsISO8601, ValidateNested } from "@nestjs/class-validator";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { Coordinator } from "src/modules/coordinators/entities/coordinator.entity";

export class InstallationDataRequesDto extends BaseDto{
    
    @ApiProperty({
        title: "startDate",
        description: "An date string to indicate the date will doing the installation"
    })
    @IsNotEmpty()
    @IsISO8601()
    startDate: string;
    
    @ApiProperty({
        title: "adress",
        description: "instalrion's adress, if no exist it created"
    })
    @IsNotEmpty()
    @Type(() => CreateAdressDto)
    adress: CreateAdressDto;

    @ApiProperty({
        title: 'installers',
        description: 'am installers array'
    })
    @IsNotEmpty()
    @ValidateNested({each: true})
    installers: Installer[]

    @ApiProperty()
    @IsNotEmpty()
    @IsInstance(Coordinator)
    coordinator: Coordinator

    @ApiProperty({
        title: 'notes',
        description: "notes for installers"
    })
    @IsString()
    @IsOptional()
    notes?: string
}
