import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import { TaxCategory } from 'src/modules/installer/enum/taxCategory.enum';

export class ExtendedInstallerDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'John',
    description: 'Nombre del usuario',
  })
  @IsString()
  @Length(3, 80)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Doe',
    description: 'Apellido del usuario',
  })
  @IsString()
  @Length(3, 80)
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'jone@example.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Fecha de nacimiento del usuario',
    example: '2025/01/03',
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  birthdate?: Date;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Número de identificación personal',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  identificationNumber: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  adress: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Número de télefono',
    example: '1134256282',
  })
@IsString()
@IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Contraseña del usuario',
    example: 'Jhon1234@',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Matches(/[!@#$%^&*]/, {
    message:
      'La contraseña debe contener al menos un carácter especial: !@#$%^&*',
  })
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Confimación de la contraseña del usuario',
    example: 'Jhon1234@',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsEnum(TaxCategory)
  taxCondition: TaxCategory;

  @IsString()
  @IsOptional()
  queries?: string;

  @IsBoolean()
  hasPersonalAccidentInsurance: boolean;

  @IsBoolean()
  canWorkAtHeight: boolean;

  @IsBoolean()
  canTensionFrontAndBackLonas: boolean;

  @IsBoolean()
  canInstallCorporealSigns: boolean;

  @IsBoolean()
  canInstallFrostedVinyl: boolean;

  @IsBoolean()
  canInstallVinylOnWallsOrGlass: boolean;

  @IsBoolean()
  canDoCarWrapping: boolean;

  @IsBoolean()
  hasOwnTransportation: boolean;
}
