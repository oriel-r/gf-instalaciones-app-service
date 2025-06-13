import { CreateAddressDto } from 'src/modules/locations/address/dto/create-address.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';
import { IsTodayOrAffterToday } from 'src/common/decorators/is-affter-today.valitaion';
import { Type } from 'class-transformer';

export class InstallationDataRequesDto {
  @ApiProperty({
    title: 'startDate',
    description: 'Fecha en la que se realizará la instalación',
  })
  @IsNotEmpty()
  @IsTodayOrAffterToday({ message: 'La fecha debe ser posterior a la actual.' })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    title: 'Address',
    description: 'Dirección de la instalación',
  })
  @IsNotEmpty()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({
    title: 'installers',
    description: 'Lista de IDs de instaladores',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  installersIds?: string[] | undefined;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  coordinatorsIds?: string[] | undefined;

  @ApiProperty({
    title: 'notes',
    description: 'Notas para los instaladores',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsOptional()
  @IsArray()
  coordinatorsEmails?: string[];

  @IsOptional()
  @IsArray()
  installersEmails?: string[];
}
