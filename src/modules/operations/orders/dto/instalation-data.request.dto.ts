import { BaseDto } from "src/common/entities/base.dto";
import { CreateAdressDto } from "src/modules/locations/adress/dto/create-adress.dto";
import { IsDateString, IsInstance, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class InstalationDataRequesDto extends BaseDto{
    
    @ApiProperty({
        title: "startDate",
        description: "An date string to indicate the date will doing the instalation"
    })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;
    
    @ApiProperty({
        title: "adress",
        description: "instalrion's adress, if no exist it created"
    })
    @IsNotEmpty()
    @Type(() => CreateAdressDto)
    adress: CreateAdressDto;

    @ApiProperty({
        title: 'notes',
        description: "notes for installers"
    })
    @IsString()
    @IsOptional()
    notes?: string
}
