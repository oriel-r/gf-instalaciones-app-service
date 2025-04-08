import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { TaxCategory } from 'src/common/enums/taxCategory.enum';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class ExtendedInstallerDto extends CreateUserDto {
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
    description:
      'Cualquier consulta o comentario adicional proporcionado por el usuario.',
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
    description:
      'Indica si el usuario puede trabajar en altura de forma segura.',
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
    description:
      'Indica si el usuario puede instalar vinilo en paredes o vidrios.',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  canInstallVinylOnWallsOrGlass: boolean;

  @ApiProperty({
    description:
      'Indica si el usuario puede realizar car wrapping (vinilado de autos).',
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

  @ApiProperty({
    description: 'Indica el estado del instalador',
    enum: StatusInstaller,
    example: 'En proceso, Aprobado, Rechazado',
  })
  @IsOptional()
  @IsEnum(StatusInstaller)
  status?: StatusInstaller;
}
