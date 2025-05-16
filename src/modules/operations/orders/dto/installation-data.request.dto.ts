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
import { IsAfterToday } from "src/common/decorators/is-affter-today.valitaion";

export class InstallationDataRequesDto {
  
@ApiProperty({
    title: "startDate",
    description: "Fecha en la que se realizará la instalación"
  })
  @IsNotEmpty()
  @IsAfterToday({ message: 'La fecha debe ser posterior a la actual.' })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    title: "Address",
    description: "Dirección de la instalación"
  })
  @IsNotEmpty()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({
    title: 'installers',
    description: 'Lista de IDs de instaladores'
  })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  installersIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  coordinatorId: string;

  @ApiProperty({
    title: 'notes',
    description: "Notas para los instaladores"
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
