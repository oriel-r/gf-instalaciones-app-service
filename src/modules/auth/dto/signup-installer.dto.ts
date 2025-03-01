import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
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
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @Length(3, 80)
  @IsNotEmpty()
  fullName: string;

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
    example: '01/03/1998',
  })
  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Número de identificación personal',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @ApiProperty({
    type: String,
    description: 'Localidad del usuario',
    example: 'Argentina',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    type: String,
    description: 'Dirección del usuario',
    example: 'Almagro, Yatay 567',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Pais del usuario',
    example: 'Argentina',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

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
  repeatPassword: string;

  @ApiProperty({
    type: String,
    description: 'Prefijo',
    example: '+54',
  })
  @IsOptional()
  @IsString()
  coverage?: string;

  @ApiProperty({
    enum: TaxCategory,
    description: 'Categoria fiscal del usuario',
    example: TaxCategory.Monotributist,
  })
  @IsNotEmpty()
  @IsEnum(TaxCategory)
  taxCondition: TaxCategory;

  @ApiPropertyOptional({
    description: 'Cualquier consulta o comentario adicional proporcionado por el usuario.',
    type: String,
    example: 'Consulta sobre disponibilidad de servicios.',
  })
  @IsOptional()
  @IsString()
  queries?: string;

  @ApiProperty({
    description: 'Indica si el usuario tiene seguro de accidentes personales.',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  hasPersonalAccidentInsurance: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede trabajar en altura de forma segura.',
    type: Boolean,
    example: false,
  })  
  @IsNotEmpty()
  @IsBoolean()
  canWorkAtHeight: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede tensar lonas frontal y trasera.',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  canTensionFrontAndBackLonas: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede instalar letreros corpóreos.',
    type: Boolean,
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  canInstallCorporealSigns: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede instalar vinilo esmerilado.',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  canInstallFrostedVinyl: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede instalar vinilo en paredes o vidrios.',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  canInstallVinylOnWallsOrGlass: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede realizar car wrapping (vinilado de autos).',
    type: Boolean,
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  canDoCarWrapping: boolean;

  @ApiProperty({
    description: 'Indica si el usuario cuenta con transporte propio.',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  hasOwnTransportation: boolean;
}
